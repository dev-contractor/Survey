import {Survey,  saveSurveys, hasSurveyForUser } from "./data/Survey";
import { Router,  Request,  Response } from "express";
import { getUserByEmail } from "./data/Users";
import { authenticateToken } from "./usersRoutes";
const router = Router();

// Example of a protected route
router.get("/survey", authenticateToken, async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  // Fetch user profile from database
  const email = (req as any).user.email;
  const user = await getUserByEmail(email);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user });
});

// Define a route to save a list of Surveys
router.post("/Survey", authenticateToken, async (req: Request, res: Response) => {
   const answers = req.body.answers;
  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ message: "No answers provided" });
  }


  // Optionally, add CreatedAt and CreatedBy if not present
  const userId = (req as any).user.userId;

   // Map payload to Survey[]
  const surveysToSave: Survey[] = answers.map((a: any) => ({
    Question: a.Question,
    Answers: a.Answers,
    Description: a.Description || "",
    CreatedAt: new Date(),
    CreatedBy: a.userId || userId
  }));

 
  try {
    const surveyIds = await saveSurveys(surveysToSave);
    res.status(201).json({ message: "Surveys created successfully", surveyIds });
  } catch (err: any) {
    console.error("Error saving Surveys:", err);
    res.status(500).json({ message: "Internal server error : " + err.message });
  }
});


// API to check if a survey already exists for the authenticated user
router.get("/survey/exists", authenticateToken, async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  try {
    const exists = await hasSurveyForUser(userId);
    res.json({ exists });
  } catch (err: any) {
    console.error("Error checking survey existence:", err);
    res.status(500).json({ message: "Internal server error: " + err.message });
  }
});



export default router;