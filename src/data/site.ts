export const siteUrl = 'https://nourishwithcalista.com';

/** Canonical M&M host — their apex 301s to www. */
export const MM_ORIGIN = 'https://www.macrosandmamas.com';

export const MM_UTM = {
  utm_source: 'nourishwithcalista',
  utm_medium: 'referral',
  utm_campaign: 'founder_page',
} as const;

export function mmUrl(path = '/'): string {
  const url = new URL(path, MM_ORIGIN);
  url.searchParams.set('utm_source', MM_UTM.utm_source);
  url.searchParams.set('utm_medium', MM_UTM.utm_medium);
  url.searchParams.set('utm_campaign', MM_UTM.utm_campaign);
  return url.toString();
}

export const MM_URL = mmUrl('/');

export const BOOKING_EMAIL = 'calista@nourishwithcalista.com';
export const BOOKING_MAILTO =
  'mailto:calista@nourishwithcalista.com?subject=Corporate%20session%20inquiry';

export const instagramUrl = 'https://www.instagram.com/nourishwithcalista/';
export const linkedinUrl =
  'https://www.linkedin.com/in/calista-chammas-b5570020/';

export const principles = [
  {
    title: 'Start with the why.',
    body: "Low energy, poor sleep, weight that won't budge after baby. These are signals, not character flaws. I read labs and real data to find the cause instead of guessing.",
  },
  {
    title: 'No two bodies are the same.',
    body: 'Your plan is built for your life: your schedule, your kids, your cravings, your budget. Never a template.',
  },
  {
    title: 'Make it stick.',
    body: 'The plan you can follow at 6am with a toddler on your hip is the one that works. I meet you where you are.',
  },
] as const;

export const corporateTopics = [
  {
    title: "Women's health sessions",
    body: "Fertility, hormones, and menopause, for women's groups and ERGs. The conversations most workplaces never make room for.",
  },
  {
    title: 'Wellness week talks',
    body: 'A keynote or lunch-and-learn your team can put to use that same week.',
  },
  {
    title: 'Everyday health for everyone',
    body: 'Gut health, the pillars of health, and steady energy through a full workday. Practical, and open to the whole company.',
  },
] as const;

export const testimonials = [
  {
    quote:
      'I started seeing Callie after almost two years of trying to conceive. We got pregnant three months after. Her support continues into postpartum and motherhood. You need her as part of your village.',
    name: 'Reem R.',
  },
  {
    quote:
      'She is genuine, down-to-earth, empathic and warm. I have PCOS and struggled with cystic acne. She gave amazing advice to help balance my hormones and improve my skin, energy and confidence.',
    name: 'Shea R.',
  },
  {
    quote:
      "She teaches in understandable terms, is practical, and will never shame you. Tell her something isn't going to work for you, and she will help you find another way.",
    name: 'Nanci',
  },
  {
    quote:
      'Callie was an incredible support in helping me prepare my body for our embryo transfer. So much of her heart goes into her work. She is kind, compassionate, and non-judgmental.',
    name: 'Laura T.',
  },
] as const;
