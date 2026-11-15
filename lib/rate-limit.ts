import {Redis} from '@upstash/redis';
let redis:Redis|undefined;
const memory=new Map<string,{count:number,reset:number}>();
export async function rateLimit(key:string,limit=8,windowMs=60_000):Promise<boolean>{
 const url=process.env.UPSTASH_REDIS_REST_URL,token=process.env.UPSTASH_REDIS_REST_TOKEN;
 if(url&&token){try{redis??=new Redis({url,token});const count=await redis.incr(`chistodom:rl:${key}`);if(count===1)await redis.expire(`chistodom:rl:${key}`,Math.ceil(windowMs/1000));return count<=limit;}catch{return false;}}
 if(process.env.NODE_ENV==='production')return false;
 const now=Date.now(),b=memory.get(key);if(!b||b.reset<now){memory.set(key,{count:1,reset:now+windowMs});return true;}if(b.count>=limit)return false;b.count++;return true;
}
