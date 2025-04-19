// src/controllers/userController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail, findUserById, updateUser } from "../models/userModel.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) return res.status(400).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser(name, email, hashedPassword);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: "Signup failed" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await findUserById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user); // ✅ This already returns full user
  } catch (err) {
    console.error("Get User By ID Error:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const updateUserById = async (req, res) => {
  const { id } = req.params;
  const { name, phone, email, gender, dob, address } = req.body;

  try {
    const user = await findUserById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // You can add additional checks here, such as if the email or phone number is already used.
    
    // Update user details
    const updatedUser = await updateUser(id, name, phone, email, gender, dob, address);

    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Update User Error:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
};
