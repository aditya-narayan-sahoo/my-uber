import User from "../models/user.model.js";

/**
 * Creates a user
 * @param {Object} data - The user data
 * @param {string} data.firstName - The first name
 * @param {string} [data.lastName] - The last name
 * @param {string} data.email - The email
 * @param {string} data.password - The password
 * @returns {Promise<User>} - The user document
 * @throws {Error} If the required fields are not provided
 */
export const createUser = async ({ firstName, lastName, email, password }) => {
  if (!firstName || !email || !password) {
    throw new Error("These fields are required");
  }
  const user = User.create({
    fullName: { firstName, lastName },
    email,
    password,
  });
  return user;
};
