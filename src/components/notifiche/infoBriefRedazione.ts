export default function infoBriefRedazione(json: Record<string, any>) {
  const hasValue = (v: any) => v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0);

  const formatMotivo = (v: any) => Array.isArray(v) ? v.join(', ') : (v ?? '');

  const lines: string[] = [];
  if (hasValue(json.nome)) lines.push(`- Nome: ${json.nome}`);
  if (hasValue(json.cognome)) lines.push(`- Cognome: ${json.cognome}`);
  if (hasValue(json.email)) lines.push(`- Email: ${json.email}`);
  if (hasValue(json.telefono)) lines.push(`- Telefono: ${json.telefono}`);
  if (hasValue(json.azienda)) lines.push(`- Azienda: ${json.azienda}`);
  if (hasValue(json.ruolo)) lines.push(`- Ruolo: ${json.ruolo}`);
  if (hasValue(json.paese)) lines.push(`- Paese: ${json.paese}`);
  if (hasValue(json.citta)) lines.push(`- Città: ${json.citta}`);
  if (hasValue(json.motivo)) lines.push(`- Di cosa ha bisogno: ${formatMotivo(json.motivo)}`);
  if (hasValue(json.tempistiche)) lines.push(`- Tempistiche: ${json.tempistiche}`);
  if (hasValue(json.esempi_utili)) lines.push(`- Link esempi: ${json.esempi_utili}`);
  if (hasValue(json.materiali_utili)) lines.push(`- Materiali: ${json.materiali_utili}`);
  if (hasValue(json.messaggio)) lines.push(`- Messaggio: ${json.messaggio}`);
  if (hasValue(json.newsletter)) lines.push(`- Newsletter: ${json.newsletter === 'yes' ? 'Sì' : 'No'}`);

  const text =
    `Nuova richiesta ricevuta dal form contatti di panebarco.it\n\n` +
    lines.join('\n') +
    `\n\n---\n` +
    `Messaggio generato automaticamente da panebarco.it.`;

  const htmlRows = [] as string[];
  const row = (label: string, value: string) =>
    `<tr><td style="width:200px;color:#334155;padding:6px 8px;border-bottom:1px solid #f1f5f9;">${label}</td>` +
    `<td style="padding:6px 8px;border-bottom:1px solid #f1f5f9;">${value}</td></tr>`;

  if (hasValue(json.nome)) htmlRows.push(row('Nome', json.nome));
  if (hasValue(json.cognome)) htmlRows.push(row('Cognome', json.cognome));
  if (hasValue(json.email)) htmlRows.push(row('Email', `<a href="mailto:${json.email}">${json.email}</a>`));
  if (hasValue(json.telefono)) htmlRows.push(row('Telefono', json.telefono));
  if (hasValue(json.azienda)) htmlRows.push(row('Azienda', json.azienda));
  if (hasValue(json.ruolo)) htmlRows.push(row('Ruolo', json.ruolo));
  if (hasValue(json.paese)) htmlRows.push(row('Paese', json.paese));
  if (hasValue(json.citta)) htmlRows.push(row('Città', json.citta));
  if (hasValue(json.motivo)) htmlRows.push(row('Di cosa ha bisogno', formatMotivo(json.motivo)));
  if (hasValue(json.tempistiche)) htmlRows.push(row('Tempistiche', json.tempistiche));
  if (hasValue(json.esempi_utili)) htmlRows.push(row('Link esempi', json.esempi_utili));
  if (hasValue(json.materiali_utili)) htmlRows.push(row('Materiali', json.materiali_utili));
  if (hasValue(json.messaggio)) htmlRows.push(row('Messaggio', json.messaggio.replace(/\n/g, '<br>')));
  if (hasValue(json.newsletter)) htmlRows.push(row('Newsletter', json.newsletter === 'yes' ? 'Sì' : 'No'));

  const html =
    `<div style="font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; line-height:1.55; color:#111;">` +
    `<p>Nuova richiesta ricevuta dal form contatti di <strong>panebarco.it</strong>:</p>` +
    `<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:640px;border:1px solid #e5e7eb;margin:16px 0;">` +
    `<thead><tr style="background:#f8fafc;">` +
    `<th colspan="2" style="text-align:left;padding:8px;font-size:13px;letter-spacing:.02em;text-transform:uppercase;color:#64748b;border-bottom:1px solid #e5e7eb;">Dati della richiesta</th>` +
    `</tr></thead>` +
    `<tbody>${htmlRows.join('')}</tbody>` +
    `</table>` +
    `<p style="font-size:12px;color:#64748b;margin-top:24px;">Messaggio generato automaticamente da panebarco.it.</p>` +
    `</div>`;

  return {
    subject: `Nuova richiesta dal form contatti | Panebarco`,
    text,
    html,
  };
}
