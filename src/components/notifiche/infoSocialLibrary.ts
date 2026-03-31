export default function infoSocialLibrary(json: Record<string, any>) {
  const text =
    `Ciao ${json.nome},\n\n` +
    `grazie per la tua richiesta alla Social Library di Panebarco! Abbiamo ricevuto i tuoi dati e ti contatteremo a breve.\n\n` +
    `Team Panebarco\n\n` +
    `---\n` +
    `Questo è un messaggio generato automaticamente. Per contattarci direttamente scrivi a info@panebarco.it.`;

  const html =
    `<div style="font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; line-height:1.6; color:#111; max-width:600px;">` +
    `<p>Ciao <strong>${json.nome}</strong>,</p>` +
    `<p>grazie per la tua richiesta alla Social Library di Panebarco! Abbiamo ricevuto i tuoi dati e ti contatteremo a breve.</p>` +
    `<p>Team Panebarco</p>` +
    `<p style="color:#64748b; font-size:12px; margin-top:32px; border-top:1px solid #e5e7eb; padding-top:16px;">` +
    `Questo è un messaggio generato automaticamente. Per contattarci direttamente scrivi a ` +
    `<a href="mailto:info@panebarco.it">info@panebarco.it</a>.` +
    `</p>` +
    `</div>`;

  return {
    subject: `Richiesta Social Library ricevuta | Panebarco`,
    text,
    html,
  };
}
