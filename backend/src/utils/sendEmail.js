
/*
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, text) => {
  try {
    const result = await resend.emails.send({
      from: "Mentorly <onboarding@resend.dev>",
      to,
      subject,
      text,
    });

    console.log("EMAIL SENT:", result);
    return result;
  } catch (error) {
    console.error("RESEND ERROR:", error);
  }
}; */

import { Resend } from "resend";

console.log("🔥 sendEmail MODULE LOADED");

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, text) => {
  try {
    console.log("👉 sendEmail FUNCTION CALLED");
    console.log("📧 TO:", to);
    console.log("📌 SUBJECT:", subject);
    console.log("🔑 API KEY EXISTS:", !!process.env.RESEND_API_KEY);

    const result = await resend.emails.send({
      from: "Mentorly <onboarding@resend.dev>",
      to,
      subject,
      text,
    });

    console.log("✅ EMAIL SENT SUCCESSFULLY:", result);

    return result;
  } catch (error) {
    console.error("❌ RESEND ERROR:", error);
  }
};