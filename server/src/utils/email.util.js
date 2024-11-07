const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(
  to,
  from = "Acme <onboarding@resend.dev>",
  subject = "Hello world!",
  html = "<strong>It works!</strong>"
) {
  if (!to) {
    return console.error("Please provide a recipient email address");
  }
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
  });

  if (error) {
    return console.error({ error });
  }

  return { data };
}

module.exports = sendEmail;
