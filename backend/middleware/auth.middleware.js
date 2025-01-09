import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import BlacklistToken from "../models/blacklistToken.model.js";

/**
 * Authenticates a user using the token provided in the request headers or cookies
 * The token is verified against the JWT_SECRET environment variable
 * If the token is valid, the user is fetched from the database and added to the request object
 * The user is then passed to the next middleware
 * If the token is invalid, expired, or blacklisted, an appropriate error message is sent in the response
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware
 * @returns {Promise<void>} - A promise that resolves with the response
 */
export const authUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized access: Token not found" });
  }
  const isBlacklisted = await BlacklistToken.findOne({ token });
  if (isBlacklisted) {
    return res
      .status(401)
      .json({ message: "Unauthorized access: Token blacklisted" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Unauthorized access: User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(`Error in authUser middleware: ${error.message}`);
    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ message: "Unauthorized access: Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Unauthorized access: Token expired" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Authenticates a captain using the token provided in the request headers or cookies
 * The token is verified against the JWT_SECRET environment variable
 * If the token is valid, the captain is fetched from the database and added to the request object
 * The captain is then passed to the next middleware
 * If the token is invalid, expired, or blacklisted, an appropriate error message is sent in the response
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware
 * @returns {Promise<void>} - A promise that resolves with the response
 */
export const authCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized access: Token not found" });
  }
  const isBlacklisted = await BlacklistToken.findOne({ token });
  if (isBlacklisted) {
    return res
      .status(401)
      .json({ message: "Unauthorized access: Token blacklisted" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const captain = await Captain.findById(decoded._id);
    if (!captain) {
      return res
        .status(401)
        .json({ message: "Unauthorized access: Captain not found" });
    }
    req.captain = captain;
    next();
  } catch (error) {
    console.log(`Error in authCaptain middleware: ${error.message}`);
    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ message: "Unauthorized access: Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Unauthorized access: Token expired" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};
