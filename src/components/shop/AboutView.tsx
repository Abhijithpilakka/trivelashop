"use client";

import { Icons } from "@/components/ui/Icons";
import { WA_NUMBER } from "@/config";

interface AboutViewProps {
  onGoCart: () => void;
}

const STATS = [
  { value: "50+", label: "Kits Delivered" },
  { value: "10+",  label: "Clubs & Nations" },
  { value: "4.7",  label: "Avg Rating" },
  { value: "6 Days", label: "Avg Delivery" },
];

const FEATURES = [
  { icon: "🏆", title: "Premium Quality",       desc: "We only sell high quality merchandise." },
  { icon: "🪡", title: "Embroidery & Heat Press", desc: "Choose embroidered crests for texture or heat-pressed for a clean, flat finish." },
  { icon: "📦", title: "Pan-India Shipping",     desc: "We ship everywhere in India. Free delivery on orders above ₹1,499." },
  { icon: "💬", title: "WhatsApp Support",       desc: "Order, track, and get help — all on WhatsApp. No app download needed." },
];

const FAQS = [
  {
    q: "What's the difference between Fan and Player versions?",
    a: "Fan versions use standard polyester. Player versions are match-grade with moisture-wicking fabric and a closer fit. Master Copy is closest to the original match-day shirt.",
  },
  {
    q: "Can I get custom name & number printing?",
    a: "Yes — just mention your name and number when ordering on WhatsApp. We'll add it for a small extra charge.",
  },
  {
    q: "How long does delivery take?",
    a: "Most orders arrive in 3–5 days. Remote areas may take up to 7 days.",
  },
  {
    q: "Can I return or exchange?",
    a: "We generally don't accept returns due to logistical reasons, but if there's a quality issue or wrong item, please contact us on WhatsApp within 48 hours of delivery and we'll make it right.",
  },
];

export function AboutView({ onGoCart }: AboutViewProps) {
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi Trivela! I have a question.")}`;

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Header */}
      <div style={{
        padding: "30px 16px 16px",
        borderBottom: "1px solid var(--border)",
        background: "rgba(250,250,248,0.97)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <h2 className="font-serif" style={{ fontSize: 26, letterSpacing: "-0.01em" }}>About</h2>
      </div>

      {/* Hero */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80"
          alt=""
          style={{ width: "100%", height: 190, objectFit: "cover", filter: "brightness(0.28) saturate(0.7)" }}
        />
        <div style={{
          position: "absolute", inset: 0, padding: "0 20px",
          display: "flex", flexDirection: "column", justifyContent: "center",
        }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>
            Est. 2023 · India
          </p>
          <h3 className="font-serif" style={{ fontSize: 34, color: "#fff", lineHeight: 1.1 }}>
            We Live &amp;<br /><span style={{ fontStyle: "italic" }}>Breathe Football</span>
          </h3>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginTop: 10, lineHeight: 1.65, maxWidth: 280 }}>
            Trivela was built to make the world's best football kits accessible to every fan in India.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
        {STATS.map((s, i) => (
          <div key={s.label} style={{
            padding: "16px 8px", textAlign: "center",
            borderRight: i < 3 ? "1px solid var(--border)" : "none",
          }}>
            <p className="font-serif" style={{ fontSize: 22, color: "var(--text)", lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: 9, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 3 }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div style={{ padding: "24px 16px 0" }}>

        {/* Features */}
        <span className="section-label">Why Trivela</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
          {FEATURES.map((f) => (
            <div key={f.title} style={{
              display: "flex", gap: 14, padding: "14px 16px",
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 12, boxShadow: "var(--shadow-sm)",
            }}>
              <span style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }}>{f.icon}</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 3 }}>{f.title}</p>
                <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="divider" style={{ marginBottom: 28 }} />

        {/* FAQs */}
        <span className="section-label">FAQs</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{
              padding: "14px 16px",
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 12, boxShadow: "var(--shadow-sm)",
            }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 6, lineHeight: 1.4 }}>{faq.q}</p>
              <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.65 }}>{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="divider" style={{ marginBottom: 28 }} />

        {/* Contact */}
        <span className="section-label">Get in Touch</span>
        <div className="card" style={{ padding: "20px 16px", marginBottom: 12 }}>
          <p style={{ fontSize: 14, color: "var(--text-mid)", lineHeight: 1.7, marginBottom: 18 }}>
            Questions about your order? Want a custom kit or bulk purchase? We're on WhatsApp and typically reply within minutes.
          </p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              height: 52, background: "var(--wa)", color: "#fff",
              borderRadius: 12, fontWeight: 600, fontSize: 14,
              textDecoration: "none", marginBottom: 12,
            }}
          >
            {Icons.whatsapp} Chat on WhatsApp
          </a>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { icon: Icons.phone, label: "WhatsApp / Call", value: "+91 9137716508" },
              { icon: Icons.mail,  label: "Email",           value: "trivela.co.in@gmail.com" },
            ].map((row) => (
              <div key={row.label} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "11px 14px",
                background: "var(--surface2)", borderRadius: 10, border: "1px solid var(--border)",
              }}>
                <span style={{ color: "var(--accent)", flexShrink: 0 }}>{row.icon}</span>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{row.label}</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{row.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hours */}
        <div className="card" style={{ padding: "16px", marginBottom: 28 }}>
          <span className="section-label">Support Hours</span>
          {[
            { day: "Monday – Saturday", time: "9 AM – 9 PM" },
            { day: "Sunday",            time: "11 AM – 6 PM" },
          ].map((row) => (
            <div key={row.day} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 14, color: "var(--text-muted)" }}>{row.day}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{row.time}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", paddingBottom: 8 }}>
          <p className="font-serif" style={{ fontSize: 20, color: "var(--text-muted)", fontStyle: "italic" }}>Trivela</p>
          <p style={{ fontSize: 10, fontWeight: 600, color: "var(--text-dim)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 2 }}>
            Premium Football Jerseys · India
          </p>
        </div>
      </div>
    </div>
  );
}
