import sqlite3 from "sqlite3";
import { getDb } from "./Common";
// User type definition
export interface User {
  UserId?: number;
  UserName: string;
  EmailId: string;
  Password: string;
}
// Save user details
export async function saveUser(user: User): Promise<number> {
  const db = await getDb();
  return new Promise(async (resolve, reject) => {
    const db = await getDb();
    db.run(
      "INSERT INTO Users (UserName, EmailId, Password) VALUES (?, ?, ?)",
      [user.UserName, user.EmailId, user.Password],
      function (err: Error | null) {
        db.close();
        if (err) {
          console.error("Error inserting user:", err);
          reject(err);
        } else {
          resolve(this.lastID); // Return the inserted row ID
        }
      }
    );
  });
}

// Get user details by EmailId
export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT UserId, UserName, EmailId, Password FROM Users WHERE EmailId = ?",
      [email],
      (err: Error | null, row: User) => {
        db.close();
        if (err) {
          console.error("Error fetching user by email:", err);
          reject(err);
        } else {
          resolve(row || null);
        }
      }
    );
  });
}
