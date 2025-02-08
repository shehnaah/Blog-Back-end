const CustomError = require("../../Helpers/error/CustomError");
const User = require("../../Models/user");
const jwt = require("jsonwebtoken");
const asyncErrorWrapper = require("express-async-handler");
const { isTokenIncluded, getAccessTokenFromHeader } = require("../../Helpers/auth/tokenHelpers");

const getAccessToRoute = asyncErrorWrapper(async (req, res, next) => {
    const { JWT_SECRET_KEY } = process.env;

    console.log("🔍 Checking if token is included..."); // Debugging
    if (!isTokenIncluded(req)) {
        console.log("🚨 No token found in headers!");
        return next(new CustomError("You are not authorized to access this route", 401));
    }

    const accessToken = getAccessTokenFromHeader(req);
    console.log("🛠 Token extracted:", accessToken); // Debugging

    try {
        // Verify token
        const decoded = jwt.verify(accessToken, JWT_SECRET_KEY);
        console.log("✅ Token decoded successfully:", decoded); // Debugging

        // Find user
        const user = await User.findById(decoded.id);
        if (!user) {
            console.log("🚨 User not found in database!");
            return next(new CustomError("User not found. Authorization denied.", 401));
        }

        console.log("👤 User found:", user.username); // Debugging
        req.user = user;
        next();
    } catch (error) {
        console.log("🚨 Error verifying token:", error.message); // Debugging
        if (error.name === "TokenExpiredError") {
            return next(new CustomError("JWT expired. Please log in again.", 401));
        }
        return next(new CustomError("Invalid token. Authorization denied.", 401));
    }
});

module.exports = { getAccessToRoute };
