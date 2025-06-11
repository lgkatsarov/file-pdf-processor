import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "lgkatsarov@gmail.com",
    pass: "ujjp bkyt oujx tieg",
  },
});

export const sendEmail = async (to, subject, text, attachment) => {
  const info = await transporter.sendMail({
    from: '"Lyuben Katsarov" <lgkatsarov@gmail.com>',
    to: to,
    subject: `Detailed information about your car - ${subject}`,
    text: `Hello,\n\nPlease find attached the PDF with detailed information about your car.\n\n${text}\n\nBest regards,\nRylan Kohler`,
    attachments: [
      {
        filename: attachment.name,
        path: attachment.path,
        content: attachment.content,
        contentType: "application/pdf",
      },
    ],
  });

  return info.response;
};
