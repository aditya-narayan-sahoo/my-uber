import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const captainSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "Firstname must be at least 3 characters long"],
    },
    lastname: {
      type: String,
      minlength: [3, "Lastname must be at least 3 characters long"],
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  socketId: {
    type: String,
  },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  },

  vehicle: {
    color: {
      type: String,
      required: true,
      minlength: [3, "Color must be at least 3 characters long"],
    },
    plate: {
      type: String,
      required: true,
      minlength: [3, "Plate must be at least 3 characters long"],
    },
    capacity: {
      type: Number,
      required: true,
      min: [1, "Capacity must be at least 1"],
    },
    vehicleType: {
      type: String,
      required: true,
      enum: ["car", "moto", "auto"],
    },
  },

  location: {
    ltd: {
      type: Number,
    },
    lng: {
      type: Number,
    },
  },
});

/**
 * Generates a JSON Web Token for the captain instance.
 * The token contains the captain's unique identifier (_id) as the payload.
 * The token is signed using the JWT_SECRET environment variable and is valid for 24 hours.
 * @returns {string} - The generated authentication token
 */
captainSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

/**
 * Compares the provided password with the captain's hashed password.
 * @param {string} password - The password to compare with the captain's password
 * @returns {Promise<boolean>} - true if the password matches, false otherwise
 */
captainSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

/**
 * Hashes the provided password using the bcrypt library with a salt of 10.
 * @param {string} password - The password to hash
 * @returns {Promise<string>} - The hashed password
 */
captainSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const Captain = mongoose.model("Captain", captainSchema);
export default Captain;
