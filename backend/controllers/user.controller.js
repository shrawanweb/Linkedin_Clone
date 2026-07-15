import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import ConnectionRequest from "../models/connections.model.js";
import crypto from "crypto";

import bcrypt from "bcrypt";
import PDFDocument from "pdfkit";
import fs from "fs";
import { log } from "console";

const convertUserDataTOPDF = async (userData) => {
  const doc = new PDFDocument();

  const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
  const stream = fs.createWriteStream("uploads/" + outputPath);

  doc.pipe(stream);

  doc.image(`uploads/${userData.userId.profilePicture}`, {
    align: "center",
    width: 100,
  });
  doc.fontSize(14).text(`Name: ${userData.userId.name}`);
  doc.fontSize(14).text(`Username: ${userData.userId.username}`);
  doc.fontSize(14).text(`Email: ${userData.userId.email}`);
  doc.fontSize(14).text(`Bio: ${userData.bio}`);
  doc.fontSize(14).text(`Current Position: ${userData.currentPost}`);

  doc.fontSize(14).text("Past Work: ");
  userData.pastWork.forEach((work, index) => {
    doc.fontSize(12).text(`Company Name: ${work.company}`);
    doc.fontSize(12).text(`Position: ${work.position}`);
    doc.fontSize(12).text(`Years: ${work.Years}`);
  });

  doc.end();

  return outputPath;
};

export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });
    await newUser.save();

    const profile = new Profile({ userId: newUser._id });

    await profile.save();

    return res.json({ message: "User Created" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");

    // Save token
    user.token = token;
    await user.save();

    return res.status(200).json({
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const uploadProfilePicture = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.profilePicture = req.file.filename;
    await user.save();
    return res.json({ message: "Profile picture updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { token, ...newUserData } = req.body;

    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { username, email } = newUserData;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      if (existingUser || String(existingUser._id) !== String(user._id)) {
        return res.status(400).json({ message: "User already exists" });
      }
    }

    Object.assign(user, newUserData);
    await user.save();
    return res.json({ message: "User updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserAndProfile = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { token } = req.body;

    console.log("TOKEN RECEIVED:", token);

    const user = await User.findOne({ token });

    console.log("USER FOUND:", user);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const userProfile = await Profile.findOne({
      userId: user._id,
    }).populate("userId", "name email username profilePicture");

    console.log("PROFILE:", userProfile);

    return res.json({ userProfile });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateProfileData = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { token, ...newProfileData } = req.body;

    const user = await User.findOne({ token });

    console.log("USER:", user);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const profile = await Profile.findOne({
      userId: user._id,
    });

    console.log("PROFILE BEFORE:", profile);

    Object.assign(profile, newProfileData);

    console.log("PROFILE AFTER:", profile);

    await profile.save();

    console.log("PROFILE SAVED");

    return res.json({
      message: "Profile updated",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const getAllUserProfile = async (req, res) => {
  try {
    const profiles = await Profile.find().populate(
      "userId",
      "name email username profilePicture",
    );
    return res.json({ profiles });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const downloadProfile = async (req, res) => {
  const user_id = req.query.id;
  const userProfile = await Profile.findOne({ userId: user_id }).populate(
    "userId",
    "name email username profilePicture",
  );

  let outputPath = await convertUserDataTOPDF(userProfile);

  return res.json({ message: outputPath });
};

export const sendConnectionRequest = async (req, res) => {
  const { token, connectionId } = req.body;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const connectionUser = await User.findOne({ _id: connectionId });

    if (!connectionUser) {
      return res.status(404).json({ message: "Connection user not found" });
    }

    const existingRequest = await ConnectionRequest.findOne({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Request already sent" });
    }

    const request = new ConnectionRequest({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    await request.save();

    return res.json({ message: "Connection request sent" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getMyConnectionsRequests = async (req, res) => {
  try {
    const { token } = req.body;

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const connections = await ConnectionRequest.find({
      userId: user._id,
    }).populate(
      "connectionId",
      "name username email profilePicture"
    );

    return res.json({
      connections,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const whatAreMyConnections = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const connections = await ConnectionRequest.find({
      connectionId: user._id,
    }).populate(
      "userId",
      "name username email profilePicture"
    );

    return res.json({
      connections,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const acceptConnectionRequest = async (req, res) => {
  const { token, requestId, action_type } = req.body;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connection = await ConnectionRequest.findOne({ _id: requestId });

    if (!connection) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    if (action_type === "accept") {
      connection.status_accepted = true;
    } else {
      connection.status_accepted = false;
    }

    await connection.save();
    return res.json({ message: "Connection request updated" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getUserProfileAndUserBasedOnUsername = async (req, res) => {
  const { username } = req.query;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name username email profilePicture",
    );

    return res.json({ userProfile });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
