import { NextResponse } from 'next/server';import {z} from 'zod';
import { prisma } from '@/lib/prisma';
import { calculate, defaultPrices, itemSchema, priceSchema } from '@/lib/pricing';
import {rateLimit} from '@/lib/rate-limit';
export async function POST(req:Request){
 try{
  const ip=req.headers.get('x-forwarded-for')?.split(',')[0]||'unknown';if(!(await rateLimit(`quote:${ip}`,40,60_000)))return NextResponse.json({error:'Слишком много запросов.'},{status:429});
  const body=await req.json(); const items=itemSchema.array().min(1).max(30).parse(body.items); const outsideCity=z.boolean().parse(body.outsideCity);
  const settings=await prisma.companySettings.findUnique({where:{id:'main'}});
  const prices=priceSchema.parse(settings?.prices??defaultPrices);
  return NextResponse.json(calculate(items,prices,outsideCity));
 }catch{return NextResponse.json({error:'Не удалось рассчитать заказ. Проверьте выбранные параметры.'},{status:400});}
}
