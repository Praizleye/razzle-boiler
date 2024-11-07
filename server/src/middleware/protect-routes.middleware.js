const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const userSchema = require("../users/schema/user.schema");
const { customErrorHandler } = require("./error-handler.middleware");

const protectRoutes = async (req, res, next) => {
  try {
    const cookies = cookie.parse(req.headers.cookie || "");
    // console.log("🚀 ~ protectRoutes ~ cookies:", cookies);
    // const accessToken = req.cookies["accessToken"] || "";
    // const refreshToken = req.cookies["refreshToken"] || "";
    // console.log("🚀 ~ protectRoutes ~ accessToken:", accessToken);
    // console.log("🚀 ~ protectRoutes ~ refreshToken:", refreshToken);
    const refreshToken = cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (refreshToken) {
      //   use the refresh token to generate a new access token

      const handleDecodedFunction = async (decoded) => {
        const user = await userSchema
          .findById(decoded.id)
          .select("+refreshToken")
          .lean()
          .exec();
        // console.log("🚀 ~ handleDecodedFunction ~ user:", user);
        if (!user) {
          return res.status(403).json({ message: "Forbidden" });
        }

        //   check the refresh token in the database
        if (user.refreshToken !== refreshToken) {
          return res.status(403).json({ message: "Forbidden" });
        }

        //   //   handle password change
        //     if (user.passwordChangedAfter(decoded.iat)) {
        //         return res.status(403).json({ message: "Forbidden" });
        //     }

        //     const newAccessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
        //     res.cookie("access-token", newAccessToken, { maxAge: 900000, httpOnly: true });
        //     req.user = user;
        //     return next();
        return (({ refreshToken, password, ...rest }) => rest)(user);
      };

      const handleDecodedJwt = await promisify(jwt.verify)(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      try {
        const decoded = await handleDecodedJwt;
        const user = await handleDecodedFunction(decoded);
        if (user) {
          req.user = user;
          return next();
        }
      } catch (error) {
        console.log("🚀 ~ protectRoutes ~ error:", error);
        customErrorHandler(403, "Forbidden", next);
      }
    }

    next();
  } catch (error) {
    console.log("🚀 ~ protectRoutes ~ error:", error);
    customErrorHandler(403, "Forbidden", next);
  }
};

module.exports = protectRoutes;
