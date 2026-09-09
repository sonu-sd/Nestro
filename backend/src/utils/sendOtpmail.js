import nodemailer from "nodemailer";

const sendOtpMail = async (toEmail, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS.replace(/\s/g, ""),
            },
        });

        const mailOptions = {
            from: `"Nestro Website" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: "Verify Your Email - OTP",
            html: `
                <div style="font-family: Arial, sans-serif; padding:20px">
                    <h2>Email Verification</h2>
                    <p>Your OTP code is:</p>

                    <h1 style="letter-spacing:4px">
                        ${otp}
                    </h1>

                    <p>
                        This OTP is valid for <b>2 minutes</b>.
                    </p>

                    <p>
                        If you didn't request this, ignore this email.
                    </p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        console.log("✅ OTP email sent successfully");

        return true;

    } catch (error) {
        console.error("❌ OTP EMAIL ERROR:", error);
        throw error;
    }
};

export default sendOtpMail;