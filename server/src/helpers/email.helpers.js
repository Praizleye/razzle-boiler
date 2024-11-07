const eventTypes = require("../events/event.types");
const sendEmail = require("../utils/email.util");

const emailHelpers = async (payload) => {
  const { execution, param } = payload;

  if (!execution) {
    return console.error("Please provide an execution type");
  }

  if (execution === eventTypes.SEND_VERIFICATION_EMAIL) {
    console.log("🚀 ~ emailHelpers ~ param:", "getting here");
    // send email code
    const { token, firstName, lastName } = param;
    const subject = "Verify your email address";
    const html = `Hi ${firstName} ${lastName},<br><br>
        Please click the link below to verify your email address:<br><br>
        <a href="${process.env.CLIENT_URL}/verify-email/${token}">Verify Email</a><br><br>`;

    const emailResponse = await sendEmail(
      param.email,
      undefined,
      subject,
      html
    );
    return emailResponse;
  }
};

module.exports = emailHelpers;
