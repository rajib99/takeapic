export const SITE = {
  name: "Take a pic",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://takeabic.biz",
  tagline: "The photo booth run by a robot photographer.",
  email: "bookings@takeabic.biz",
  // TODO: replace with the client's real phone / service area
  phone: "",
  area: "New York, NY",
};

export type Package = {
  id: "basic" | "premium" | "lux";
  name: string;
  price: number; // USD, full price (PLACEHOLDER - confirm with client)
  depositPct: number;
  tagline: string;
  features: string[];
  featured?: boolean;
};

// PLACEHOLDER PRICES: the client has not given numbers yet. Edit here only;
// the server computes the Stripe amount from this file, never from the browser.
export const PACKAGES: Package[] = [
  {
    id: "basic",
    name: "Basic",
    price: 795,
    depositPct: 30,
    tagline: "Mirror booth + red carpet + 360 camera.",
    features: [
      "Magic mirror photo booth",
      "Red carpet entrance",
      "360° video camera",
      "No backdrop",
      "Instant sharing by text & email",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 1295,
    depositPct: 30,
    tagline: "Everything in Basic, plus a styled backdrop.",
    featured: true,
    features: [
      "Everything in Basic",
      "Custom backdrop",
      "Red carpet + stanchions",
      "Online gallery for guests",
      "Branded photo overlays",
    ],
  },
  {
    id: "lux",
    name: "Lux",
    price: 2195,
    depositPct: 30,
    tagline: "The full show: AI robot photographer + drone.",
    features: [
      "Everything in Premium",
      "AI robot photographer roaming your event",
      "Drone-assisted 360° coverage",
      "Magazine-cover booth with backside shot",
      "Dedicated attendant & priority setup",
    ],
  },
];

export const EVENT_TYPES = ["Wedding", "Corporate event", "Birthday / Party", "Brand activation", "Other"] as const;

export const depositFor = (p: Package) => Math.round(p.price * p.depositPct) / 100;

export const FAQS = [
  {
    q: "What makes Take a pic different from other photo booth rentals?",
    a: "We bring a robot photographer. It roams your event taking candid, magazine-style photos, and a companion drone supports our 360° camera for coverage that traditional booths can't match.",
  },
  {
    q: "How does booking and payment work?",
    a: "Choose a package, pick your date, and pay a deposit securely through Stripe. The balance is due before your event. Your date is held as soon as the deposit clears.",
  },
  {
    q: "What events do you cover?",
    a: "Weddings, corporate events, birthdays, brand activations and any open-space event. Our setup works best with open floor space.",
  },
  {
    q: "What is the difference between Basic, Premium and Lux?",
    a: "Basic is a mirror booth with a red carpet and a 360 camera, with no backdrop. Premium adds a custom backdrop. Lux adds the AI robot photographer, the drone and a magazine-style booth.",
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
export const TESTIMONIALS: { quote: string; name: string; event: string }[] = [
  { quote: "The robot was the star of our wedding. Guests kept chasing it around the dance floor for one more photo, and the prints were gorgeous.", name: "Sample Client", event: "Wedding, Brooklyn" },
  { quote: "The magazine booth made every guest feel like a celebrity. We still see the cover photos all over Instagram.", name: "Sample Client", event: "Sweet 16, Queens" },
  { quote: "Setup was quick, the team was professional and the branded screen was perfect for our product launch.", name: "Sample Client", event: "Brand activation, Manhattan" },
];
