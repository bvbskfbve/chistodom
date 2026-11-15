import {mkdir,writeFile,readFile,unlink} from 'node:fs/promises';
import path from 'node:path';
import {S3Client,PutObjectCommand,GetObjectCommand,DeleteObjectCommand} from '@aws-sdk/client-s3';
let client:S3Client|undefined;
const bucket=()=>process.env.S3_BUCKET||'';
function s3(){if(!client){const accessKeyId=process.env.S3_ACCESS_KEY_ID,secretAccessKey=process.env.S3_SECRET_ACCESS_KEY;client=new S3Client({region:process.env.S3_REGION||'us-east-1',...(process.env.S3_ENDPOINT?{endpoint:process.env.S3_ENDPOINT}:{}),forcePathStyle:process.env.S3_FORCE_PATH_STYLE==='true',...(accessKeyId&&secretAccessKey?{credentials:{accessKeyId,secretAccessKey}}:{})});}return client;}
function localPath(key:string){return path.join(process.env.UPLOAD_DIR||'./uploads',key);}
function ensureStorage(){if(!bucket()&&process.env.NODE_ENV==='production')throw new Error('Configure private S3 storage before production deployment.');}
export async function putPrivateObject(key:string,data:Buffer,contentType:string){ensureStorage();if(bucket()){await s3().send(new PutObjectCommand({Bucket:bucket(),Key:key,Body:data,ContentType:contentType,CacheControl:'private, no-store'}));return;}await mkdir(process.env.UPLOAD_DIR||'./uploads',{recursive:true});await writeFile(localPath(key),data,{flag:'wx'});}
export async function getPrivateObject(key:string):Promise<Uint8Array>{ensureStorage();if(bucket()){const result=await s3().send(new GetObjectCommand({Bucket:bucket(),Key:key}));if(!result.Body)throw new Error('Photo body is empty.');return await result.Body.transformToByteArray();}return new Uint8Array(await readFile(localPath(key)));}
export async function deletePrivateObject(key:string){if(bucket()){await s3().send(new DeleteObjectCommand({Bucket:bucket(),Key:key}));return;}await unlink(localPath(key)).catch(()=>{});}
