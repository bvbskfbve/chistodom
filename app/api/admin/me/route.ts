import {NextResponse} from 'next/server';import {isAdmin} from '@/lib/security';
export async function GET(){return NextResponse.json({authenticated:await isAdmin()});}
