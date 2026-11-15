import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { randomToken, sha, safeEqual, checkOrigin } from '@/lib/security';
import { prisma } from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';
import bcrypt from 'bcryptjs';
export async function POST(req:Request){
 if(!(await checkOrigin()))return NextResponse.json({error:'Недопустимый источник.'},{status:403});
 const ip=req.headers.get('x-forwarded-for')||'unknown';if(!(await rateLimit(`login:${ip}`,6,300_000)))return NextResponse.json({error:'Слишком много попыток входа.'},{status:429});
 const {password}=await req.json().catch(()=>({password:''}));const credential=await prisma.adminCredential.findUnique({where:{id:'main'}});const hash=credential?.passwordHash||process.env.ADMIN_PASSWORD_HASH||'';
 const ok=hash.startsWith('$2')?await bcrypt.compare(String(password),hash):!!process.env.DEV_ADMIN_PASSWORD&&safeEqual(String(password),process.env.DEV_ADMIN_PASSWORD);
 if(!ok)return NextResponse.json({error:'Неверный пароль.'},{status:401});
 const token=randomToken();await prisma.adminSession.create({data:{tokenHash:sha(token),expiresAt:new Date(Date.now()+7*86400000)}});
 const c=await cookies();c.set('chistodom_admin',token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:7*86400});return NextResponse.json({ok:true});
}
