export default function infoTalentRedazione(json: Record<string, any>) {
  const hasValue = (v: any) => v !== null && v !== undefined && v !== '';

  const lines: string[] = [];
  if (hasValue(json.nome)) lines.push(`- Nome: ${json.nome}`);
  if (hasValue(json.cognome)) lines.push(`- Cognome: ${json.cognome}`);
  if (hasValue(json.email)) lines.push(`- Email: ${json.email}`);
  if (hasValue(json.telefono)) lines.push(`- Telefono: ${json.telefono}`);
  if (hasValue(json.paese)) lines.push(`- Paese: ${json.paese}`);
  if (hasValue(json.citta)) lines.push(`- Città: ${json.citta}`);
  if (hasValue(json.ruolo)) lines.push(`- Ruolo di interesse: ${json.ruolo}`);
  if (hasValue(json.cosa)) lines.push(`- Tipo candidatura: ${json.cosa}`);
  if (hasValue(json.stage)) lines.push(`- Dettagli stage/tirocinio: ${json.stage}`);
  if (hasValue(json.messaggio)) lines.push(`- Presentazione: ${json.messaggio}`);
  if (hasValue(json.linkCv)) lines.push(`- CV: ${json.linkCv}`);
  if (hasValue(json.linkPortfolio)) lines.push(`- Portfolio/showreel: ${json.linkPortfolio}`);
  if (hasValue(json.newsletter)) lines.push(`- Newsletter: ${json.newsletter === 'yes' ? 'Sì' : 'No'}`);

  const text =
    `Nuova candidatura ricevuta dal form talents di panebarco.it\n\n` +
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
  if (hasValue(json.paese)) htmlRows.push(row('Paese', json.paese));
  if (hasValue(json.citta)) htmlRows.push(row('Città', json.citta));
  if (hasValue(json.ruolo)) htmlRows.push(row('Ruolo di interesse', json.ruolo));
  if (hasValue(json.cosa)) htmlRows.push(row('Tipo candidatura', json.cosa));
  if (hasValue(json.stage)) htmlRows.push(row('Dettagli stage/tirocinio', json.stage.replace(/\n/g, '<br>')));
  if (hasValue(json.messaggio)) htmlRows.push(row('Presentazione', json.messaggio.replace(/\n/g, '<br>')));
  if (hasValue(json.linkCv)) htmlRows.push(row('CV', `<a href="${json.linkCv}" target="_blank" rel="noopener noreferrer">${json.linkCv}</a>`));
  if (hasValue(json.linkPortfolio)) htmlRows.push(row('Portfolio/showreel', `<a href="${json.linkPortfolio}" target="_blank" rel="noopener noreferrer">${json.linkPortfolio}</a>`));
  if (hasValue(json.newsletter)) htmlRows.push(row('Newsletter', json.newsletter === 'yes' ? 'Sì' : 'No'));

  const html =
    `<div style="font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; line-height:1.55; color:#111;">` +
    `<p>Nuova candidatura ricevuta dal form talents di <strong>panebarco.it</strong>:</p>` +
    `<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:640px;border:1px solid #e5e7eb;margin:16px 0;">` +
    `<thead><tr style="background:#f8fafc;">` +
    `<th colspan="2" style="text-align:left;padding:8px;font-size:13px;letter-spacing:.02em;text-transform:uppercase;color:#64748b;border-bottom:1px solid #e5e7eb;">Dati della candidatura</th>` +
    `</tr></thead>` +
    `<tbody>${htmlRows.join('')}</tbody>` +
    `</table>` +
    `<p style="font-size:12px;color:#64748b;margin-top:24px;">Messaggio generato automaticamente da panebarco.it.</p>` +
    `</div>`;

  return {
    subject: `Nuova candidatura dal form talents | Panebarco`,
    text,
    html,
  };
}
