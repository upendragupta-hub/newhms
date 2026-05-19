const DEFAULT_FRONTEND_URL = "https://newhms.vercel.app";
const SENDGRID_PLACEHOLDER_VALUES = new Set([
  "your_sendgrid_api_key_here",
  "your_sendgrid_key_here",
  "changeme",
]);
const SMTP_USER_PLACEHOLDER_VALUES = new Set([
  "your_email@gmail.com",
  "your_email@example.com",
  "changeme",
]);
const SMTP_PASS_PLACEHOLDER_VALUES = new Set([
  "your_app_password_here",
  "your_email_password_here",
  "changeme",
]);

let activeSendGridApiKey = "";
let activeSmtpConfigSignature = "";
let emailServiceStatus = "unknown";
let sendGridClientPromise = null;
let smtpTransporterPromise = null;

const normalizeEnvValue = (value) =>
  typeof value === "string" ? value.trim() : "";

const parseBoolean = (value, fallback = false) => {
  const normalizedValue = normalizeEnvValue(value).toLowerCase();

  if (!normalizedValue) {
    return fallback;
  }

  return ["true", "1", "yes", "on"].includes(normalizedValue);
};

const reportEmailServiceStatus = (status, message) => {
  if (emailServiceStatus !== status) {
    console.log(message);
    emailServiceStatus = status;
  }
};

const isUsableValue = (value, placeholderValues = new Set()) => {
  const normalizedValue = normalizeEnvValue(value);

  if (!normalizedValue) {
    return false;
  }

  return !placeholderValues.has(normalizedValue.toLowerCase());
};

const getNotificationConfig = () => {
  const smtpUser = normalizeEnvValue(process.env.SMTP_USER);
  const smtpPass = normalizeEnvValue(process.env.SMTP_PASS);
  const smtpHost =
    normalizeEnvValue(process.env.SMTP_HOST) || "smtp.gmail.com";
  const smtpPort = Number(normalizeEnvValue(process.env.SMTP_PORT) || 587);
  const smtpService = normalizeEnvValue(process.env.SMTP_SERVICE);
  const smtpSecure = parseBoolean(
    process.env.SMTP_SECURE,
    Number.isFinite(smtpPort) ? smtpPort === 465 : false
  );
  const sendgridApiKey = normalizeEnvValue(process.env.SENDGRID_API_KEY);
  const configuredFromEmail = normalizeEnvValue(
    process.env.NOTIFICATION_FROM_EMAIL
  );

  return {
    smtpUser,
    smtpPass,
    smtpHost,
    smtpPort: Number.isFinite(smtpPort) ? smtpPort : 587,
    smtpService,
    smtpSecure,
    sendgridApiKey,
    fromEmail: configuredFromEmail || smtpUser || "noreply@newhms.com",
    adminEmail: normalizeEnvValue(process.env.NOTIFICATION_ADMIN_EMAIL),
    frontendUrl:
      normalizeEnvValue(process.env.FRONTEND_URL) || DEFAULT_FRONTEND_URL,
  };
};

const hasUsableSmtpConfig = (config) =>
  isUsableValue(config.smtpUser, SMTP_USER_PLACEHOLDER_VALUES) &&
  isUsableValue(config.smtpPass, SMTP_PASS_PLACEHOLDER_VALUES);

const getUsableSendGridApiKey = (config) => {
  const normalizedKey = config.sendgridApiKey.toLowerCase();

  if (
    !config.sendgridApiKey ||
    SENDGRID_PLACEHOLDER_VALUES.has(normalizedKey)
  ) {
    return "";
  }

  return config.sendgridApiKey;
};

const getSendGridClient = async () => {
  if (!sendGridClientPromise) {
    sendGridClientPromise = import("@sendgrid/mail")
      .then((module) => module.default || module)
      .catch((error) => {
        reportEmailServiceStatus(
          "sendgrid-unavailable",
          "SendGrid package is not installed, so SendGrid email delivery is unavailable."
        );
        console.error("Unable to load @sendgrid/mail:", error.message);
        return null;
      });
  }

  return sendGridClientPromise;
};

const getSmtpTransporter = async (config) => {
  const configSignature = JSON.stringify({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSecure,
    service: config.smtpService,
    user: config.smtpUser,
    pass: config.smtpPass,
  });

  if (
    smtpTransporterPromise &&
    activeSmtpConfigSignature === configSignature
  ) {
    return smtpTransporterPromise;
  }

  activeSmtpConfigSignature = configSignature;
  smtpTransporterPromise = import("nodemailer")
    .then((module) => {
      const nodemailer = module.default || module;
      const transportOptions = config.smtpService
        ? {
            service: config.smtpService,
            auth: {
              user: config.smtpUser,
              pass: config.smtpPass,
            },
          }
        : {
            host: config.smtpHost,
            port: config.smtpPort,
            secure: config.smtpSecure,
            auth: {
              user: config.smtpUser,
              pass: config.smtpPass,
            },
          };

      return nodemailer.createTransport(transportOptions);
    })
    .catch((error) => {
      reportEmailServiceStatus(
        "smtp-unavailable",
        "Nodemailer package is not installed, so SMTP email delivery is unavailable."
      );
      console.error("Unable to load nodemailer:", error.message);
      return null;
    });

  return smtpTransporterPromise;
};

const sendWithSmtp = async ({ to, subject, text, html, config }) => {
  const transporter = await getSmtpTransporter(config);

  if (!transporter) {
    return false;
  }

  try {
    reportEmailServiceStatus("smtp-configured", "SMTP email service configured");

    await transporter.sendMail({
      from: config.fromEmail,
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent successfully via SMTP to", to);
    return true;
  } catch (error) {
    console.error("SMTP email send error:", error.message);
    return false;
  }
};

const sendWithSendGrid = async ({ to, subject, text, html, config }) => {
  const sendgridApiKey = getUsableSendGridApiKey(config);

  if (!sendgridApiKey) {
    return false;
  }

  try {
    const sgMail = await getSendGridClient();

    if (!sgMail) {
      return false;
    }

    if (activeSendGridApiKey !== sendgridApiKey) {
      sgMail.setApiKey(sendgridApiKey);
      activeSendGridApiKey = sendgridApiKey;
    }

    reportEmailServiceStatus(
      "sendgrid-configured",
      "SendGrid email service configured"
    );

    await sgMail.send({
      to,
      from: config.fromEmail,
      subject,
      text,
      html,
    });

    console.log("Email sent successfully via SendGrid to", to);
    return true;
  } catch (error) {
    console.error("SendGrid email send error:", error.message);
    return false;
  }
};

const sendEmail = async ({ to, subject, text, html }) => {
  const config = getNotificationConfig();

  if (!to) {
    console.log("Skipping email because recipient is missing.");
    return false;
  }

  if (hasUsableSmtpConfig(config)) {
    const smtpResult = await sendWithSmtp({
      to,
      subject,
      text,
      html,
      config,
    });

    if (smtpResult) {
      return true;
    }
  }

  if (getUsableSendGridApiKey(config)) {
    const sendGridResult = await sendWithSendGrid({
      to,
      subject,
      text,
      html,
      config,
    });

    if (sendGridResult) {
      return true;
    }
  }

  reportEmailServiceStatus(
    "disabled",
    "Email notifications are disabled. Configure SMTP credentials or a valid SENDGRID_API_KEY."
  );
  console.log("Skipping email because no working email provider is configured.");
  return false;
};

const sendWhatsAppMessage = async ({ to, body }) => {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM } =
    process.env;

  if (
    !TWILIO_ACCOUNT_SID ||
    !TWILIO_AUTH_TOKEN ||
    !TWILIO_WHATSAPP_FROM ||
    !to
  ) {
    console.log(
      "Skipping WhatsApp notification because Twilio is not configured."
    );
    return false;
  }

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`
          ).toString("base64")}`,
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

const buildAdminLink = () => {
  const { frontendUrl } = getNotificationConfig();
  return `${frontendUrl}/admin-dashboard`;
};

export const sendBookingNotifications = async ({
  contactEmail,
  contactPhone,
  subject,
  message,
}) => {
  const { adminEmail, frontendUrl } = getNotificationConfig();
  const results = [];
  const baseMessage = `${message}\n\nView the booking progress: ${buildAdminLink()}`;

  if (contactEmail) {
    results.push(
      sendEmail({
        to: contactEmail,
        subject,
        text: baseMessage,
        html: `<p>${message.replace(/\n/g, "<br />")}</p><p><a href="${buildAdminLink()}">Check booking status</a></p>`,
      })
    );
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

  const settledResults = await Promise.allSettled(results);
  const deliveredCount = settledResults.filter(
    (result) => result.status === "fulfilled" && result.value === true
  ).length;

  console.log(
    `Notification summary for "${subject}": ${deliveredCount}/${settledResults.length} delivered.`
  );

  return settledResults;
};
