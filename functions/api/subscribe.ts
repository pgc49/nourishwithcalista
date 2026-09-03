/// <reference types="@cloudflare/workers-types" />

/**
 * Cloudflare Pages Function: POST /api/subscribe
 * Adds the email to the Resend audience (segment).
 *
 * Progressive enhancement: JSON fetch from the footer script, or a normal
 * form POST (no JS) that redirects back to /?subscribed=1.
 *
 * Env:
 *   RESEND_API_KEY (secret)
 *   RESEND_AUDIENCE_ID (plaintext; Resend "General" segment)
 */

interface Env {
  RESEND_API_KEY?: string;
  RESEND_AUDIENCE_ID?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DISPOSABLE = new Set([
  'mailinator.com',
  'guerrillamail.com',
  'tempmail.com',
  '10minutemail.com',
  'yopmail.com',
  'trashmail.com',
]);

function redirect(location: string, status = 303): Response {
  return new Response(null, { status, headers: { Location: location } });
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function parseBody(
  request: Request,
): Promise<{ email: string; website: string }> {
  const ct = request.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    const body = (await request.json()) as {
      email?: string;
      website?: string;
    };
    return {
      email: String(body.email ?? '').trim(),
      website: String(body.website ?? '').trim(),
    };
  }
  const form = await request.formData();
  return {
    email: String(form.get('email') ?? '').trim(),
    website: String(form.get('website') ?? '').trim(),
  };
}

async function addContact(
  env: Env,
  email: string,
): Promise<{ ok: true } | { ok: false; status: number; detail: string }> {
  const key = env.RESEND_API_KEY || '';
  const audience = env.RESEND_AUDIENCE_ID || '';
  if (!key) return { ok: false, status: 500, detail: 'missing_resend_key' };
  if (!audience) return { ok: false, status: 500, detail: 'missing_audience' };

  const payload: Record<string, unknown> = {
    email,
    unsubscribed: false,
    segments: [{ id: audience }],
  };

  const resp = await fetch('https://api.resend.com/contacts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (resp.ok || resp.status === 201) return { ok: true };

  const detail = await resp.text();
  // Already on the list — treat as success.
  if (
    resp.status === 409 ||
    /already exists|duplicate|taken/i.test(detail)
  ) {
    await fetch(`https://api.resend.com/contacts/${encodeURIComponent(email)}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        unsubscribed: false,
        segments: [{ id: audience }],
      }),
    }).catch(() => undefined);
    return { ok: true };
  }

  return { ok: false, status: resp.status, detail };
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const wantsJson =
    (request.headers.get('accept') || '').includes('application/json') ||
    (request.headers.get('content-type') || '').includes('application/json');

  try {
    const body = await parseBody(request);

    // Honeypot — pretend success so bots don't retry.
    if (body.website) {
      if (wantsJson) return json({ ok: true });
      return redirect('/?subscribed=1');
    }

    const email = body.email.toLowerCase().slice(0, 200);
    const domain = email.split('@')[1] || '';
    if (!email || !EMAIL_RE.test(email) || DISPOSABLE.has(domain)) {
      if (wantsJson) return json({ ok: false, error: 'invalid_email' }, 400);
      return redirect('/?err=invalid_email#newsletter');
    }

    const result = await addContact(env, email);
    if (!result.ok) {
      console.error('[subscribe] resend failed', result.status, result.detail);
      if (wantsJson) return json({ ok: false, error: 'server_error' }, 502);
      return redirect('/?err=error#newsletter');
    }

    if (wantsJson) return json({ ok: true });
    return redirect('/?subscribed=1');
  } catch (err) {
    console.error('[subscribe] error', err);
    if (wantsJson) return json({ ok: false, error: 'server_error' }, 500);
    return redirect('/?err=error#newsletter');
  }
};

export const onRequestGet: PagesFunction = async () => redirect('/');
