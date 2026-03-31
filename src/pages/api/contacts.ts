export const prerender = false;

import infoBrief from '../../components/notifiche/infoBrief';
import infoBriefRedazione from '../../components/notifiche/infoBriefRedazione';
import infoTalent from '../../components/notifiche/infoTalent';
import infoTalentRedazione from '../../components/notifiche/infoTalentRedazione';
import infoSocialLibrary from '../../components/notifiche/infoSocialLibrary';
import infoSocialLibraryRedazione from '../../components/notifiche/infoSocialLibraryRedazione';

const GAS_URL_BRIEF = 'https://script.google.com/macros/s/AKfycbzBEZmv6x0V2CSeC47dTG0U3dCq24zD-mWKb1l7YwU50X-IpPEggcVCvZb21z54MRWn/exec';
const GAS_URL_TALENT = 'https://script.google.com/macros/s/AKfycbwmiUgC27L7cvvfzUohhC_3MtUKA933MeONCO1rhTNuWuOC-8SMnmd91Y2sA9pmM2u94w/exec';
const GAS_URL_SOCIAL_LIBRARY = 'https://script.google.com/macros/s/AKfycbyneXq5RLF-87UglnKvV50yv_tNSZ8tpbPMRd2LC9NQ0Z4W-pZqKFh3O6mWzTADFVtv/exec';
const INTERNAL_EMAIL = 'info@panebarco.it';

/**
 * Google Sheets interpreta le stringhe che iniziano con +, -, =, @ come formule.
 * Questa funzione aggiunge un tab prima di quei valori così vengono salvati come testo.
 */
function sanitizeForSheets(data: Record<string, any>): Record<string, any> {
  const formulaStart = /^[+=\-@]/;
  const result: Record<string, any> = {};
  for (const [key, val] of Object.entries(data)) {
    if (typeof val === 'string' && formulaStart.test(val)) {
      result[key] = '\t' + val;
    } else {
      result[key] = val;
    }
  }
  return result;
}

async function sendMail(baseUrl: string, to: string, subject: string, text: string, html: string) {
  const res = await fetch(`${baseUrl}/api/send-mail`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: to, subject, text, html }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error ?? `Errore invio email a ${to}`);
  }
}

export async function POST({ request }: { request: Request }) {
  let body: { formType: 'brief' | 'talent' | 'socialLibrary'; data: Record<string, any> };

  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Payload non valido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { formType, data } = body;

  if (formType !== 'brief' && formType !== 'talent' && formType !== 'socialLibrary') {
    return new Response(JSON.stringify({ error: 'formType non supportato' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const errors: string[] = [];
  const gasUrl = formType === 'brief' ? GAS_URL_BRIEF : formType === 'talent' ? GAS_URL_TALENT : GAS_URL_SOCIAL_LIBRARY;

  // 1. Salva su Google Drive via GAS
  try {
    await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formType, ...sanitizeForSheets(data) }),
    });
  } catch (err: any) {
    console.error('Errore GAS:', err);
    errors.push('Salvataggio Google Drive fallito');
  }

  const baseUrl = new URL(request.url).origin;

  // 2. Email conferma all'utente
  try {
    const userEmail = data.email as string;
    const { subject, text, html } =
      formType === 'brief' ? infoBrief(data) : formType === 'talent' ? infoTalent(data) : infoSocialLibrary(data);
    await sendMail(baseUrl, userEmail, subject, text, html);
  } catch (err: any) {
    console.error('Errore email utente:', err);
    errors.push('Email conferma utente non inviata');
  }

  // 3. Email notifica interna Panebarco
  try {
    const { subject, text, html } =
      formType === 'brief' ? infoBriefRedazione(data) : formType === 'talent' ? infoTalentRedazione(data) : infoSocialLibraryRedazione(data);
    await sendMail(baseUrl, INTERNAL_EMAIL, subject, text, html);
  } catch (err: any) {
    console.error('Errore email redazione:', err);
    errors.push('Email notifica interna non inviata');
  }

  if (errors.length === 3) {
    return new Response(JSON.stringify({ error: errors.join('; ') }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ message: 'OK', warnings: errors.length ? errors : undefined }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
