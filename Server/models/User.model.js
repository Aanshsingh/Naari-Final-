import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true, // allows many documents with no googleId, while still enforcing uniqueness when it IS set
    },

    refreshToken: {
      type: String,
    },

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },

    phone: String,

    addresses: [
      {
        label: String,
        line1: String,
        line2: String,
        city: String,
        state: String,
        pincode: String,
        isDefault: Boolean,
      },
    ],

    isVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: { type: String },
    emailVerificationExpiry: { type: Date },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  if (!this.password) return; // Google-only account — nothing to hash
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
  if (!this.password) return false; // no password set — can't log in this way
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};

export const User = mongoose.model("User", userSchema);
