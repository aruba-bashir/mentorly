import "dotenv/config";
import { Resend } from "resend";
console.log("RESEND_API_KEY =", process.env.RESEND_API_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, text) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Mentorly <noreply@ment-orly.com>",
      to,
      subject,
      text,
    });

    if (error) {
      console.error("Resend error:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Email sending failed:", error);
    return null;
  }
};