const userSchema = require("./schema/user.schema");
const confirmEmailSchema = require("./schema/confirm-email.schema");
const {
  customErrorHandler,
  errorHandler,
  successHandler,
} = require("../middleware/error-handler.middleware");
const { generateToken, verifyToken } = require("../utils/jwt.util");
const emailHelpers = require("../helpers/email.helpers");
const jwt = require("jsonwebtoken");
const cookieOptions = require("../helpers/cookie.helpers");
const cookie = require("cookie");
const walletSchema = require("../wallet/schemas/wallet.schema");
const emitEvent = require("../events/event.emitter");
const eventTypes = require("../events/event.types");

//@desc signup a  user
// @route POST /api/users
// @access Public
const createUserService = async (req, res, next) => {
  try {
    //   check if email already exists
    const emailExists = await userSchema.findOne({ email: req.body.email });
    if (emailExists) {
      return customErrorHandler(400, "User already exists", next);
    }
    // create new user
    //   ensure that the role is user
    const newUser = new userSchema({ ...req.body, role: "user" });
    const savedUser = await newUser.save();

    // generate token
    const magicLinkToken = generateToken(
      savedUser._id,
      process.env.MAGIC_LINK_SECRET,
      60 * 60 * (15 / 60) // 15 minutes
    );

    //   save token in confirmation bucket
    const res = await confirmEmailSchema.create({
      userId: savedUser._id,
      token: magicLinkToken,
    });

    // send email
    // await emailHelpers({
    //   execution: "send-magic-link",
    //   param: {
    //     firstName: savedUser.firstName,
    //     lastName: savedUser.lastName,
    //     token: magicLinkToken,
    //   },
    // });
    emitEvent(eventTypes.SEND_VERIFICATION_EMAIL, {
      execution: "send-magic-link",
      param: {
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        token: magicLinkToken,
        email: savedUser.email,
      },
    });

    successHandler(
      res,
      {
        value: savedUser,
        message: "user created successfully, please verify your email",
      },
      201
    );

    return;
  } catch (error) {
    console.log("🚀 ~ createUserService ~ error:", error);
    customErrorHandler(400, error.message, next);
  }
};

//@desc resend verification email
// @route POST /api/users/resend-verification-email
// @access Public
const resendVerificationEmailService = async (req, res, next) => {
  try {
    //  check if user exists in the user bucket
    const user = await userSchema.findById(req.body.id);
    if (!user) {
      // throw a misleading message
      return customErrorHandler(401, "Unauthorised", next);
    }

    //   check if the user exists in the confirm email bucket
    const userInConfirmEmailBucket = await confirmEmailSchema
      .find({ userId: req.body.id })
      .sort({ createdAt: -1 });

    //  check if the user has reached the maximum number of attempts
    if (userInConfirmEmailBucket.length >= 3) {
      return customErrorHandler(
        400,
        "You have reached the maximum number of attempts",
        next
      );
    }

    // generate token
    const magicLinkToken = generateToken(
      user._id,
      process.env.MAGIC_LINK_SECRET,
      60 * 60 * (15 / 60) // 15 minutes
    );

    //   save token in confirmation bucket
    await confirmEmailSchema.create({
      userId: user._id,
      token: magicLinkToken,
    });

    // send email
    emitEvent(eventTypes.SEND_VERIFICATION_EMAIL, {
      execution: eventTypes.SEND_VERIFICATION_EMAIL,
      param: {
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        token: magicLinkToken,
      },
    });
    successHandler(res, { message: "Email sent successfully" }, 200);
  } catch (error) {
    customErrorHandler(400, error.message, next);
  }
};
const resendVerificationHelper = async (payload) => {
  //  check if user exists in the user bucket
  const user = await userSchema.findById(payload.body.id);
  if (!user) {
    // throw a misleading message
    return "Unauthorised";
  }

  console.log("🚀 ~ resendVerificationHelper ~ user:", user);
  //   check if the user exists in the confirm email bucket
  const userInConfirmEmailBucket = await confirmEmailSchema
    .find({ userId: payload.body.id })
    .sort({ createdAt: -1 });

  //  check if the user has reached the maximum number of attempts
  if (userInConfirmEmailBucket.length >= 3) {
    return "You have reached the maximum number of attempts";
  }

  // generate token
  const magicLinkToken = generateToken(
    user._id,
    process.env.MAGIC_LINK_SECRET,
    60 * 60 * (15 / 60) // 15 minutes
  );

  //   save token in confirmation bucket
  await confirmEmailSchema.create({
    userId: user._id,
    token: magicLinkToken,
  });

  // send email
  emitEvent(eventTypes.SEND_VERIFICATION_EMAIL, {
    execution: eventTypes.SEND_VERIFICATION_EMAIL,
    param: {
      firstName: user.firstName,
      lastName: user.lastName,
      token: magicLinkToken,
      email: user.email,
    },
  });
};

// @desc confirm the magic link token and update the user
// @route GET /api/users/confirm-email/:token
// @access Public
const confirmEmailService = async (req, res, next) => {
  try {
    //   check if token exists in the confirm email bucket
    const token = await confirmEmailSchema
      .find({ token: req.params.token })
      .sort({ createdAt: -1 });
    if (!token || token.length === 0) {
      return customErrorHandler(400, "Invalid token", next);
    }

    // check

    //   check if the token has expired by 15 mins
    const currentTime = new Date();
    const tokenTime = token[0].createdAt;
    const timeDifference = currentTime - tokenTime;
    // add a 2 minutes buffer to the token just in case knowing this is not an accurate way to handle this
    if (timeDifference > 60 * 17 * 1000) {
      return customErrorHandler(400, "Token has expired", next);
    }

    //   verify the token
    const verifiedToken = verifyToken(
      req.params.token,
      process.env.MAGIC_LINK_SECRET
    );
    if (!verifiedToken && token[0].userId !== verifiedToken.id) {
      return customErrorHandler(400, "unauthorized", next);
    }

    // check if the user has already been verified
    const userVerified = await userSchema.findById(token[0].userId);
    if (userVerified.isVerified) {
      return customErrorHandler(400, "User already verified", next);
    }

    jwt.verify(
      token[0].token,
      process.env.MAGIC_LINK_SECRET,
      async (err, decoded) => {
        if (err) customErrorHandler(403, "Forbidden", next);

        //  check if the user exists in the user bucket
        const user = await userSchema.findById(decoded.id);
        if (!user) {
          customErrorHandler(401, "Unauthorized", next);
        }
        if (user.isVerified) {
          customErrorHandler(400, "User already verified", next);
        }
        //  update the user
        const updateUser = await userSchema.findByIdAndUpdate(
          decoded.id,
          { isVerified: true },
          { new: true }
        );
        //you can choose to send the user a welcome message here

        // create the user wallet here
        await walletSchema.create({ userId: decoded.id, balance: 0 });

        successHandler(
          res,
          { value: updateUser, message: "Email verified successfully" },
          200
        );
      }
    );
  } catch (error) {
    customErrorHandler(400, error.message, next);
  }
};

// @desc login a user
// @route POST /api/users/login
// @access Public
const loginUserService = async (req, res, next) => {
  try {
    // double check if email and password are provided
    if (!req.body.email || !req.body.password) {
      return customErrorHandler(400, "Email and password are required", next);
    }

    // check if email exists
    const user = await userSchema
      .findOne({ email: req.body.email })
      .select("+password");

    if (!user) {
      return customErrorHandler(400, "Invalid email or password", next);
    }
    // check if user is verified
    if (!user.isVerified) {
      // send verification email
      resendVerificationHelper({ body: { id: user._id } });
      return customErrorHandler(400, "Please verify your email", next);
    }

    // check if password is correct
    const validPassword = await user.comparePassword(req.body.password);
    if (!validPassword) {
      return customErrorHandler(400, "Invalid email or password", next);
    }
    // create token

    const accessToken = generateToken(
      user._id,
      process.env.ACCESS_TOKEN_SECRET,
      60 * 60 * (15 / 60) // 15 minutes
    );
    const refreshToken = generateToken(
      user._id,
      process.env.REFRESH_TOKEN_SECRET,
      60 * 60 * 24 // 1 day / 24 hours
    );

    // save the tokens in a cookies
    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 60 * 15 * 1000, // 15 minutes
    });
    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 1000, // 1 day
    });

    // save this token in the db
    const userUpdate = await userSchema.findByIdAndUpdate(
      user._id,
      { refreshToken },
      { new: true }
    );

    // this is another way to set cookies especially in a non express app
    // res.setHeader("Set-Cookie", cookie.serialize("accessToken", accessToken, {
    //   ...cookieOptions,
    //   maxAge: 60 * 15 * 1000, // 15 minutes
    // }));

    // res.setHeader("Set-Cookie", cookie.serialize("refreshToken", refreshToken, {
    //   ...cookieOptions,
    //   maxAge: 60 * 60 * 24* 1000, // 1day
    // }));

    successHandler(
      res,
      { value: userUpdate, message: "Login successful" },
      200
    );
  } catch (error) {
    console.log("🚀 ~ loginUserService ~ error:", error);
    customErrorHandler(400, error.message, next);
  }
};

// @desc logout a user
// @route POST /api/users/logout
// @access Private
const logoutUserService = async (req, res, next) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    successHandler(res, { message: "Logout successful" }, 200);
  } catch (error) {
    customErrorHandler(400, error.message, next);
  }
};

// @desc forgot password
// @route POST /api/users/forgot-password
// @access Public
const forgotPasswordService = async (req, res, next) => {
  try {
    // check if email exists
    const user = await userSchema.findOne({ email: req.body.email });

    // also throw a misleading message
    if (!user) {
      return customErrorHandler(401, "Unauthorized", next);
    }

    // generate token
    const magicLinkToken = generateToken(
      user._id,
      process.env.MAGIC_LINK_SECRET,
      60 * 60 * (15 / 60) // 15 minutes
    );

    // save token in confirmation bucket
    await confirmEmailSchema.create({
      userId: user._id,
      token: magicLinkToken,
    });

    // send email
    await emailHelpers({
      execution: "send-magic-link",
      param: {
        firstName: user.firstName,
        lastName: user.lastName,
        token: magicLinkToken,
        email: user.email,
      },
    });

    successHandler(res, { message: "Email sent successfully" }, 200);
  } catch (error) {
    customErrorHandler(400, error.message, next);
  }
};

getUsersSessionService = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return customErrorHandler(401, "Unauthorized", next);

    successHandler(res, { value: user, message: "User session" }, 200);
  } catch (error) {
    customErrorHandler(500, error.message, next);
  }
};

module.exports = {
  createUserService,
  resendVerificationEmailService,
  confirmEmailService,
  loginUserService,
  logoutUserService,
  forgotPasswordService,
  getUsersSessionService,
};
