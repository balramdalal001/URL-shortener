import { randomBytes } from "node:crypto";
// import { redis } from "../../config/redis";
import { env } from "../../config/env";
import { addUser ,login,getUserDetails} from "./user.repository";
import { UserCreateBody ,UserLoginBody} from "./user.schema";
import { UserCreateRes ,UserLoginRes,UserDetailRes} from "./user.type";

// const cacheKey = (code: string) => `url:${code}`;


export async function newUser(body: UserCreateBody): Promise<UserCreateRes> {
    try {
      await addUser(body);
    //   await redis.set(cacheKey(record.code), record.originalUrl);
      return { message: "User created successfully" };
    } catch (error) {
       throw error;
    }
}

export async function verifyUser(body: UserLoginBody): Promise<UserLoginRes> {
    try {
      const record = await login(body);
    //   await redis.set(cacheKey(record.code), record.originalUrl);
      if (!record || record.id === undefined || record.email === undefined) {
        throw new Error("Invalid user record");
      }

      return {
        id: String(record.id),
        email: String(record.email),
        message: "User verified successfully",
      };
    } catch (error) {
       throw error;
    }
}

export async function getUserById(userId: string): Promise<UserDetailRes> {
    try {
      const record = await getUserDetails(userId);
    //   await redis.set(cacheKey(record.code), record.originalUrl);
      if (!record || record.id === undefined || record.email === undefined) {
        throw new Error("Invalid user record");
      }

      return record;
    } catch (error) {
       throw error;
    }
}