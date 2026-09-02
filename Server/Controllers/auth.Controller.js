import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js"
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import { OAuth2Client } from "google-auth-library";
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


import { generateVerificationToken, sendVerificationEmail } from "../utils/sendVerificationEmail.js"; 

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    console.log("User:", user);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("REAL ERROR:", error);

    throw error;
  }
};

// const cookieOptions = {
//   httpOnly: true,
//   secure: process.env.NODE_ENV === "production",
//   sameSite: "strict",
// };

const cookieOptions = {
  httpOnly: true,
  secure: true, // required for sameSite: "none" — must be unconditional, not tied to NODE_ENV
  sameSite: "none", // required for cross-domain cookies between your frontend and Render backend
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  if ([name, email, password, phone].some((field) => !field || field.trim() === "")) {
    throw new ApiError(400, "Name, email, password, and phone are required");
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "User already exists with this email");
  }

  const { token, expiry } = generateVerificationToken();

  const addresses = address
    ? [{
        label: address.label || "Home",
        line1: address.line1,
        line2: address.line2 || "",
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        isDefault: true,
      }]
    : [];

  const user = await User.create({
    name, email, password, phone, addresses,
    emailVerificationToken: token,
    emailVerificationExpiry: expiry,
  });

  // THIS WAS MISSING — actually send the email
  try {
    await sendVerificationEmail(user, token);
  } catch (err) {
    console.error("Failed to send verification email:", err);
    // don't fail registration just because the email didn't send — user account still exists
  }

  const createdUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken");
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  return res.status(201).json(new ApiResponse(201, createdUser, "User registration completed"));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await user.isPasswordCorrect(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, { user: loggedInUser, accessToken }, "User logged in"));
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken?.id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or already used");
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refreshed"));
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old password and new password are required");
  }

  const user = await User.findById(req.user._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { name, email, phone, addresses } = req.body;

  if (!name && !email && !phone && !addresses) {
    throw new ApiError(400, "At least one field is required to update");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { name, email, phone, addresses } },
    { new: true }
  ).select("-password -refreshToken");

  return res.status(200).json(new ApiResponse(200, user, "Account details updated successfully"));
});

// auth.controller.js — add these
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Verification link is invalid or has expired");
  }

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, "Email verified successfully"));
});

const resendVerificationEmail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user.isVerified) {
    throw new ApiError(400, "Email is already verified");
  }

  const { token, expiry } = generateVerificationToken();
  user.emailVerificationToken = token;
  user.emailVerificationExpiry = expiry;
  await user.save({ validateBeforeSave: false });

  await sendVerificationEmail(user, token);

  return res.status(200).json(new ApiResponse(200, {}, "Verification email sent"));
});

const googleLogin = asyncHandler(async (req, res) => {
  const { credential } = req.body;
  if (!credential) throw new ApiError(400, "Google credential is required");

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch (err) {
    throw new ApiError(401, "Invalid Google token");
  }

  const { sub: googleId, email, name } = payload;

  let user = await User.findOne({ email });

  if (user) {
    // account already exists (maybe signed up with email/password) — link Google to it
    if (!user.googleId) {
      user.googleId = googleId;
      await user.save({ validateBeforeSave: false });
    }
  } else {
    // brand new user, signing up via Google for the first time
    user = await User.create({
      name,
      email,
      googleId,
      isVerified: true, // Google has already verified this email address for us
    });
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, { user: loggedInUser, accessToken }, "Logged in with Google"));
});




export {
  registerUser,
  login,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  verifyEmail,
  resendVerificationEmail,
  googleLogin,
};