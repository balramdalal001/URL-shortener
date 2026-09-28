import { randomBytes } from "node:crypto";
import  redis  from "../../config/redis";
import { env } from "../../config/env";
import { createUrl, findUrlByCode ,AllUrlDetails} from "./url.repository";
import { UrlRecord } from "./url.types";

const cacheKey = (code: string) => `url:${code}`;

function generateCode(): string {
  return randomBytes(4).toString("base64url");
}

export async function shortenUrl(originalUrl: string): Promise<UrlRecord> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const record = await createUrl(generateCode(), originalUrl);

      //expire the cache after 5 minutes
      await redis.set(cacheKey(record.code), JSON.stringify(record),{
      EX: 300 
    });
      return record;
    } catch (error) {
      if (attempt === 4) throw error;
    }
  }

  throw new Error("Unable to create short URL");
}

export async function resolveUrl(code: string): Promise<UrlRecord | null> {
  const cachedValue = await redis.get(cacheKey(code));
  if (cachedValue) {
      return JSON.parse(cachedValue) as UrlRecord;
  }
  
 const record = await findUrlByCode(code);
  
  if (!record){
      throw new Error("Short URL not found");
  }

  await redis.set(cacheKey(code), JSON.stringify(record),{
    EX: 300 
  });
  return record;
}

export async function getAllUrlDetails(): Promise<UrlRecord[] | null> {
  let key = "allUrls";
  const cachedValue = await redis.get(cacheKey(key));
   if (cachedValue) {
      return JSON.parse(cachedValue) as UrlRecord[];
  }
 const record = (await AllUrlDetails()) ?? null;
  
  if (!record) return null;

  await redis.set(cacheKey(key), JSON.stringify(record),{
    EX: 300 
  });
  return record;
}

export function shortUrl(code: string): string {
  return `${env.BASE_URL}/${code}`;
}
