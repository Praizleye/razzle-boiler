const mongoose = require("mongoose");
const userSchema = require("./user.schema");

const confirmEmailSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: userSchema.modelName,
      required: [true, "User ID is required"],
    },
    token: {
      type: String,
      required: [true, "Token is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 15,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("ConfirmEmail", confirmEmailSchema);
