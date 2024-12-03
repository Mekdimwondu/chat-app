import { Request, Response } from "express";
import prisma from "../db/prisma";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken";

export const signUp = async (req: Request, res: Response): Promise<any> => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (!fullName || !username || !password || !confirmPassword || !gender) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    const user = await prisma.user.findUnique({ where: { username } });

    if (user) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // https://avatar-placeholder.iran.liara.run/
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = await prisma.user.create({
      data: {
        fullName,
        username,
        password: hashedPassword,
        gender,
        profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
      },
    });

    if (newUser) {
      // generate token in a sec
      generateToken(newUser.id, res);

      res.status(201).json({
        id: newUser.id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error: any) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const logIn = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, password } = req.body;

    // Check if username or password is missing
    if (!username || !password) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    // Find the user from the database
    const user = await prisma.user.findUnique({ where: { username } });

    // If user is not found
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Incorrect Password" });
    }

    // Generate and send token
    generateToken(user.id, res); // Make sure this function is working correctly

    // Send user data (Do not send the password back)
    return res.status(200).json({
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
    });
  } catch (error: any) {
    // Log the error with a detailed message
    console.error("Error during login:", error); // This will log the entire error object

    // If error has a message, log it and return the message
    if (error.message) {
      console.error("Error message:", error.message);
    }

    // Return a generic server error (do not expose internal error details)
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const logOut = async (req: Request, res: Response): Promise<any> => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "logged out successfuly" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getMe = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
      gender: user.gender,
    });
  } catch (error: any) {
    res.status(500).json({ error: "Internal server error" });
  }
};
