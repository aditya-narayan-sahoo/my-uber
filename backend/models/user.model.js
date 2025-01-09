import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    firstName: {
      type: String,
      required: true,
      minlength: [3, "First name must be at least 3 characters long"],
    },
    lastName: {
      type: String,
      minlength: [3, "Last name must be at least 3 characters long"],
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: [5, "Email must be at least 5 characters long"],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  socketId: { type: String },
});

/**
 * Generates a JSON Web Token for the user instance.
 * The token contains the user's unique identifier (_id) as the payload.
 * The token is signed using the JWT_SECRET environment variable and is valid for 24 hours.
 * @returns {string} - The generated authentication token
 */
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

/**
 * Compares the provided password with the user's hashed password.
 * @param {string} password - The password to compare with the user's password
 * @returns {Promise<boolean>} - true if the password matches, false otherwise
 */
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

/**
 * Hashes the provided password using the bcrypt library with a salt of 10.
 * @param {string} password - The password to hash
 * @returns {Promise<string>} - The hashed password
 */
userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const User = mongoose.model("User", userSchema);
export default User;
