const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

function generateReferralCode(objectId) {
  // Take the last 8 characters of the ObjectId
  const idSubstring = objectId.toString().slice(-8);

  // Convert to base62 (alphanumeric)
  const base62 = convertToBase62(idSubstring);

  // Add a prefix (optional)
  return "REF-" + base62;
}

function convertToBase62(hex) {
  const base62Chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let decimal = parseInt(hex, 16);
  let result = "";

  while (decimal > 0) {
    result = base62Chars[decimal % 62] + result;
    decimal = Math.floor(decimal / 62);
  }

  return result.padStart(6, "0"); // Ensure the result is always 6 characters long
}

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true, // remove whitespace
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true, // remove whitespace
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true, // remove whitespace
      minlength: 5,
      maxlength: 255,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true, // remove whitespace
      minlength: 8,
      maxlength: 1024,
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ["user", "admin", "super-admin"],
        message: (props) => `${props.value} is not supported`,
      },
      default: "user",
      required: [true, "Role is required"],
    },
    refreshToken: {
      type: String,
      default: null,
      select: false,
    },
    referralCode: {
      type: String,
      default: null,
      unique: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.virtual("subscriptions", {
  ref: "Subscription",
  localField: "_id",
  foreignField: "userId",
});

userSchema.pre("save", async function (next) {
  if (!this.referralCode) {
    this.referralCode = generateReferralCode(this._id);
  }
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  const user = await bcrypt.compare(password, this.password);

  return user;
};

module.exports = mongoose.model("User", userSchema);
