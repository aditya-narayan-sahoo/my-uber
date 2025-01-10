import Captain from "../models/captain.model.js";
import { validationResult } from "express-validator";
import { createCaptain } from "../services/captain.service.js";
import BlacklistToken from "../models/blacklistToken.model.js";

/**
 * Registers a captain
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>} - A promise that resolves with the response
 * The captain data is expected to be in the request body
 * The response will contain a JSON Web Token and the created captain
 */
export const registerCaptain = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { fullName, email, password, vehicle } = req.body;
    const captainAlreadyExists = await Captain.findOne({ email });
    if (captainAlreadyExists) {
      return res.status(400).json({ message: "Captain already exists" });
    }
    const hashedPassword = await Captain.hashPassword(password);
    const captain = await createCaptain({
      firstName: fullName.firstName,
      lastName: fullName.lastName,
      email,
      password: hashedPassword,
      color: vehicle.color,
      plate: vehicle.plate,
      capacity: vehicle.capacity,
      vehicleType: vehicle.vehicleType,
    });
    const token = captain.generateAuthToken();
    res.status(201).json({ token, captain });
  } catch (error) {
    console.log(`Error in registerCaptain controller: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};
/**
 * Logs in a captain
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>} - A promise that resolves with the response
 * The request body is expected to contain the email and password of the captain
 * The response will contain a JSON Web Token and the captain document
 */
export const loginCaptain = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const captain = await Captain.findOne({ email }).select("+password");
    if (!captain || !(await captain.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = captain.generateAuthToken();
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
    });
    res.status(200).json({ token, captain });
  } catch (error) {
    console.log(`Error in loginCaptain controller: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};
/**
 * Returns the captain profile of the logged-in captain
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>} - A promise that resolves with the response
 * The response will contain the captain document
 */
export const getCaptainProfile = async (req, res) => {
  try {
    const captain = req.captain;
    res.status(200).json({ captain });
  } catch (error) {
    console.log(`Error in getCaptainProfile controller: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};
/**
 * Logs out the captain by clearing the authentication token
 * The token is added to a blacklist to prevent further use
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>} - A promise that resolves with the response
 */
export const logoutCaptain = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    await BlacklistToken.create({ token });
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log(`Error in logoutCaptain controller: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};
