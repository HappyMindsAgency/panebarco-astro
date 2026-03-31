export const prerender = false;

import nodemailer from 'nodemailer';

export async function POST({ request }: { request: Request }) {
  try {
    const { email, subject, text, html } = await request.json();

    const smtpPort = parseInt(import.meta.env.SMTP_PORT);
    const secure = smtpPort === 465;

    const transporter = nodemailer.createTransport({
      host: import.meta.env.SMTP_HOST,
      port: smtpPort,
      secure,
      family: 4, // forza IPv4
      tls: { rejectUnauthorized: false },
      auth: {
        user: import.meta.env.SMTP_USER,
        pass: import.meta.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Panebarco" <${import.meta.env.SMTP_USER}>`,
      to: email,
      subject,
      text,
      html,
    });

    return new Response(JSON.stringify({ message: 'Email inviata con successo' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Errore invio email:', error);
    return new Response(
      JSON.stringify({ error: error?.message ?? 'Errore durante l\'invio dell\'email' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
