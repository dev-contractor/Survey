import sqlite3 from "sqlite3";
import { getDb } from "./Common";

// User type definition
export interface Survey {
  Question: string;
  Answers: string;
  Description: string;
  CreatedAt?: Date;
  CreatedBy?: number;
}



// Save Survey details

// Save multiple Survey details
export async function saveSurveys(surveys: Survey[]): Promise<number[]> {
  const db = await getDb();
  db.run("PRAGMA foreign_keys = ON");
  return new Promise((resolve, reject) => {
    const ids: number[] = [];
    db.serialize(() => {
      const stmt = db.prepare(
        "INSERT INTO Survey (Question, Answers, Description, CreateBy) VALUES (?, ?, ?, ?)"
      );
      for (const survey of surveys) {
        stmt.run(
          survey.Question,
          survey.Answers,
          survey.Description,
          survey.CreatedBy,
          function (this: sqlite3.RunResult, err: Error | null) {
            if (err) {
              stmt.finalize();
              db.close();
              reject(err);
              return;
            }
            ids.push(this.lastID);
          }
        );
      }
      stmt.finalize((err) => {
        db.close();
        if (err) {
          reject(err);
        } else {
          resolve(ids);
        }
      });
    });
  });
}
// Check if a survey entry exists for a specific user
export async function hasSurveyForUser(userId: number): Promise<boolean> {
  const db = await getDb();
  db.run("PRAGMA foreign_keys = ON");
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT 1 FROM Survey WHERE CreateBy = ? LIMIT 1",
      [userId],
      (err, row) => {
        db.close();
        if (err) {
          reject(err);
        } else {
          resolve(!!row);
        }
      }
    );
  });
}
