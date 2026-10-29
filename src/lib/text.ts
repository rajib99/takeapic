// Every editable piece of copy on the site, with its default. The admin (/admin/text)
// lists these, saves overrides to Vercel Blob, and pages read them through getSite().t().
//
//  - "*word*" renders as the accent colour.   - "{name}" is filled in by the page.
//  - A key's group is the part before the first dot.
export type TextDef = { label: string; value: string; area?: boolean };

export const GROUPS: Record<string, string> = {
  site: "Header, footer & search listing",
  home: "Home page",
  robot: "Robot section (Home + Takeapic page)",
  vogue: "Magazine booth section (Home + Magazine page)",
  pricing: "Pricing blocks (every booth page)",
  takeapic: "Takeapic page",
  mirror: "Magic Mirror page",
  magazine: "Magazine Photo Booth page",
  t360: "360 Photo Booth page",
  packages: "Packages page",
  gallery: "Gallery page",
  how: "How it works page",
  faq: "FAQ page",
  contact: "Contact page",
  book: "Booking pages",
};

const d: Record<string, TextDef> = {};
const add = (key: string, label: string, value: string, area = false) => {
  d[key] = { label, value, ...(area && { area }) };
};

// ── Header, footer, search listing ──────────────────────────────────────────
add("site.nav.takeapic", "Menu: Takeapic", "Takeapic");
add("site.nav.mirror", "Menu: Magic Mirror", "Magic Mirror");
add("site.nav.magazine", "Menu: Magazine", "Magazine Photo Booth");
add("site.nav.t360", "Menu: 360", "360 Photo Booth");
add("site.nav.book", "Menu: Book button", "Book now");
add("site.footer.booths", "Footer: Booths column title", "Booths");
add("site.footer.info", "Footer: Info column title", "Info");
add("site.footer.pricing", "Footer link: pricing", "All pricing");
add("site.footer.gallery", "Footer link: gallery", "Gallery");
add("site.footer.how", "Footer link: how it works", "How it works");
add("site.footer.faq", "Footer link: FAQ", "FAQ");
add("site.footer.contact", "Footer link: contact", "Contact");
add("site.footer.book", "Footer link: book", "Book");
add("site.footer.serving", "Footer: service area line ({area})", "Serving {area}.");
add("site.footer.rights", "Footer: copyright line", "All rights reserved.");
add("site.seo.title", "Google title (home page)", "Take a pic | Robot Photo Booth Rental in New York");
add("site.seo.description", "Google description (home page)", "Photo booth rental with an AI robot photographer and a 360° drone camera. Weddings, corporate events and parties in New York. Book online in minutes.", true);
add("site.seo.business", "Business description (structured data for Google)", "Photo booth rental featuring an AI robot photographer and drone-supported 360° camera.", true);

// ── Home ────────────────────────────────────────────────────────────────────
add("home.hero.title", "Hero headline", "The photo booth with a *robot photographer*.");
add("home.hero.lead", "Hero paragraph", "An AI robot roams your event shooting magazine-worthy photos, while our drone sidekick captures every angle in 360°. Nobody else in New York has one.", true);
add("home.hero.cta", "Hero button 1", "Book your date");
add("home.hero.cta2", "Hero button 2", "See our booths");
add("home.features.title", "Features heading", "Made for weddings, corporate events & open spaces");
add("home.features.1.title", "Feature 1 title", "🤖 AI robot photographer");
add("home.features.1.text", "Feature 1 text", "Our robot finds the moment and takes the shot. No lines, no awkward posing, just great candids.", true);
add("home.features.2.title", "Feature 2 title", "🚁 Drone-assisted 360°");
add("home.features.2.text", "Feature 2 text", "A drone sidekick supports our 360 camera for sweeping, shareable video your guests will replay.", true);
add("home.features.3.title", "Feature 3 title", "📖 Magazine booth");
add("home.features.3.text", "Feature 3 text", "Step onto the red carpet and get a cover-style shot, with a backside view in our magazine booth.", true);
add("home.booths.title", "Booths heading", "Choose your experience");
add("home.booths.lead", "Booths paragraph", "Four booths, each with its own packages and add-ons. Book one, or mix them for the full show.", true);
add("home.reviews.eyebrow", "Testimonials small label", "Testimonials");
add("home.reviews.title", "Testimonials heading", "Loved by hosts");
add("home.moments.title", "Event photos heading", "Moments from real events");
add("home.moments.lead", "Event photos paragraph", "Weddings, sweet sixteens, galas and brand launches.");
add("home.moments.cta", "Event photos button", "See the full gallery");
add("home.cta.title", "Bottom banner heading", "Ready to meet the robot?");
add("home.cta.text", "Bottom banner text", "Dates fill up fast. Reserve yours in two minutes.");
add("home.cta.button", "Bottom banner button", "Book now");

// ── Robot section ───────────────────────────────────────────────────────────
add("robot.eyebrow", "Small label", "Meet the robot");
add("robot.title", "Heading", "A photo booth that walks up to *you*.");
add("robot.lead", "Paragraph", "Our AI robot photographer works the room for you: it greets guests, snaps the photo, styles it and hands over a print. Your logo or names on its screen all night.", true);
add("robot.f1.title", "Feature 1 title", "It comes to your guests");
add("robot.f1.text", "Feature 1 text", "The robot glides through the room, so nobody waits in line at a booth. The photo booth finds them.", true);
add("robot.f2.title", "Feature 2 title", "Touch to start");
add("robot.f2.text", "Feature 2 text", "A big, bright touchscreen. Guests tap, strike a pose and the robot takes the shot.", true);
add("robot.f3.title", "Feature 3 title", "AI photo styles");
add("robot.f3.text", "Feature 3 text", "Turn a snapshot into artwork, a magazine cover or a themed portrait in seconds.", true);
add("robot.f4.title", "Feature 4 title", "Instant prints & sharing");
add("robot.f4.text", "Feature 4 text", "Prints on the spot, plus every photo sent straight to phones by text, email or QR.", true);
add("robot.cap.comes", "Video caption: working the room", "Working the room at a wedding");
add("robot.cap.studio", "Photo caption: screen", "Your photos on its screen");
add("robot.cap.crowd", "Video caption: crowd", "Guests lining up for a turn");
add("robot.cap.guests", "Video caption: kids", "Kids love it too");
add("robot.cap.standing", "Photo caption: branded", "Branded with your logo");
add("robot.cap.branded", "Video caption: welcome screen", "Custom welcome screen");

// ── Magazine booth section ──────────────────────────────────────────────────
add("vogue.kicker", "Small label", "The Vogue Magazine Booth");
add("vogue.title", "Heading", "Be the cover story.");
add("vogue.lead", "Paragraph", "Every guest becomes the face of the issue. A life-size, back-lit magazine cover turns your party into a fashion shoot, and the photos look like they belong on a newsstand.", true);
add("vogue.p1.title", "Point 1 title", "Life-size lit cover frame");
add("vogue.p1.text", "Point 1 text", "Step inside a glowing magazine cover, big enough for the whole squad.", true);
add("vogue.p2.title", "Point 2 title", "Your headline, your names");
add("vogue.p2.text", "Point 2 text", "Custom cover lines with the guest of honor, the date and your event's story.", true);
add("vogue.p3.title", "Point 3 title", "Red carpet arrival");
add("vogue.p3.text", "Point 3 text", "Carpet and gold stanchions so every guest gets a celebrity entrance.", true);
add("vogue.p4.title", "Point 4 title", "Front & backside shots");
add("vogue.p4.text", "Point 4 text", "Pose for the cover, then turn around for the behind-the-scenes shot.", true);
add("vogue.cta", "Book button", "Book the magazine booth");
add("vogue.from", "Link text ({price})", "Packages from {price} →");
add("vogue.archive", "Photo strip label", "From the archive");

// ── Pricing blocks ──────────────────────────────────────────────────────────
add("pricing.eyebrow", "Small label", "Pricing");
add("pricing.title", "Heading ({name})", "{name} packages");
add("pricing.extra", "Extra hours note ({hours}, {price})", "Extra hours {price}/hr.");
add("pricing.popular", "Badge on the featured package", "Most popular");
add("pricing.deposit", "Deposit note ({amount})", "{amount} deposit holds your date");
add("pricing.book", "Package button ({tier})", "Book {tier}");
add("pricing.addons", "Add-ons heading", "Add-ons");
add("pricing.addonsLead", "Add-ons paragraph", "Pick any of these when you book. They work with every package.");
add("pricing.from", "Add-on 'from' price prefix", "from");
add("hero.from", "Booth page hero: 'Packages from' label", "Packages from");
add("hero.book", "Booth page hero: book button", "Book now");
add("hero.see", "Booth page hero: pricing link", "See pricing");
add("cards.from", "Booth card: 'From' label", "From");
add("cards.more", "Booth card: link text", "Explore & pricing →");

// ── Takeapic page ───────────────────────────────────────────────────────────
add("takeapic.seo.title", "Google title", "Takeapic AI Robot Photographer");
add("takeapic.seo.description", "Google description", "Rent the Takeapic AI robot photographer in New York. It roams your event, takes the photo, applies AI styles and prints on the spot. Hourly packages.", true);
add("takeapic.eyebrow", "Small label", "Takeapic AI Robot");
add("takeapic.title", "Headline", "The photographer is a *robot*.");
add("takeapic.lead", "Paragraph", "Instead of guests lining up at a booth, the booth goes to them. Takeapic rolls through your event, invites guests to tap its screen, snaps the shot, styles it with AI and prints it on the spot.", true);

// ── Magic Mirror page ───────────────────────────────────────────────────────
add("mirror.seo.title", "Google title", "Magic Mirror Photo Booth Rental");
add("mirror.seo.description", "Google description", "Rent a Magic Mirror photo booth in New York: a full-length interactive mirror with animations, voice prompts, instant prints and sharing. Packages by print option.", true);
add("mirror.eyebrow", "Small label", "Magic Mirror");
add("mirror.title", "Headline", "The mirror that *talks back*.");
add("mirror.lead", "Paragraph", "A full-length interactive mirror booth with animations, voice prompts and instant prints. Guests strike a pose, sign their photo and walk away with a keepsake.", true);
add("mirror.features", "Features heading", "How the Magic Mirror works");
add("mirror.f1.title", "Feature 1 title", "Full-length touch mirror");
add("mirror.f1.text", "Feature 1 text", "A floor-to-ceiling mirror that doubles as a giant touchscreen. Guests see themselves exactly as the photo will look.", true);
add("mirror.f2.title", "Feature 2 title", "Animations & voice prompts");
add("mirror.f2.text", "Feature 2 text", "The mirror greets guests, counts them down and cheers them on with playful animations.", true);
add("mirror.f3.title", "Feature 3 title", "Sign your photo");
add("mirror.f3.text", "Feature 3 text", "Guests add a signature, emoji or doodle right on the mirror before it prints.", true);
add("mirror.f4.title", "Feature 4 title", "Prints in seconds");
add("mirror.f4.text", "Feature 4 text", "Lab-quality 2x6 strips or 4x6 prints, ready before guests leave the booth.", true);
add("mirror.f5.title", "Feature 5 title", "Props & backdrops");
add("mirror.f5.text", "Feature 5 text", "A standard prop kit comes with every package. Upgrade the props or backdrop to match your theme.", true);
add("mirror.f6.title", "Feature 6 title", "Instant sharing");
add("mirror.f6.text", "Feature 6 text", "Photos go straight to phones by text, email or QR code, ready to post.", true);
add("mirror.moments", "Photos heading", "Mirror moments");
add("mirror.momentsLead", "Photos paragraph", "Real guests at real events.");

// ── Magazine page ───────────────────────────────────────────────────────────
add("magazine.seo.title", "Google title", "Magazine Photo Booth Rental");
add("magazine.seo.description", "Google description", "Rent a life-size magazine cover photo booth in New York. Back-lit cover frame, custom headlines, red carpet and front and backside shots. Flat event packages.", true);

// ── 360 page ────────────────────────────────────────────────────────────────
add("t360.seo.title", "Google title", "360 Photo Booth Rental");
add("t360.seo.description", "Google description", "Rent a 360 photo booth in New York: slow-motion 360° videos with music, LED lighting, instant sharing and an optional drone for aerial angles. Hourly packages.", true);
add("t360.eyebrow", "Small label", "360 Photo Booth");
add("t360.title", "Headline", "Every guest gets the *slow-mo spin*.");
add("t360.lead", "Paragraph", "Step on the platform, strike a pose and let the camera circle you. Slow-motion 360° videos with music, ready to share before the next song ends.", true);
add("t360.features", "Features heading", "What makes our 360 different");
add("t360.f1.title", "Feature 1 title", "Spinning camera arm");
add("t360.f1.text", "Feature 1 text", "Guests step onto the platform and the camera circles them for a full 360° shot.", true);
add("t360.f2.title", "Feature 2 title", "Slow-mo with music");
add("t360.f2.text", "Feature 2 text", "Every spin becomes a slow-motion clip with music and effects, ready in seconds.", true);
add("t360.f3.title", "Feature 3 title", "Drone-assisted angles");
add("t360.f3.text", "Feature 3 text", "Our drone sidekick adds sweeping aerial shots for the ultimate highlight video.", true);
add("t360.f4.title", "Feature 4 title", "Music-video lighting");
add("t360.f4.text", "Feature 4 text", "LED ring lights and stanchions turn the platform into a stage.", true);
add("t360.f5.title", "Feature 5 title", "Instant sharing");
add("t360.f5.text", "Feature 5 text", "Videos go straight to phones by text, email or QR code, sized for Reels and TikTok.", true);
add("t360.f6.title", "Feature 6 title", "Room for the squad");
add("t360.f6.text", "Feature 6 text", "The platform fits up to four guests at once for group spins.", true);
add("t360.highlights", "Photos heading", "360 highlights");

// ── Packages, gallery, how, faq, contact ────────────────────────────────────
add("packages.seo.title", "Google title", "Photo Booth Packages & Pricing");
add("packages.seo.description", "Google description", "Pricing for every Take a pic booth: Takeapic AI robot, Magic Mirror, Magazine Photo Booth and 360 Photo Booth, plus add-ons.", true);
add("packages.title", "Page heading", "Packages & pricing");
add("packages.lead", "Paragraph", "Every package includes delivery, setup, takedown and instant photo sharing.");

add("gallery.seo.title", "Google title", "Photo Gallery");
add("gallery.seo.description", "Google description", "Real photos from Take a pic photo booth events: weddings, birthdays, corporate parties and brand activations in New York.", true);
add("gallery.title", "Page heading", "Gallery");
add("gallery.lead", "Paragraph", "Real guests, real events. Here's what a night with Take a pic looks like.");
add("gallery.cta", "Button", "Book your date");
add("gallery.mirror", "Mirror video caption", "Magic mirror booth, in every package");

add("how.seo.title", "Google title", "How It Works");
add("how.seo.description", "Google description", "Book a photo booth in four steps: choose a booth and package, pay a deposit, we set up, your guests get their photos instantly.", true);
add("how.title", "Page heading", "How it works");
add("how.s1.title", "Step 1 title", "Choose your booth");
add("how.s1.text", "Step 1 text", "Pick the Takeapic robot, Magic Mirror, Magazine or 360 booth, a package and any add-ons.", true);
add("how.s2.title", "Step 2 title", "Pay a deposit");
add("how.s2.text", "Step 2 text", "Secure checkout through Stripe holds your date instantly.", true);
add("how.s3.title", "Step 3 title", "We set up");
add("how.s3.text", "Step 3 text", "Our team arrives early with everything you booked, from the robot to the red carpet.", true);
add("how.s4.title", "Step 4 title", "Guests get their photos");
add("how.s4.text", "Step 4 text", "Photos and 360 videos are shared on the spot and in an online gallery.", true);
add("how.cta", "Button", "Start booking");

add("faq.seo.title", "Google title", "FAQ");
add("faq.seo.description", "Google description", "Answers about our robot photo booth rentals: pricing, booking, deposits, events and how the drone-assisted 360 camera works.", true);
add("faq.title", "Page heading", "Frequently asked questions");

add("contact.seo.title", "Google title", "Contact");
add("contact.seo.description", "Google description", "Questions about a robot photo booth rental? Send us your event details and we'll reply within one business day.", true);
add("contact.title", "Page heading", "Contact us");
add("contact.intro", "Intro ({email} becomes a link, {area})", "Or email {email}. We serve {area}.");
add("contact.name", "Form: name", "Name");
add("contact.email", "Form: email", "Email");
add("contact.phone", "Form: phone", "Phone");
add("contact.date", "Form: event date", "Event date");
add("contact.message", "Form: message", "How can we help?");
add("contact.send", "Form: send button", "Send message");
add("contact.sending", "Form: sending…", "Sending…");
add("contact.thanks", "After sending", "Thanks! We'll reply within one business day. 🤖");
add("contact.error", "Error message", "Something went wrong. Please try again.");

// ── Booking pages ───────────────────────────────────────────────────────────
add("book.seo.title", "Google title", "Book Your Photo Booth");
add("book.seo.description", "Google description", "Reserve your robot photo booth. Choose a package, pick your date and pay a secure deposit with Stripe.", true);
add("book.title", "Page heading", "Book your date");
add("book.l1", "Step 1 title", "1. Choose your booth & package");
add("book.package", "Package field", "Package");
add("book.l2", "Step 2 title", "2. Add-ons");
add("book.optional", "'optional' note", "(optional)");
add("book.l3", "Step 3 title", "3. Your event");
add("book.date", "Event date field", "Event date");
add("book.type", "Event type field", "Event type");
add("book.select", "Event type placeholder", "Select…");
add("book.venue", "Venue field", "Venue / address");
add("book.guests", "Guests field", "Approx. guests");
add("book.l4", "Step 4 title", "4. Your details");
add("book.name", "Name field", "Full name");
add("book.email", "Email field", "Email");
add("book.phone", "Phone field", "Phone");
add("book.notes", "Notes field", "Anything else we should know?");
add("book.total", "Total label", "Total");
add("book.depositToday", "Deposit label ({pct})", "{pct}% deposit today:");
add("book.pay", "Pay button ({amount})", "Pay {amount} deposit");
add("book.redirecting", "Pay button while loading", "Redirecting to Stripe…");
add("book.secure", "Small print under the button", "Secure payment by Stripe. The remaining balance is due before your event.");
add("book.ok.title", "After payment: heading", "You're booked! 🎉");
add("book.ok.text", "After payment: text", "Your deposit went through. A Stripe receipt is on its way to your inbox, and we'll follow up shortly to confirm the details.", true);
add("book.ok.button", "After payment: button", "Back home");

export const TEXT: Readonly<Record<string, TextDef>> = d;
export type TextKey = string;

export const groupOf = (key: string) => key.split(".")[0];

/** Replaces {name} placeholders. */
export const fill = (s: string, vars?: Record<string, string | number>) =>
  vars ? s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : s;
