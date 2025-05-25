import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import User from "../models/userSchema";
import { getGoogleUser } from "./googleOAuth";
import { getGoogleOAuthToken } from "./googleOAuth";

export const googleOAuthHandler = async (req: Request, res: Response) => {
  try {
    console.log("Google OAuth callback received");
    const code = req.query.code;

    if (typeof code !== "string") {
      console.log("Invalid code:", code);
      return res.status(400).send("Invalid or missing code");
    }

    console.log("Getting Google OAuth token...");
    const tokenResponse = await getGoogleOAuthToken({ code });

    if (tokenResponse.error) {
      console.error("Error getting OAuth token:", tokenResponse.error);
      return res.status(500).send("Failed to get OAuth token");
    }

    const { id_token, access_token } = tokenResponse;

    console.log("Getting Google user info...");
    const googleUser: any = await getGoogleUser({ id_token, access_token });

    if (googleUser.error) {
      console.error("Error getting user info:", googleUser.error);
      return res.status(500).send("Failed to get user info");
    }

    console.log("Google user email:", googleUser.email);
    let user: any = await User.findOne({ email: googleUser.email });

    // if no user then save user to db
    if (!user) {
      console.log("Creating new user...");
      // Remove verification check as Google accounts are already verified
      // if (!googleUser.verified_email) {
      //   return res.status(403).send("Google account is not verified");
      // }

      const picture = googleUser.picture
        ? googleUser.picture.replace("=s96-c", "=s512-c")
        : "";

      //create new user
      user = new User({
        name: googleUser.name,
        email: googleUser.email,
        picture: picture,
        password: "google-oauth",
      });

      await user.save();
      console.log("New user created:", user.email);
    } else {
      console.log("Existing user found:", user.email);
    }

    createAndSendToken(user, res);
  } catch (error) {
    console.error("Google OAuth error:", error);
    return res.redirect(`${process.env.CLIENT_DOMAIN}/signin`); // Update to /signin instead of /login
  }
};

// Create JWT TOKEN
const createAndSendToken = (user: any, res: Response) => {
  try {
    console.log("Creating JWT token...");
    const accessToken = jwt.sign(
      { _id: user._id, username: user.email },
      process.env.PRIVATE_KEY as string,
      {
        expiresIn: "12h",
      }
    );

    if (process.env.NODE_ENV === "production") {
      console.log("Production mode: Setting cookie and redirecting...");
      res.cookie("jwtoken", accessToken, {
        maxAge: 43200000, // 12 hr
        httpOnly: true,
        path: "/",
        sameSite: "none",
        secure: true,
      });
      // Redirect to the charts page instead of home
      return res.redirect(`${process.env.CLIENT_DOMAIN}/`);
    } else {
      console.log("Development mode: Redirecting with token in URL...");
      // For development, pass the token via URL for the client to handle
      return res.redirect(
        `${process.env.CLIENT_DOMAIN}/oauth?token=${accessToken}`
      );
    }
  } catch (error) {
    console.error("Token creation error:", error);
    return res.redirect(
      `${process.env.CLIENT_DOMAIN}/signin?error=token_creation_failed`
    );
  }
};
