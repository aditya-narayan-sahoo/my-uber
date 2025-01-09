import mongoose from "mongoose";

const blacklistTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 864000, // expires in 1 day that is given in seconds
  },
});

const BlacklistToken = mongoose.model("BlacklistToken", blacklistTokenSchema);
export default BlacklistToken;
