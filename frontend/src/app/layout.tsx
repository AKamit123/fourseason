import type { Metadata } from "next";
import "./globals.css";

// Dynamic SEO metadata generator reading from backend settings with high-impact luxury defaults
export async function generateMetadata(): Promise<Metadata> {
  const defaultTitle = "Four Seasons | Luxury Wedding & Event Atelier";
  const defaultDesc = "Premier luxury wedding & event organizers. AI-powered event concepting, authentic rental mandaps, wave screen stages, Versace bars, and turnkey celebrations.";
  const defaultKeywords = "luxury wedding planner, event organizers, wedding decor rental, mandap rental, stage design, arabic nikah decor, royal wedding, corporate event planner, four seasons";
  const defaultOgImage = "/reference_assets/hero_mandap_red.jpg";
  const defaultUrl = "https://fourseasons.events";

  let seoData: Record<string, string> = {};
  try {
    const res = await fetch("http://localhost:4000/api/settings/seo", {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      seoData = await res.json();
    }
  } catch {
    // Graceful fallback to default luxury settings
  }

  const title = seoData.meta_title || defaultTitle;
  const description = seoData.meta_description || defaultDesc;
  const keywords = seoData.meta_keywords || defaultKeywords;
  const ogTitle = seoData.og_title || title;
  const ogDesc = seoData.og_description || description;
  const ogImage = seoData.og_image || defaultOgImage;
  const canonical = seoData.canonical_url || defaultUrl;

  return {
    title,
    description,
    keywords,
    authors: [{ name: seoData.author || "Four Seasons Events Organizers LLC" }],
    creator: "Four Seasons",
    publisher: "Four Seasons Events Organizers LLC",
    metadataBase: new URL(canonical),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: canonical,
      siteName: "Four Seasons",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Four Seasons — Luxury Weddings & Event Atelier",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDesc,
      images: [ogImage],
      creator: "@fourseasons",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: seoData.google_verification || "google-site-verification-token-fourseasons",
    },
    icons: {
      icon: "/favicon.ico",
      apple: "/reference_assets/hero_mandap_red.jpg",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org Structured Data for Google Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": "https://fourseasons.events/#business",
        name: "Four Seasons — Events Atelier",
        url: "https://fourseasons.events",
        logo: "https://fourseasons.events/reference_assets/hero_mandap_red.jpg",
        image: "https://fourseasons.events/reference_assets/hero_mandap_red.jpg",
        telephone: "+971508821900",
        email: "concierge@fourseasons.com",
        priceRange: "AED 45,000 - AED 500,000+",
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            opens: "09:00",
            closes: "22:00",
          },
        ],
      },
      {
        "@type": "EventVenue",
        "@id": "https://fourseasons.events/#atelier",
        name: "Four Seasons Luxury Decor Atelier",
        description: "Bespoke wedding and event decor rental, mandaps, wave stages, bar counters, and dynamic invitations.",
        telephone: "+97143982211",
      },
    ],
  };

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen bg-fs-navy text-fs-cream">
        {children}
      </body>
    </html>
  );
}
