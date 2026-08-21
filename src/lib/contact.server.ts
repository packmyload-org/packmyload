import { sendMail, TEAM_INBOX } from "@/lib/booking.server";

export type ContactMessage = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function shell(title: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:#f1f5f9;font-family:Helvetica,Arial,sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:28px">
    <div style="background:#ffffff;border-radius:18px;padding:28px">
      <h1 style="margin:0 0 12px;font-size:20px;color:#0f172a">${title}</h1>
      ${body}
      <p style="margin-top:22px;font-size:12px;color:#94a3b8">Packmyload · Lagos &amp; Abuja, Nigeria · 0700 722 5776</p>
    </div>
  </div></body></html>`;
}

export async function sendContactEmails(input: ContactMessage) {
  const name = escapeHtml(input.name);
  const email = escapeHtml(input.email);
  const phone = escapeHtml(input.phone);
  const message = escapeHtml(input.message).replace(/\n/g, "<br/>");

  const team = await sendMail({
    to: [TEAM_INBOX],
    subject: `Website enquiry from ${input.name}`,
    replyTo: input.email,
    html: shell(
      "New website enquiry",
      `<table style="width:100%;border-collapse:collapse;font-size:13px">
        <tr><td style="color:#64748b;padding:6px 12px 6px 0">Name</td><td style="font-weight:600;color:#0f172a">${name}</td></tr>
        <tr><td style="color:#64748b;padding:6px 12px 6px 0">Email</td><td style="font-weight:600;color:#0f172a">${email}</td></tr>
        <tr><td style="color:#64748b;padding:6px 12px 6px 0">Phone</td><td style="font-weight:600;color:#0f172a">${phone}</td></tr>
      </table>
      <p style="margin-top:16px;font-size:14px;color:#0f172a">${message}</p>`,
    ),
  });

  const customer = await sendMail({
    to: [input.email],
    subject: "We received your message — Packmyload",
    html: shell(
      "Thanks for reaching out",
      `<p style="font-size:14px;color:#0f172a">Hi ${name.split(" ")[0]}, we have your message and a move consultant will reply within one business day.</p>
       <p style="font-size:13px;color:#64748b">Your message:</p>
       <p style="font-size:14px;color:#0f172a">${message}</p>
       <p style="font-size:13px;color:#64748b">Need us sooner? Call 0700 722 5776.</p>`,
    ),
  });

  return { teamSent: team.sent, customerSent: customer.sent };
}
