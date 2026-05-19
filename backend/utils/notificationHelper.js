import nodemailer from "nodemailer";

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  NOTIFICATION_FROM_EMAIL,
  NOTIFICATION_ADMIN_EMAIL,
  FRONTEND_URL,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_WHATSAPP_FROM,
} = process.env;

const frontendUrl = FRONTEND_URL || "https://newhms.vercel.app";

// const createTransporter = () => {
//   if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
//     console.log("Email transporter is not configured properly.");
//     return null;
//   }

//   return nodemailer.createTransport({
//     host: SMTP_HOST,
//     port: Number(SMTP_PORT),
//     secure: Number(SMTP_PORT) === 465,
//     auth: {
//       user: SMTP_USER,
//       pass: SMTP_PASS,
//     },
//   });
// };

const createTransporter = () => {

  if (!SMTP_USER || !SMTP_PASS) {
    console.log("Email transporter is not configured properly.");
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};





const transporter = createTransporter();

// const sendEmail = async ({ to, subject, text, html }) => {
//   if (!transporter || !to) {
//     console.log("Skipping email due to missing configuration or recipient.");
//     return false;
//   }

//   try {
//     await transporter.sendMail({
//       from: NOTIFICATION_FROM_EMAIL || SMTP_USER,
//       to,
//       subject,
//       text,
//       html,
//     });
//     return true;
//   } catch (error) {
//     console.error("Email send error:", error);
//     return false;
//   }
// };

const sendEmail = async ({ to, subject, text, html }) => {

  if (!transporter || !to) {
    console.log("Skipping email due to missing configuration or recipient.");
    return false;
  }

  try {

    console.log("Sending email to:", to);

    await transporter.sendMail({
      from: NOTIFICATION_FROM_EMAIL || SMTP_USER,
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent successfully");

    return true;

  } catch (error) {

    console.error("Email send error:", error);

    return false;
  }
};



const sendWhatsAppMessage = async ({ to, body }) => {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM || !to) {
    console.log("Skipping WhatsApp notification because Twilio is not configured.");
    return false;
  }

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          From: `whatsapp:${TWILIO_WHATSAPP_FROM}`,
          To: `whatsapp:${to}`,
          Body: body,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Twilio WhatsApp send failed: ${errorText}`);
    }

    return true;
  } catch (error) {
    console.error("WhatsApp send error:", error);
    return false;
  }
};

const buildAdminLink = () => `${frontendUrl}/admin-dashboard`;

export const sendBookingNotifications = async ({ type, contactEmail, contactPhone, subject, message }) => {
  const results = [];
  const adminEmail = NOTIFICATION_ADMIN_EMAIL;
  const baseMessage = `${message}\n\nView the booking progress: ${buildAdminLink()}`;

  if (contactEmail) {
    results.push(sendEmail({
      to: contactEmail,
      subject,
      text: baseMessage,
      html: `<p>${message.replace(/\n/g, "<br />")}</p><p><a href="${buildAdminLink()}">Check booking status</a></p>`,
    }));
  }

  if (contactPhone) {
    results.push(
      sendWhatsAppMessage({
        to: contactPhone,
        body: `${subject} \n\n${message} \n\nContinue: ${frontendUrl}`,
      })
    );
  }

  if (adminEmail) {
    results.push(
      sendEmail({
        to: adminEmail,
        subject: `[Admin] ${subject}`,
        text: `Admin notification:\n\n${message}`,
        html: `<p><strong>Admin notification:</strong></p><p>${message.replace(/\n/g, "<br />")}</p>`,
      })
    );
  }

  await Promise.allSettled(results);
};
