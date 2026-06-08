//import nodemailer from "nodemailer";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, text) => {
  try {
    const data = await resend.emails.send({
      from: "Mentorly <onboarding@resend.dev>",
      to,
      subject,
      text,
    });

    return data;
  } catch (error) {
    console.error("Email error:", error);
  }
};