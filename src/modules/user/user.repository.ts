import { database } from "../../config/database";
import { UserCreateBody ,UserLoginBody} from "./user.schema";
import { UsrRow ,UserLoginRow,UserDetailRes} from "./user.type";
import bcrypt from "bcrypt";



export async function addUser(body: UserCreateBody): Promise<UsrRow> {
    try {
        //check email exist or not
        const checkEmail = await database.query<UsrRow>(
            "SELECT * FROM users WHERE email = $1",
            [body.email]
        );
        if (checkEmail.rows.length > 0) {
            throw new Error("Email already exists");
        }
        // 1. Generate salt rounds and hash the password
  const saltRounds = 12; // Balanced workload factor for modern hardware
  const hashedPassword = await bcrypt.hash(body.password, saltRounds);
        const result = await database.query<UsrRow>(
            "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at, password_hash",
            [body.email, hashedPassword]
        );
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

export async function login(body: UserLoginBody): Promise<UserLoginRow | null> {
    try {
        const result = await database.query<UsrRow>(
            "SELECT id, email, password_hash, created_at FROM users WHERE email = $1",
            [body.email]
        );
        const user = result.rows[0];
        if (!user) {
             throw new Error("Invalid email.");; // User not found
        }

        // Compare the provided password with the stored hash
        const isPasswordValid = await bcrypt.compare(body.password, user.password_hash);
        if (!isPasswordValid) {
            throw new Error("Invalid password."); // Invalid password
        }

        return user; // Successful login
    } catch (error) {
        throw error;
    }
}   

export async function getUserDetails(userId: string): Promise<UserDetailRes | null> {
    try {
        const result = await database.query<UserDetailRes>(
            "SELECT id, email FROM users WHERE id = $1",
            [userId]
        );
        const user = result.rows[0];
        if (!user) {
             throw new Error("Invalid user ID."); // User not found
        }
        return user;
    } catch (error) {
        throw error;
    }
} 

export async function createCustomer(filePath: string): Promise<void> {
    try {
        // Assuming you have a function to read the CSV file and return an array of user objects
        // const users = await readCsvFile(filePath); // Implement this function to read the CSV

        // for (const user of users) {
        //     // Check if the email already exists
        //     const checkEmail = await database.query<UsrRow>(
        //         "SELECT * FROM users WHERE email = $1",
        //         [user.email]
        //     );
        //     if (checkEmail.rows.length > 0) {
        //         console.log(`Email ${user.email} already exists. Skipping.`);
        //         continue; // Skip existing emails
        //     }

        //     // Hash the password before inserting
        //     const saltRounds = 12;
        //     const hashedPassword = await bcrypt.hash(user.password, saltRounds);

        //     await database.query(
        //         "INSERT INTO users (email, password_hash) VALUES ($1, $2)",
        //         [user.email, hashedPassword]
        //     );
        // }
    } catch (error) {
        throw error;
    }
}
