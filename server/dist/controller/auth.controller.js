"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logOut = exports.logIn = exports.signUp = void 0;
const prisma_1 = __importDefault(require("../db/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const signUp = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;
        // Ensure that required fields are provided
        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ error: "Please fill all fields" });
        }
        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }
        // Check if username already exists
        const user = await prisma_1.default.user.findUnique({ where: { username } });
        if (user) {
            return res.status(400).json({ error: "Username already exists" });
        }
        // Hash the password using bcrypt
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        // Profile picture based on gender
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        // Create a new user in the database
        const newUser = await prisma_1.default.user.create({
            data: {
                fullName,
                username,
                password: hashedPassword,
                gender,
                profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
            },
        });
        // If user is created successfully, generate a token and send response
        if (newUser) {
            (0, generateToken_1.default)(newUser.id, res); // Assuming generateToken function works correctly
            return res.status(201).json({
                id: newUser.id,
                fullName: newUser.fullName,
                profilePic: newUser.profilePic,
            });
        }
        else {
            return res.status(400).json({ error: "Invalid user data" });
        }
    }
    catch (error) {
        // Handle unexpected errors
        console.error(error); // Log error for debugging
        return res.status(500).json({ message: "Internal server error", error });
    }
};
exports.signUp = signUp;
const logIn = async (req, res) => {
    res.send("login");
};
exports.logIn = logIn;
const logOut = async (req, res) => { };
exports.logOut = logOut;
