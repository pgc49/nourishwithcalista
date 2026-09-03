/// <reference types="@cloudflare/workers-types" />

/**
 * Pages `_redirects` cannot match on hostname (domain-level redirects
 * are unsupported). Canonicalize www → apex here instead.
 */
const APEX = 'nourishwithcalista.com';

export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  if (url.hostname === `www.${APEX}`) {
    url.hostname = APEX;
    return Response.redirect(url.toString(), 301);
  }
  return context.next();
};
