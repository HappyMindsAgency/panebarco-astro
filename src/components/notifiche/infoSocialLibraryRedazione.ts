export default function infoSocialLibraryRedazione(json: Record<string, any>) {
  const hasValue = (v: any) => v !== null && v !== undefined && v !== '';

  const lines: string[] = [];
  if (hasValue(json.nome)) lines.push(`- Nome: ${json.nome}`);
  if (hasValue(json.cognome)) lines.push(`- Cognome: ${json.cognome}`);
  if (hasValue(json.email)) lines.push(`- Email: ${json.email}`);
  if (hasValue(json.telefono)) lines.push(`- Telefono: ${json.telefono}`);
  if (hasValue(json.linkCatalogo)) lines.push(`- Link catalogo: ${json.linkCatalogo}`);
  if (hasValue(json.dataRitiro)) lines.push(`- Data ritiro: ${json.dataRitiro}`);
  if (hasValue(json.messaggio)) lines.push(`- Messaggio: ${json.messaggio}`);
  if (hasValue(json.newsletter)) lines.push(`- Newsletter: ${json.newsletter === 'yes' || json.newsletter === true ? 'Sì' : 'No'}`);

  const text =
    `Nuova richiesta ricevuta dal form Social Library di panebarco.it\n\n` +
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
  if (hasValue(json.linkCatalogo)) htmlRows.push(row('Link catalogo', `<a href="${json.linkCatalogo}" target="_blank" rel="noopener noreferrer">${json.linkCatalogo}</a>`));
  if (hasValue(json.dataRitiro)) htmlRows.push(row('Data ritiro', json.dataRitiro));
  if (hasValue(json.messaggio)) htmlRows.push(row('Messaggio', json.messaggio.replace(/\n/g, '<br>')));
  if (hasValue(json.newsletter)) htmlRows.push(row('Newsletter', json.newsletter === 'yes' || json.newsletter === true ? 'Sì' : 'No'));

  const html =
    `<div style="font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; line-height:1.55; color:#111;">` +
    `<p>Nuova richiesta ricevuta dal form Social Library di <strong>panebarco.it</strong>:</p>` +
    `<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:640px;border:1px solid #e5e7eb;margin:16px 0;">` +
    `<thead><tr style="background:#f8fafc;">` +
    `<th colspan="2" style="text-align:left;padding:8px;font-size:13px;letter-spacing:.02em;text-transform:uppercase;color:#64748b;border-bottom:1px solid #e5e7eb;">Dati della richiesta</th>` +
    `</tr></thead>` +
    `<tbody>${htmlRows.join('')}</tbody>` +
    `</table>` +
    `<p style="font-size:12px;color:#64748b;margin-top:24px;">Messaggio generato automaticamente da panebarco.it.</p>` +
    `</div>`;

  return {
    subject: `Nuova richiesta Social Library | Panebarco`,
    text,
    html,
  };
}
