import Captain from "../models/captain.model.js";

/**
 * Creates a captain
 * @param {Object} data - The captain data
 * @param {string} data.firstName - The first name
 * @param {string} [data.lastName] - The last name
 * @param {string} data.email - The email
 * @param {string} data.password - The password
 * @param {string} data.color - The vehicle color
 * @param {string} data.plate - The vehicle plate
 * @param {number} data.capacity - The vehicle capacity
 * @param {string} data.vehicleType - The vehicle type
 * @returns {Promise<Captain>} - The captain document
 * @throws {Error} If the required fields are not provided
 */
export const createCaptain = async ({
  firstName,
  lastName,
  email,
  password,
  color,
  plate,
  capacity,
  vehicleType,
}) => {
  if (
    !firstName ||
    !email ||
    !password ||
    !color ||
    !plate ||
    !capacity ||
    !vehicleType
  ) {
    throw new Error("All fields are required");
  }

  const captain = Captain.create({
    fullname: { firstname: firstName, lastname: lastName },
    email,
    password,
    vehicle: {
      color,
      plate,
      capacity,
      vehicleType,
    },
  });
  return captain;
};
