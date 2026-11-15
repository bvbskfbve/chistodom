import { createHash, randomBytes, timingSafeEqual, createHmac } from 'node:crypto';
import { cookies, headers } from 'next/headers';
import { prisma } from './prisma';
export const sha=(s:string)=>createHash('sha256').update(s).digest('hex');
export const randomToken=(bytes=32)=>randomBytes(bytes).toString('base64url');
export const orderTokenFor=(key:string)=>{const secret=process.env.SESSION_SECRET;if(!secret&&process.env.NODE_ENV==='production')throw new Error('SESSION_SECRET is required in production.');return createHmac('sha256',secret||'local-development-secret-change-before-deploy').update(key).digest('base64url');};
export async function checkOrigin(){
 const h=await headers(); const origin=h.get('origin');
 if(!origin) return process.env.NODE_ENV!=='production';
 try { return new URL(origin).host===h.get('host'); } catch { return false; }
}
export async function isAdmin(){
 const c=await cookies(); const token=c.get('chistodom_admin')?.value; if(!token)return false;
 const session=await prisma.adminSession.findUnique({where:{tokenHash:sha(token)}});
 return !!session&&session.expiresAt.getTime()>Date.now();
}
export async function requireAdmin(){if(!(await isAdmin()))throw new Error('UNAUTHORIZED');}
export function safeEqual(a:string,b:string){const aa=Buffer.from(a),bb=Buffer.from(b);return aa.length===bb.length&&timingSafeEqual(aa,bb);}
