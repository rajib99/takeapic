/** Public origin. Comes from the environment, never from the admin. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://takeabic.biz";

export type SiteInfo = { name: string; tagline: string; email: string; phone: string; area: string };

// Everything below `DEFAULT_*` is the starting content. The admin saves edits to Vercel Blob
// (see lib/content.ts) and those win over these defaults.
export const DEFAULT_SITE: SiteInfo = {
  name: "Take a pic",
  tagline: "The photo booth run by a robot photographer.",
  email: "bookings@takeabic.biz",
  phone: "",
  area: "New York, NY",
};

export type BoothSlug = "takeapic" | "magic-mirror" | "magazine-photo-booth" | "360-photo-booth";

export type Tier = { id: string; name: string; price: number; hours: number; blurb: string; features: string[]; featured?: boolean };

export type Booth = {
  slug: BoothSlug;
  name: string;
  short: string;
  pricingModel: string; // one-line explanation of how this booth is priced
  extraHour: number; // price per additional hour
  tiers: Tier[];
};

// PLACEHOLDER PRICES: the client has not given numbers yet. Edit here only;
// the server computes the Stripe amount from this file, never from the browser.
export const DEFAULT_BOOTHS: Booth[] = [
  {
    slug: "takeapic",
    name: "Takeapic AI Robot",
    short: "Our robot photographer roams your event, snaps, styles and prints.",
    pricingModel: "Priced by the hour. The robot works the room the whole time.",
    extraHour: 395,
    tiers: [
      { id: "2h", name: "2 Hours", hours: 2, price: 1295, blurb: "Perfect for cocktail hour or a short party.", features: ["Robot roams and greets guests", "Touchscreen photo sessions", "AI photo styles", "Unlimited digital photos", "Instant text, email & QR sharing"] },
      { id: "3h", name: "3 Hours", hours: 3, price: 1695, featured: true, blurb: "Our most booked robot experience.", features: ["Everything in 2 Hours", "Unlimited 4x6 prints on the spot", "Your logo or names on the robot's screen", "Online gallery after the event"] },
      { id: "4h", name: "4 Hours", hours: 4, price: 1995, blurb: "Covers the whole reception or launch.", features: ["Everything in 3 Hours", "Custom overlay included", "Dedicated on-site attendant", "Priority setup & early arrival"] },
    ],
  },
  {
    slug: "magic-mirror",
    name: "Magic Mirror",
    short: "A full-length interactive mirror that talks, animates and prints.",
    pricingModel: "Priced by print package. Every package runs 3 to 4 hours.",
    extraHour: 195,
    tiers: [
      { id: "digital", name: "Digital", hours: 3, price: 595, blurb: "All the fun, delivered straight to phones.", features: ["3 hours of mirror time", "Touch animations & voice prompts", "Unlimited digital photos", "Instant text, email & QR sharing", "Standard prop kit"] },
      { id: "prints", name: "Unlimited Prints", hours: 3, price: 795, featured: true, blurb: "Guests leave with a keepsake in hand.", features: ["Everything in Digital", "Unlimited 2x6 or 4x6 prints", "Standard backdrop", "Online gallery after the event"] },
      { id: "guestbook", name: "Guest Book", hours: 4, price: 995, blurb: "Prints for guests, plus a scrapbook for you.", features: ["Everything in Unlimited Prints", "4 hours of mirror time", "Scrapbook guest book with duplicate prints", "Dedicated on-site attendant"] },
    ],
  },
  {
    slug: "magazine-photo-booth",
    name: "Magazine Photo Booth",
    short: "A life-size, back-lit magazine cover your guests step into.",
    pricingModel: "Flat event packages. The cover frame, setup and attendant are always included.",
    extraHour: 250,
    tiers: [
      { id: "cover", name: "Cover Shoot", hours: 2, price: 895, blurb: "The iconic cover moment, done right.", features: ["2 hours", "Life-size lit cover frame", "Choice of cover template", "Unlimited digital photos"] },
      { id: "red-carpet", name: "Red Carpet", hours: 3, price: 1195, featured: true, blurb: "A full celebrity arrival for every guest.", features: ["3 hours", "Everything in Cover Shoot", "Red carpet & gold stanchions", "Custom headlines with your names & date"] },
      { id: "editorial", name: "Editorial", hours: 4, price: 1495, blurb: "A fully designed issue, front and back.", features: ["4 hours", "Everything in Red Carpet", "Custom cover design for your event", "Front & backside shots", "Printed covers for guests"] },
    ],
  },
  {
    slug: "360-photo-booth",
    name: "360 Photo Booth",
    short: "Slow-motion 360° video from a spinning camera arm, with a drone option.",
    pricingModel: "Priced by the hour, with a drone-assisted upgrade.",
    extraHour: 175,
    tiers: [
      { id: "spin", name: "Spin", hours: 2, price: 495, blurb: "Slow-mo spins your guests will post all night.", features: ["2 hours", "360 platform for up to 4 guests", "Slow-motion video with music", "Instant text, email & QR sharing"] },
      { id: "spotlight", name: "Spotlight", hours: 3, price: 695, featured: true, blurb: "Lit like a music video.", features: ["3 hours", "Everything in Spin", "LED ring lights & stanchions", "Online gallery after the event"] },
      { id: "drone", name: "Drone-assisted 360", hours: 4, price: 1195, blurb: "Ground spins plus sweeping aerial angles.", features: ["4 hours", "Everything in Spotlight", "Drone sidekick for aerial 360 shots", "Edited highlight reel after the event"] },
    ],
  },
];

export type AddOn = { id: string; name: string; price: number; icon: string; blurb: string; quoted?: boolean };

// Same add-ons on every booth. `quoted` ones are shown but not charged online.
export const DEFAULT_ADDONS: AddOn[] = [
  { id: "gifs", name: "GIFs & Boomerangs", price: 150, icon: "🔁", blurb: "Animated GIFs and looping boomerangs alongside the stills, sized for Instagram and TikTok." },
  { id: "overlay", name: "Custom Overlay", price: 95, icon: "🎨", blurb: "Your names, date, logo or theme designed onto every photo and video." },
  { id: "props", name: "Props Upgrade", price: 75, icon: "🎩", blurb: "Premium prop kit: themed signs, hats, glasses, inflatables and seasonal extras." },
  { id: "backdrop", name: "Premium Backdrop", price: 195, icon: "✨", blurb: "Sequin, floral or flower-wall backdrop in your colors." },
  { id: "travel", name: "Travel Fee", price: 95, icon: "🚐", quoted: true, blurb: "Free within 25 miles of Midtown Manhattan. Further out starts at $95 and is confirmed after booking." },
];

export const DEFAULT_DEPOSIT_PCT = 30;

/** "$1,295" or "$388.50" */
export const money = (n: number) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });

export const EVENT_TYPES = ["Wedding", "Corporate event", "Birthday / Party", "Brand activation", "Other"] as const;

export const DEFAULT_FAQS: Faq[] = [
  {
    q: "What makes Take a pic different from other photo booth rentals?",
    a: "We bring a robot photographer. It roams your event taking candid, magazine-style photos, and a companion drone supports our 360° camera for coverage that traditional booths can't match.",
  },
  {
    q: "How does booking and payment work?",
    a: "Choose a booth and package, add any extras, pick your date, and pay a deposit securely through Stripe. The balance is due before your event. Your date is held as soon as the deposit clears.",
  },
  {
    q: "What events do you cover?",
    a: "Weddings, corporate events, birthdays, brand activations and any open-space event. Our setup works best with open floor space.",
  },
  {
    q: "Which booth should I choose?",
    a: "The Takeapic AI robot comes to your guests and is our signature experience. The Magic Mirror is a talking, printing mirror booth. The Magazine Photo Booth puts guests on a life-size magazine cover. The 360 Photo Booth films slow-motion spins, with a drone option. Many hosts book two together.",
  },
  {
    q: "Do guests get their photos right away?",
    a: "Yes. Photos can be shared instantly by text or email, and every package includes an online gallery link after the event.",
  },
  {
    q: "Where do you operate?",
    a: "We are based in New York and serve the surrounding area. Ask us about travel for events further out.",
  },
];

// PLACEHOLDER REVIEWS: sample copy so the section can be designed. Replace with
// real client reviews (with their permission) before launch, or empty the array
// to hide the section. Publishing invented reviews is illegal under FTC rules.
export type Testimonial = { quote: string; name: string; event: string };
export type Faq = { q: string; a: string };
export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  { quote: "The robot was the star of our wedding. Guests kept chasing it around the dance floor for one more photo, and the prints were gorgeous.", name: "Sample Client", event: "Wedding, Brooklyn" },
  { quote: "The magazine booth made every guest feel like a celebrity. We still see the cover photos all over Instagram.", name: "Sample Client", event: "Sweet 16, Queens" },
  { quote: "Setup was quick, the team was professional and the branded screen was perfect for our product launch.", name: "Sample Client", event: "Brand activation, Manhattan" },
];

/** Everything the admin can edit as structured data (as opposed to single text strings). */
export type CatalogData = {
  site: SiteInfo;
  depositPct: number;
  booths: Booth[];
  addons: AddOn[];
  faqs: Faq[];
  testimonials: Testimonial[];
};

export const DEFAULT_DATA: CatalogData = {
  site: DEFAULT_SITE,
  depositPct: DEFAULT_DEPOSIT_PCT,
  booths: DEFAULT_BOOTHS,
  addons: DEFAULT_ADDONS,
  faqs: DEFAULT_FAQS,
  testimonials: DEFAULT_TESTIMONIALS,
};

/** Pricing helpers over a CatalogData. Pure, so the booking form can run it in the browser too. */
export function catalog(data: CatalogData) {
  const depositOf = (price: number) => Math.round(price * data.depositPct) / 100;
  /** Every bookable tier, flattened. id is `${booth.slug}:${tier.id}`. */
  const packages = data.booths.flatMap((booth) =>
    booth.tiers.map((tier) => ({ id: `${booth.slug}:${tier.id}`, name: `${booth.name}: ${tier.name}`, price: tier.price, booth, tier })),
  );
  const boothBySlug = (slug: BoothSlug) => data.booths.find((b) => b.slug === slug)!;
  const fromPrice = (b: Booth) => Math.min(...b.tiers.map((t) => t.price));
  /** Total and deposit for a package plus add-ons. Used by the form and, authoritatively, by checkout. */
  const quote = (packageId: string, addOnIds: string[] = []) => {
    const pkg = packages.find((p) => p.id === packageId);
    if (!pkg) return null;
    const addOns = data.addons.filter((a) => !a.quoted && addOnIds.includes(a.id));
    const total = pkg.price + addOns.reduce((sum, a) => sum + a.price, 0);
    return { pkg, addOns, total, deposit: depositOf(total) };
  };
  return { ...data, depositOf, packages, boothBySlug, fromPrice, quote };
}
export type Catalog = ReturnType<typeof catalog>;
