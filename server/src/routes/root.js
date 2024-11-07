const express = require("express");
const router = express.Router();
const path = require("path");
const webpush = require("web-push");

webpush.setVapidDetails(
  "mailto:hello@homifiafrica.com",
  "BBd9tZamPDyofPsgZRGJM2MV7BeLevdrI3VP5HIqUtEFGGCwCAxN48yYlmp0F-6Ltun0bxBpT4pAuZiMp_Q0U9E",
  "joRti3rj2cwDTV03I_O-MfBbcyUnXOIxj11ZSNReBMk"
);

router.get("^/$|/index(.html)?", (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

module.exports = router;
