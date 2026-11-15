import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const prices = {
 sofa2: 2800, sofa3: 3600, sofaCorner: 4800,
 armchair: 1500, recliner: 2100,
 mattressSingle: 2200, mattressDouble: 3400,
 chairSeat: 450, chairBack: 650,
 minOrder: 2500, heavySoilingPercent: 25, secondSidePercent: 60, outsideCityFee: 900
};
async function main(){ if(process.env.ADMIN_PASSWORD_HASH){await prisma.adminCredential.upsert({where:{id:'main'},create:{id:'main',passwordHash:process.env.ADMIN_PASSWORD_HASH},update:{}});} await prisma.companySettings.upsert({where:{id:'main'},update:{},create:{id:'main',prices, name:'ЧистоДом', city:'', territory:'', accent:'#668477'}}); }
main().finally(()=>prisma.$disconnect());
