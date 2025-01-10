import User from "../models/user.model.js";
import { validationResult } from "express-validator";
import { createUser } from "../services/user.service.js";
import BlacklistToken from "../models/blacklistToken.model.js";

/**
 * Registers a user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>} - A promise that resolves with the response
 */
export const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { fullName, email, password } = req.body;
    const hashedPassword = await User.hashPassword(password);
    const user = await createUser({
      firstName: fullName.firstName,
      lastName: fullName.lastName,
      email,
      password: hashedPassword,
    });
    const token = user.generateAuthToken();
    res.status(201).json({ token, user });
  } catch (error) {
    console.log(`Error in registerUser controller: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Logs in a user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>} - A promise that resolves with the response
 */
export const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = user.generateAuthToken();
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
    });
    res.status(200).json({ token, user });
  } catch (error) {
    console.log(`Error in loginUser controller: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Returns the user profile of the logged-in user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>} - A promise that resolves with the response
 */
export const getUserProfile = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({ user });
  } catch (error) {
    console.log(`Error in getUserProfile controller: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Logs out the user by clearing the authentication token.
 * The token is added to a blacklist to prevent further use.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>} - A promise that resolves with the response
 */

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    await BlacklistToken.create({ token });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log(`Error in logoutUser controller: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};
