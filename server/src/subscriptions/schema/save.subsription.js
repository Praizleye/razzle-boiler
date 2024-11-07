const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    subscription: {
      type: {
        endpoint: { type: String },
        expirationTime: { type: String },
        keys: {
          p256dh: { type: String },
          auth: { type: String },
        },
      },
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
