export default function infoTalent(json: Record<string, any>) {
  const text =
    `Ciao ${json.nome},\n\n` +
    `grazie per aver inviato la tua candidatura! Abbiamo ricevuto il tuo profilo e lo valuteremo con attenzione.\n` +
    `Ti contatteremo se il tuo background sarà in linea con le nostre esigenze.\n\n` +
    `Team Panebarco\n\n` +
    `---\n` +
    `Questo è un messaggio generato automaticamente. Per contattarci direttamente scrivi a info@panebarco.it.`;

  const html =
    `<div style="font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; line-height:1.6; color:#111; max-width:600px;">` +
    `<p>Ciao <strong>${json.nome}</strong>,</p>` +
    `<p>grazie per aver inviato la tua candidatura! Abbiamo ricevuto il tuo profilo e lo valuteremo con attenzione.</p>` +
    `<p>Ti contatteremo se il tuo background sarà in linea con le nostre esigenze.</p>` +
    `<p>Team Panebarco</p>` +
    `<p style="color:#64748b; font-size:12px; margin-top:32px; border-top:1px solid #e5e7eb; padding-top:16px;">` +
    `Questo è un messaggio generato automaticamente. Per contattarci direttamente scrivi a ` +
    `<a href="mailto:info@panebarco.it">info@panebarco.it</a>.` +
    `</p>` +
    `</div>`;

  return {
    subject: `Candidatura ricevuta | Panebarco`,
    text,
    html,
  };
}
