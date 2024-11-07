const cookieOptions = {
  secure: true,
  sameSite: "none",
  httpOnly: true,
  // path: "/",
  partitioned: true,
};

module.exports = cookieOptions;
