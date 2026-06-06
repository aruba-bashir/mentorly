import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "aruba9541@gmail.com",
      pass: "syrznyeuhevsjjnu",
    },
  });

  await transporter.sendMail({
    from: "Mentorly <aruba9541@gmail.com>",
    to,
    subject,
    text,
  });
};