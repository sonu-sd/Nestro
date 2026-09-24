const sendOtpMail = async (toEmail, otp) => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  if (!apiKey || !senderEmail) throw new Error("BREVO_NOT_CONFIGURED");

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: "Nestro", email: senderEmail },
      to: [{ email: toEmail }],
      subject: "Verify your Nestro account",
      htmlContent: `<div style="font-family:Arial,sans-serif;padding:20px"><h2>Email verification</h2><p>Your OTP code is:</p><h1 style="letter-spacing:4px">${otp}</h1><p>This code is valid for ${Number(process.env.OTP_TTL_MINUTES) || 10} minutes.</p><p>If you did not request this, you can ignore this email.</p></div>`,
    }),
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok)
    throw new Error(`Brevo email request failed with HTTP ${response.status}`);
  return true;
};

export default sendOtpMail;
