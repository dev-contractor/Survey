import {  saveUser, User } from "./data/Users";
import { Router,  Request,  Response } from "express";
import jwt from "jsonwebtoken";
import { getUserByEmail } from "./data/Users";


const router = Router();
 const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
// Define a route to save a user
router.post("/Users", (req: Request, res: Response) => {
    const newUser: User = {
    UserName: "John Doe",
    EmailId: "john@example3.com",
    Password: "securepassword123"
  };
    saveUser(newUser)
        .then(userId => {
        res.status(201).json({ message: "User created successfully", userId });
        })
        .catch(err => {
        console.error("Error saving user:", err);
        res.status(500).json({ message: "Internal server error" });
        });
});
// Login route
router.post("/login", async (req: Request, res: Response) => {
  const { EmailId, Password } = req.body;
  try {
    const user = await getUserByEmail(EmailId);
    if (!user || user.Password !== Password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
   
    const token = jwt.sign(
      { userId: user.UserId, email: user.EmailId },
        JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token, user: { userId: user.UserId, email: user.EmailId, username:  user.UserName } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Middleware to authenticate JWT token
export function authenticateToken(req: Request, res: Response, next: Function) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token required" });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    (req as any).user = user;
    next();
  });
}


export default router;