import { NextResponse } from 'next/server';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { prisma } from '@/lib/prisma';
import { calculate, defaultPrices, itemSchema, priceSchema, mergeIdenticalItems } from '@/lib/pricing';
import { checkOrigin, orderTokenFor, sha } from '@/lib/security';
import { rateLimit } from '@/lib/rate-limit';
import {putPrivateObject,deletePrivateObject} from '@/lib/storage';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const maxDuration=30;
const formSchema=z.object({idempotencyKey:z.string().uuid(),customerName:z.string().trim().min(2).max(100),phone:z.string().trim().min(6).max(30),address:z.string().trim().min(5).max(300),outsideCity:z.enum(['true','false']),preferredDate:z.string().optional().default(''),preferredTime:z.string().optional().default(''),comment:z.string().max(1500).optional().default(''),consent:z.literal('true'),items:z.string()});
const magic=(b:Buffer)=>b.length>12&&((b[0]===0xff&&b[1]===0xd8&&b[2]===0xff)||(b.subarray(0,8).toString('hex')==='89504e470d0a1a0a')||(b.subarray(0,4).toString()==='RIFF'&&b.subarray(8,12).toString()==='WEBP'));
export async function POST(req:Request){
 const saved:string[]=[];
 try{
  if(!(await checkOrigin()))return NextResponse.json({error:'Недопустимый источник запроса.'},{status:403});
  const contentLength=Number(req.headers.get('content-length')||0);if(contentLength>26*1024*1024)return NextResponse.json({error:'Общий размер запроса слишком большой.'},{status:413});
  const ip=req.headers.get('x-forwarded-for')?.split(',')[0]||'unknown';if(!(await rateLimit(`order:${ip}`,5,60_000)))return NextResponse.json({error:'Слишком много заявок. Попробуйте позже.'},{status:429});
  const fd=await req.formData();
  const parsed=formSchema.safeParse(Object.fromEntries(['idempotencyKey','customerName','phone','address','outsideCity','preferredDate','preferredTime','comment','consent','items'].map(k=>[k,String(fd.get(k)??'')])));
  if(!parsed.success)return NextResponse.json({error:'Проверьте обязательные поля.',fields:parsed.error.flatten().fieldErrors},{status:422});
  const v=parsed.data;const parsedItems=itemSchema.array().min(1).max(30).parse(JSON.parse(v.items));const items=mergeIdenticalItems(parsedItems);
  if(v.preferredTime&&!v.preferredDate)return NextResponse.json({error:'Для желаемого времени сначала укажите дату.',field:'preferredDate'},{status:422});
  if(v.preferredDate){const date=new Date(`${v.preferredDate}T00:00:00.000Z`);if(!/^\d{4}-\d{2}-\d{2}$/.test(v.preferredDate)||Number.isNaN(date.getTime())||date.toISOString().slice(0,10)!==v.preferredDate)return NextResponse.json({error:'Укажите корректную дату.',field:'preferredDate'},{status:422});}
  if(v.preferredTime&&!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(v.preferredTime))return NextResponse.json({error:'Укажите корректное время.',field:'preferredTime'},{status:422});
  if(items.some(i=>i.type==='other'&&(!i.description||i.description.trim().length<2)))return NextResponse.json({error:'Опишите предмет в поле «Другое».',field:'items'},{status:422});
  const token=orderTokenFor(v.idempotencyKey);const tokenHash=sha(token);
  const duplicate=await prisma.order.findUnique({where:{idempotencyKey:v.idempotencyKey}});
  if(duplicate)return NextResponse.json({ok:true,token,url:`/order/${token}`,duplicate:true});
  const files=fd.getAll('photos').filter((f):f is File=>f instanceof File&&f.size>0);
  if(files.length>3)return NextResponse.json({error:'Можно приложить не более трёх фотографий.'},{status:422});
  if(items.some(i=>i.type==='other')&&files.length===0)return NextResponse.json({error:'Для услуги «Другое» приложите хотя бы одну фотографию.',field:'photos'},{status:422});
  const settings=await prisma.companySettings.findUnique({where:{id:'main'}});const prices=priceSchema.parse(settings?.prices??defaultPrices);
  const calc=calculate(items,prices,v.outsideCity==='true');
  const photoData=[];
  for(const file of files){
   if(file.size>8*1024*1024)throw new Error('PHOTO:Каждая фотография должна быть не больше 8 МБ.');
   const raw=Buffer.from(await file.arrayBuffer());if(!magic(raw))throw new Error('PHOTO:Фотографии должны быть настоящими файлами JPEG, PNG или WebP.');
   let meta;try{meta=await sharp(raw,{limitInputPixels:30_000_000}).metadata();}catch{throw new Error('PHOTO:Фотографию не удалось прочитать. Выберите другое изображение.');}if(!['jpeg','png','webp'].includes(meta.format||''))throw new Error('PHOTO:Формат фотографии не поддерживается.');
   let out:Buffer;try{out=await sharp(raw).rotate().resize({width:1800,height:1800,fit:'inside',withoutEnlargement:true}).webp({quality:82}).toBuffer();}catch{throw new Error('PHOTO:Не удалось обработать фотографию. Попробуйте другое изображение.');}
   const key=`${randomUUID()}.webp`;await putPrivateObject(key,out,'image/webp');saved.push(key);
   photoData.push({storageKey:key,originalName:file.name.slice(0,180),mimeType:'image/webp',size:out.length});
  }
  const order=await prisma.order.create({data:{tokenHash,idempotencyKey:v.idempotencyKey,customerName:v.customerName,phone:v.phone,address:v.address,outsideCity:v.outsideCity==='true',preferredDate:v.preferredDate||null,preferredTime:v.preferredTime||null,comment:v.comment,consentAt:new Date(),items:calc.lines as any,pricingSnapshot:prices as any,knownSubtotal:calc.knownSubtotal,cleaningTotal:calc.cleaningTotal,travelFee:calc.travelFee,estimateTotal:calc.estimateTotal,photos:{create:photoData},history:{create:{action:'created',detail:'Заявка создана клиентом'}}}});
  return NextResponse.json({ok:true,token,url:`/order/${token}`,orderId:order.id});
 }catch(e:any){await Promise.all(saved.map(key=>deletePrivateObject(key).catch(()=>{})));const msg=e?.message||'Не удалось отправить заявку.';const photoError=msg.startsWith('PHOTO:');return NextResponse.json({error:photoError?msg.slice(6):msg.includes('Unique constraint')?'Заявка с таким ключом уже существует.':msg,...(photoError?{field:'photos'}:{})},{status:photoError?422:400});}
}
