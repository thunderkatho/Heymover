import { useState } from "react";

const tiers = [
  {
    id: "basic",
    name: "Starter",
    price: "$75",
    emoji: "🗺️",
    tagline: "Get vetted movers. Skip the research.",
    color: "#FF1493",
    colorLight: "#FFE6F0",
    desc: "Transparency in cost, moving needs, and trusted movers whether you're new to the big apple or a tenured New Yorker.",
    features: [
      "3 curated mover quotes from vetted companies",
      "Side-by-side price & review comparison",
      "Booking intro — we connect you directly",
      "NYC moving checklist",
      "Email and chat support through move day",
    ],
  },
  {
    id: "standard",
    name: "Coordinated",
    price: "$149",
    emoji: "🏙️",
    tagline: "We handle the NYC stuff.",
    color: "#9B59B6",
    colorLight: "#F0E6FF",
    desc: "COIs, elevator reservations, management offices — the NYC gotchas that can blindside you.",
    features: [
      "Everything in Starter",
      "Certificate of Insurance (COI) request & delivery",
      "Building management office contact & coordination",
      "Elevator / service entrance reservation",
      "Photos of where your moving to (street view) so you can gauge exactly what the day of will look like",
      "Move-day timeline built around your building's rules",
      "Dedicated coordinator via text",
    ],
    highlight: true,
  },
  {
    id: "premium",
    name: "Full Service",
    price: "$299",
    emoji: "🛡️",
    tagline: "Fully protected. You just show up.",
    color: "#1ABC9C",
    colorLight: "#E6FFFE",
    desc: "Everything coordinated end-to-end, both buildings. If anything goes wrong, we fight for you.",
    features: [
      "Everything in Coordinated",
      "COI coordination for both buildings",
      "Mover booked & confirmed on your behalf",
      "Both building offices contacted & confirmed",
      "Day-of oversight in person - your coordinator to protect you and the things you care about",
      "Utility & address change reminder checklist",
      "Post-move follow-up if anything goes wrong",
      "Priority same-day response",
    ],
  },
];

const steps = ["Choose Plan", "Move Details", "Confirm"];
const boroughs = ["Manhattan", "Brooklyn", "Queens", "The Bronx", "Staten Island"];

const NYC_FACTS = [
  "Most NYC buildings require a Certificate of Insurance (COI) before any move — first-timers almost never know this until move day.",
  "Elevator reservations can book out weeks in advance. Missing your window can delay your entire move.",
  "Unlicensed movers are everywhere on Craigslist — and you have no recourse if they damage your stuff.",
  "Many buildings charge extra fees not disclosed upfront. We check before you're blindsided.",
  "Move-in windows are often just 4 hrs. We build your timeline around your building's actual rules.",
];

// Mock move data for dashboard
const createMockMove = (formData, selectedTier) => {
  const moveDate = new Date(formData.date);
  const startDate = new Date(moveDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days before
  
  return {
    id: "MOVE-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
    status: "in-progress", // "upcoming", "in-progress", "completed"
    tier: selectedTier,
    booking: formData,
    timeline: [
      { date: startDate, title: "Booking Confirmed", desc: "Your move is locked in", status: "completed", icon: "✓" },
      { date: new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000), title: "COI Submitted", desc: "Certificate of Insurance requested from movers", status: "completed", icon: "✓" },
      { date: new Date(startDate.getTime() + 4 * 24 * 60 * 60 * 1000), title: "Building Confirmed", desc: "Both building offices contacted & confirmed", status: "in-progress", icon: "🔄" },
      { date: moveDate, title: "Moving Day", desc: "Movers arrive at 8am. We're on standby via text.", status: "upcoming", icon: "📍" },
      { date: new Date(moveDate.getTime() + 1 * 24 * 60 * 60 * 1000), title: "Follow-up", desc: "We check in to make sure everything went smooth", status: "upcoming", icon: "🤝" },
    ],
    costBreakdown: [
      { label: "Mover Quote (Your direct cost)", amount: selectedTier.id === "basic" ? 1200 : selectedTier.id === "standard" ? 1400 : 1500, note: "You pay movers directly" },
      { label: "HeyMover Coordination Fee", amount: parseInt(selectedTier.price.replace("$", "")), note: "Transparent, flat rate" },
      { label: "Total", amount: (selectedTier.id === "basic" ? 1200 : selectedTier.id === "standard" ? 1400 : 1500) + parseInt(selectedTier.price.replace("$", "")), highlight: true },
    ],
    checklist: [
      { id: 1, title: "Schedule movers", completed: true, category: "Booking" },
      { id: 2, title: "Notify building management (old)", completed: true, category: "Coordination" },
      { id: 3, title: "Reserve elevator slot", completed: true, category: "Coordination" },
      { id: 4, title: "Pack non-essentials", completed: true, category: "Prep" },
      { id: 5, title: "Confirm with movers 48hrs before", completed: false, category: "Prep" },
      { id: 6, title: "Clear hallways & parking", completed: false, category: "Day-Of" },
      { id: 7, title: "Have COI ready", completed: false, category: "Day-Of" },
      { id: 8, title: "Change address with USPS", completed: false, category: "After" },
      { id: 9, title: "Transfer utilities", completed: false, category: "After" },
    ],
    coordinator: {
      name: "Sarah Chen",
      phone: "(212) 555-0147",
      email: "sarah@heymover.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    },
    updates: [
      { id: 1, timestamp: "Today 2:30pm", title: "Old building confirmed", desc: "We spoke with management at 123 Main St. Elevator reserved for 8am-12pm on May 25th. COI required by 7pm day befo[...]
      { id: 2, timestamp: "Today 11:45am", title: "New building office contacted", desc: "We reached out to 456 Park Ave management. Awaiting confirmation on move-in window.", icon: "📧", read:[...]
      { id: 3, timestamp: "Yesterday 4:12pm", title: "Booking confirmed", desc: "Your $149 Coordinated plan is active. Sarah Chen is your dedicated coordinator.", icon: "✓", read: true },
    ],
  };
};

export default function App() {
  const [page, setPage] = useState("landing");
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [factIdx] = useState(Math.floor(Math.random() * NYC_FACTS.length));
  const [form, setForm] = useState({ fromBorough: "", toBorough: "", date: "", size: "", name: "", email: "", phone: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);
  const [moveData, setMoveData] = useState(null);
  const [activeTab, setActiveTab] = useState("timeline"); // timeline, costs, checklist, photos, support
  const [checkedItems, setCheckedItems] = useState({});
  const [photos, setPhotos] = useState([]);
  const [photoInput, setPhotoInput] = useState("");
  const [unreadUpdates, setUnreadUpdates] = useState(0);

  const handleSelect = (tierId) => { setSelected(tierId); setPage("booking"); setStep(0); };
  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const canProceed = () => {
    if (step === 0) return !!selected;
    if (step === 1) return form.fromBorough && form.toBorough && form.date && form.size;
    if (step === 2) return form.name && form.email && form.phone;
    return false;
  };

  const selectedTier = tiers.find((t) => t.id === selected);

  const handleSubmit = () => {
    const move = createMockMove(form, selectedTier);
    setMoveData(move);
    setUnreadUpdates(move.updates.filter(u => !u.read).length);
    setSubmitted(true);
    setPage("dashboard");
  };

  const handleToggleChecklist = (id) => {
    setCheckedItems({ ...checkedItems, [id]: !checkedItems[id] });
  };

  const handleAddPhoto = () => {
    if (photoInput.trim()) {
      setPhotos([...photos, { id: photos.length, url: photoInput, timestamp: new Date().toLocaleString() }]);
      setPhotoInput("");
    }
  };

  const resetAll = () => { 
    setPage("landing"); 
    setSubmitted(false); 
    setStep(0); 
    setSelected(null); 
    setForm({ fromBorough: "", toBorough: "", date: "", size: "", name: "", email: "", phone: "", notes: "" });
    setMoveData(null);
    setActiveTab("timeline");
    setPhotos([]);
  };

  if (submitted && page === "dashboard" && moveData) {
    return (
      <div style={s.dashboardRoot}>
        <GlobalStyles />
        <DashboardHeader moveData={moveData} onLogout={resetAll} />
        <DashboardNav activeTab={activeTab} setActiveTab={setActiveTab} unreadCount={unreadUpdates} />
        
        <div style={s.dashboardBody}>
          {activeTab === "timeline" && <TimelineView moveData={moveData} />}
          {activeTab === "costs" && <CostBreakdownView moveData={moveData} />}
          {activeTab === "checklist" && <ChecklistView moveData={moveData} checkedItems={checkedItems} onToggle={handleToggleChecklist} />}
          {activeTab === "photos" && <PhotosView photos={photos} onAddPhoto={handleAddPhoto} photoInput={photoInput} setPhotoInput={setPhotoInput} />}
          {activeTab === "support" && <SupportView moveData={moveData} unreadUpdates={unreadUpdates} setUnreadUpdates={setUnreadUpdates} />}
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={s.confirmScreen}>
        <GlobalStyles />
        <div style={s.confirmBg} />
        <div style={s.confirmCard}>
          <div style={{ ...s.checkmark, background: selectedTier?.color }}>✓</div>
          <h2 style={s.confirmTitle}>You're protected! 🎉</h2>
          <p style={s.confirmSub}>
            We received your <strong>{selectedTier?.name}</strong> booking for <strong>{form.date}</strong>.
            A coordinator will reach out to <strong>{form.email}</strong> within 2 hours to confirm everything.
          </p>
          <div style={s.confirmBox}>
            {[["From", form.fromBorough], ["To", form.toBorough], ["Plan", `${selectedTier?.name} — ${selectedTier?.price}`]].map(([l, v]) => (
              <div key={l} style={s.detailRow}><span style={s.detailLabel}>{l}</span><span style={{ fontWeight: 700 }}>{v}</span></div>
            ))}
          </div>
          <div style={s.newbieTip}>
            💡 <strong>New to NYC?</strong> We'll send you a welcome packet with neighborhood tips, building etiquette, and your move-day checklist.
          </div>
          <button style={{ ...s.nextBtn, background: selectedTier?.color, marginTop: 20 }} onClick={() => { setSubmitted(false); setPage("dashboard"); handleSubmit(); }}>
            Go to Your Dashboard →
          </button>
          <button style={s.ghostBtn} onClick={resetAll}>← Back to Home</button>
        </div>
      </div>
    );
  }

  if (page === "booking") {
    return (
      <div style={s.bookingPage}>
        <GlobalStyles />
        <div style={s.bookingHeader}>
          <button style={s.logoSmall} onClick={resetAll}>🗽 HeyMover</button>
          <div style={s.stepBar}>
            {steps.map((label, i) => (
              <div key={label} style={s.stepItem}>
                <div style={{ ...s.stepDot, background: i <= step ? (selectedTier?.color || "#9B59B6") : "#E5E7EB", color: i <= step ? "#fff" : "#9CA3AF" }}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: i <= step ? "#1a1a1a" : "#9CA3AF" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={s.bookingBody}>
          {step === 0 && (
            <div>
              <h2 style={s.bookingTitle}>How much help do you need?</h2>
              <p style={s.bookingSubtitle}>Our fee is fixed and shown now. You pay your mover separately — we never mark it up.</p>
              <div style={s.tierGrid}>
                {tiers.map((tier) => (
                  <div key={tier.id} onClick={() => setSelected(tier.id)} style={{ ...s.tierCard, border: selected === tier.id ? `2.5px solid ${tier.color}` : "2px solid #E5E7EB", background: sel[...]
                    <div style={{ fontSize: 28, marginBottom: 10 }}>{tier.emoji}</div>
                    <div style={{ ...s.tierBadge, background: tier.color }}>{tier.name}</div>
                    <div style={{ ...s.tierPrice, color: tier.color }}>{tier.price}</div>
                    <p style={{ fontSize: 13, color: "#555", lineHeight: 1.5, marginBottom: 14 }}>{tier.desc}</p>
                    <ul style={s.featureList}>
                      {tier.features.map((f) => (
                        <li key={f} style={s.featureItem}><span style={{ color: tier.color, marginRight: 6, fontWeight: 700 }}>✓</span>{f}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div style={{ maxWidth: 620 }}>
              <h2 style={s.bookingTitle}>Tell us about your move</h2>
              <p style={s.bookingSubtitle}>We'll flag anything that might be a problem before move day.</p>
              <div style={s.formGrid}>
                <div style={s.formGroup}>
                  <label style={s.label}>Moving from</label>
                  <select name="fromBorough" value={form.fromBorough} onChange={handleFormChange} style={s.input}>
                    <option value="">Select borough</option>
                    {boroughs.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Moving to</label>
                  <select name="toBorough" value={form.toBorough} onChange={handleFormChange} style={s.input}>
                    <option value="">Select borough</option>
                    {boroughs.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Move date</label>
                  <input type="date" name="date" value={form.date} onChange={handleFormChange} style={s.input} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Apartment size</label>
                  <select name="size" value={form.size} onChange={handleFormChange} style={s.input}>
                    <option value="">Select size</option>
                    {["Studio", "1 Bedroom", "2 Bedrooms", "3 Bedrooms", "4+ Bedrooms"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div style={{ ...s.formGroup, gridColumn: "1 / -1" }}>
                  <label style={s.label}>Special items or anything we should know? (optional)</label>
                  <textarea name="notes" value={form.notes} onChange={handleFormChange} style={{ ...s.input, height: 80, resize: "vertical" }} placeholder="e.g. tight stairwell, 4th floor walkup,[...]
                </div>
              </div>
              <div style={s.alertBox}>
                💡 <strong>First time moving in NYC?</strong> {NYC_FACTS[factIdx]}
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ maxWidth: 620 }}>
              <h2 style={s.bookingTitle}>Almost there!</h2>
              <p style={s.bookingSubtitle}>We'll send your confirmation here. No spam, ever.</p>
              <div style={{ ...s.summaryBox, borderLeft: `4px solid ${selectedTier?.color}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 22 }}>{selectedTier?.emoji}</span>
                  <span style={{ fontWeight: 700, fontSize: 16 }}>{selectedTier?.name} — {selectedTier?.price} coordination fee</span>
                </div>
                {[["Route", `${form.fromBorough} → ${form.toBorough}`], ["Date", form.date], ["Size", form.size]].map(([l, v]) => (
                  <div key={l} style={s.detailRow}><span style={s.detailLabel}>{l}</span><span>{v}</span></div>
                ))}
              </div>
              <div style={s.formGrid}>
                <div style={s.formGroup}>
                  <label style={s.label}>Your name</label>
                  <input name="name" value={form.name} onChange={handleFormChange} style={s.input} placeholder="Jordan Smith" />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleFormChange} style={s.input} placeholder="you@email.com" />
                </div>
                <div style={{ ...s.formGroup, gridColumn: "1 / -1" }}>
                  <label style={s.label}>Phone</label>
                  <input name="phone" type="tel" value={form.phone} onChange={handleFormChange} style={s.input} placeholder="(212) 555-0100" />
                </div>
              </div>
              <div style={s.guaranteeBox}>
                🔒 <strong>Our promise:</strong> Your coordination fee is the only thing we charge. We never mark up mover costs, never share your info, and you can cancel anytime before we sta[...]
              </div>
            </div>
          )}

          <div style={s.navRow}>
            {step > 0 && <button style={s.ghostBtn} onClick={() => setStep(step - 1)}>← Back</button>}
            <button
              style={{ ...s.nextBtn, background: selectedTier?.color || "#9B59B6", opacity: canProceed() ? 1 : 0.4, cursor: canProceed() ? "pointer" : "not-allowed" }}
              disabled={!canProceed()}
              onClick={() => step < steps.length - 1 ? setStep(step + 1) : setSubmitted(true)}
            >
              {step === steps.length - 1 ? "Confirm & Get Protected →" : "Continue →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.root}>
      <GlobalStyles />

      <nav style={s.nav}>
        <div style={s.logo}>🗽 HeyMover</div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <span style={s.navTag}>New to NYC? We've got you.</span>
          <button style={s.navCta} onClick={() => { setPage("booking"); setStep(0); }}>Get Protected →</button>
        </div>
      </nav>

      {/* ORIGIN STORY */}
      <section style={s.originStory}>
        <div style={s.originInner}>
          <div style={s.originBadge}>Why we built this</div>
          <p style={s.originText}>
            I moved to NYC alone and got completely blindsided. Hidden COI requirements, elevator windows I didn't know about, movers who vanished, extra fees buried in the fine print. I spent hours calling building offices, hunting for vetted movers, and wishing someone would just <em>tell me</em> what actually matters. I couldn't find anyone transparent or honest. So I built HeyMover for everyone who deserves better — for people moving solo, people moving to a new city, people who want to know their movers are real and their costs are fair. Because moving is hard enough. It shouldn't feel like you're fighting the system to protect yourself.
          </p>
        </div>
      </section>

      {/* HERO */}
      <section style={s.hero}>
        <div style={s.heroGradient} />
        <div style={s.heroInner}>
          <div style={s.heroTag}>🏙️ For first-timers &amp; solo movers in NYC</div>
          <h1 style={s.heroTitle}>
            Moving to NYC<br />
            <span style={s.heroAccent}>shouldn't feel like</span><br />
            <span style={s.heroAccent2}>a scam waiting to happen.</span>
          </h1>
          <p style={s.heroSub}>
            Unlicensed movers. Hidden COI requirements. Elevator windows nobody told you about.
            We protect first-timers from the stuff NYC doesn't warn you about — for a flat, fully transparent fee.
          </p>
          <div style={s.heroActions}>
            <button style={s.heroCta} onClick={() => { setPage("booking"); setStep(0); }}>
              See What's Included — from $75
            </button>
            <div style={s.pillRow}>
              <span style={{ ...s.pill, borderColor: "#FF1493", color: "#FF1493" }}>✓ You pay movers directly</span>
              <span style={{ ...s.pill, borderColor: "#9B59B6", color: "#9B59B6" }}>✓ Zero markups, ever</span>
              <span style={{ ...s.pill, borderColor: "#1ABC9C", color: "#1ABC9C" }}>✓ Full refund if you cancel early</span>
            </div>
          </div>
        </div>
        <div style={s.heroArt}>
          <div style={s.floatCity}>
            {[{ h: 100, c: "#FF1493" }, { h: 150, c: "#9B59B6" }, { h: 80, c: "#FFA500" }, { h: 180, c: "#1ABC9C" }, { h: 120, c: "#FF69B4" }, { h: 90, c: "#9B59B6" }, { h: 160, c: "#FFA500" }].m[...]
              <div key={i} style={{ width: 32, height: b.h, background: b.c, borderRadius: "4px 4px 0 0", animation: `float ${2.5 + i * 0.3}s ease-in-out infinite`, animationDelay: `${i * 0.2}s`,[...]
            ))}
          </div>
          <div style={{ fontSize: 44, animation: "float 3s ease-in-out infinite", textAlign: "center" }}>🚚</div>
        </div>
      </section>

      {/* GOTCHA BANNER */}
      <section style={s.gotchaBanner}>
        <div style={s.gotchaInner}>
          <span style={s.gotchaLabel}>⚠️ Things NYC doesn't warn first-timers about:</span>
          <div style={s.gotchaList}>
            {["COI required by most buildings", "Elevator reservations book out weeks", "Unlicensed movers = no recourse", "Hidden fees added after you've signed", "4-hour move windows that nobod[...]
              <span key={g} style={s.gotchaItem}>{g}</span>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={s.how}>
        <div style={s.sectionTagWrap}><span style={s.sectionTag}>Simple &amp; transparent</span></div>
        <h2 style={s.sectionTitle}>How it works</h2>
        <div style={s.stepsRow}>
          {[
            { n: "01", emoji: "🔍", color: "#FF1493", bg: "#FFE6F0", title: "Pick your protection level", body: "Every plan shows exactly what's included — no surprises at checkout, no upsell[...]
            { n: "02", emoji: "📋", color: "#9B59B6", bg: "#F0E6FF", title: "We show you everything upfront", body: "Before you pay anything, you get real mover quotes and a full cost breakdown[...]
            { n: "03", emoji: "🛡️", color: "#1ABC9C", bg: "#E6FFFE", title: "We protect your move", body: "COI, both building offices, elevator booking — handled. And if something goes sid[...]
          ].map((step) => (
            <div key={step.n} style={s.howCard}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: step.bg, border: `2px solid ${step.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontS[...]
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 36, fontWeight: 700, color: step.color, marginBottom: 8 }}>{step.n}</div>
              <h3 style={s.howTitle}>{step.title}</h3>
              <p style={s.howBody}>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section style={s.pricing}>
        <div style={s.pricingInner}>
          <div style={s.sectionTagWrap}><span style={s.sectionTag}>Flat-rate plans</span></div>
          <h2 style={s.sectionTitle}>Pick your level of protection</h2>
          <p style={s.sectionSub}>Our coordination fee is it. You pay your mover directly — we never see that money or mark it up.</p>
          <div style={s.pricingGrid}>
            {tiers.map((tier) => (
              <div key={tier.id} style={{ ...s.pricingCard, border: tier.highlight ? `2.5px solid ${tier.color}` : "2px solid #E5E7EB" }}>
                {tier.highlight && <div style={{ ...s.popularBadge, background: tier.color }}>⭐ Most Popular for New Yorkers</div>}
                <div style={{ fontSize: 32, marginBottom: 12 }}>{tier.emoji}</div>
                <h3 style={{ ...s.pricingName, color: tier.color }}>{tier.name}</h3>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 52, fontWeight: 700, color: tier.color, lineHeight: 1, marginBottom: 6 }}>{tier.price}</div>
                <p style={{ fontSize: 14, fontStyle: "italic", color: "#555", marginBottom: 8 }}>{tier.tagline}</p>
                <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, marginBottom: 20 }}>{tier.desc}</p>
                <ul style={s.featureList}>
                  {tier.features.map((f) => (
                    <li key={f} style={s.featureItem}>
                      <span style={{ color: tier.color, marginRight: 8, fontWeight: 700, flexShrink: 0 }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <button style={{ ...s.tierBtn, background: tier.color }} onClick={() => handleSelect(tier.id)}>
                  Get {tier.name} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOR YOU */}
      <section style={s.forYouSection}>
        <div style={s.forYouLeft}>
          <div style={s.sectionTagWrap}><span style={s.sectionTag}>Made for you</span></div>
          <h2 style={{ ...s.sectionTitle, textAlign: "left" }}>Built for people<br />new to NYC</h2>
          <p style={{ color: "#555", lineHeight: 1.75, fontSize: 16, marginBottom: 28 }}>
            Moving to a new city alone is hard enough. NYC adds a layer of bureaucratic complexity that trips up even experienced movers. We built HeyMover specifically for solo movers and first-[...]
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { e: "🗺️", t: "You don't know the borough rules — we do" },
              { e: "📱", t: "Text-based coordination, no phone tag" },
              { e: "💸", t: "Zero markups, zero hidden fees" },
              { e: "🤝", t: "Real human coordinator, not a bot" },
              { e: "🔒", t: "Full refund if you cancel before we start" },
            ].map(p => (
              <div key={p.t} style={{ display: "flex", alignItems: "center", gap: 14, background: "#fff", borderRadius: 12, padding: "14px 18px", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
                <span style={{ fontSize: 22 }}>{p.e}</span>
                <span style={{ fontSize: 15, fontWeight: 600 }}>{p.t}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={s.forYouRight}>
          {[
            { q: "I had no idea my building needed a COI. HeyMover got it sorted in 24 hours. Literally saved my move.", name: "Priya, moved to Brooklyn", color: "#FF1493" },
            { q: "As someone who'd never dealt with NYC buildings before, having someone handle the management office felt like a superpower.", name: "Marcus, moved to Astoria", color: "#9B59B6" [...]
            { q: "I paid $75 and avoided what would have been a total nightmare. Worth every single penny.", name: "Sienna, moved to LES", color: "#1ABC9C" },
          ].map(r => (
            <div key={r.name} style={{ background: "#fff", borderRadius: 16, padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", borderTop: `3px solid ${r.color}` }}>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "#333", marginBottom: 12, fontStyle: "italic" }}>"{r.q}"</p>
              <span style={{ fontSize: 13, fontWeight: 700, color: r.color }}>— {r.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER CTA */}
      <section style={s.footerCta}>
        <div style={s.footerCtaGlow} />
        <div style={s.sectionTagWrap}><span style={{ ...s.sectionTag, color: "#FFA500", borderColor: "#FFA50044", background: "rgba(255,165,0,0.15)" }}>Ready?</span></div>
        <h2 style={s.footerTitle}>Your first NYC move,<br />handled with care.</h2>
        <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: 32, fontSize: 16, maxWidth: 420, textAlign: "center" }}>
          Flat fee. Full transparency. Real human coordinator. From $75.
        </p>
        <button style={s.heroCta} onClick={() => { setPage("booking"); setStep(0); }}>
          Get Protected — from $75 →
        </button>
      </section>

      <footer style={s.footer}>
        <div style={s.logo}>🗽 HeyMover</div>
        <span style={{ color: "#888", fontSize: 13 }}>© 2026 · Made for first-time New Yorkers</span>
      </footer>
    </div>
  );
}

function DashboardHeader({ moveData, onLogout }) {
  return (
    <div style={s.dashHeader}>
      <div>
        <button style={{ ...s.logoSmall, marginBottom: 4 }} onClick={onLogout}>🗽 HeyMover</button>
        <div style={{ fontSize: 13, color: "#666" }}>Booking {moveData.id}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, textAlign: "right" }}>
        <div>
          <div style={{ fontSize: 13, color: "#666" }}>Your Coordinator</div>
          <div style={{ fontWeight: 700 }}>{moveData.coordinator.name}</div>
          <div style={{ fontSize: 12, color: "#1ABC9C" }}>{moveData.coordinator.phone}</div>
        </div>
        <img src={moveData.coordinator.avatar} alt={moveData.coordinator.name} style={{ width: 48, height: 48, borderRadius: "50%" }} />
      </div>
    </div>
  );
}

function DashboardNav({ activeTab, setActiveTab, unreadCount }) {
  const tabs = [
    { id: "timeline", label: "Timeline", icon: "📅" },
    { id: "costs", label: "Cost Breakdown", icon: "💰" },
    { id: "checklist", label: "Checklist", icon: "✓" },
    { id: "photos", label: "Move Photos", icon: "📸" },
    { id: "support", label: "Updates", icon: "💬", badge: unreadCount > 0 ? unreadCount : null },
  ];

  return (
    <div style={s.dashNav}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          style={{
            ...s.navTab,
            borderBottom: activeTab === tab.id ? "3px solid #9B59B6" : "none",
            color: activeTab === tab.id ? "#1a1a1a" : "#666",
            fontWeight: activeTab === tab.id ? 700 : 500,
            position: "relative",
          }}
        >
          <span style={{ marginRight: 6 }}>{tab.icon}</span>
          {tab.label}
          {tab.badge && <span style={s.badge}>{tab.badge}</span>}
        </button>
      ))}
    </div>
  );
}

function TimelineView({ moveData }) {
  return (
    <div style={s.section}>
      <h2 style={s.sectionHead}>Move Timeline</h2>
      <div style={s.timeline}>
        {moveData.timeline.map((item, idx) => (
          <div key={idx} style={s.timelineItem}>
            <div style={s.timelineMarker}>
              <div style={{
                ...s.timelineDot,
                background: item.status === "completed" ? "#1ABC9C" : item.status === "in-progress" ? "#9B59B6" : "#E5E7EB",
                color: "#fff",
                fontSize: 14,
              }}>
                {item.icon}
              </div>
              {idx < moveData.timeline.length - 1 && <div style={s.timelineConnector} />}
            </div>
            <div style={s.timelineContent}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>{item.title}</h3>
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: 12,
                  background: item.status === "completed" ? "#E6FFFE" : item.status === "in-progress" ? "#F0E6FF" : "#F5F5F5",
                  color: item.status === "completed" ? "#1ABC9C" : item.status === "in-progress" ? "#9B59B6" : "#9CA3AF",
                }}>
                  {item.status === "completed" ? "Done" : item.status === "in-progress" ? "In Progress" : "Upcoming"}
                </span>
              </div>
              <p style={{ color: "#666", fontSize: 14 }}>{item.desc}</p>
              <span style={{ fontSize: 12, color: "#999" }}>{item.date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CostBreakdownView({ moveData }) {
  return (
    <div style={s.section}>
      <h2 style={s.sectionHead}>Cost Breakdown</h2>
      <div style={s.costTable}>
        {moveData.costBreakdown.map((item, idx) => (
          <div key={idx} style={{
            ...s.costRow,
            background: item.highlight ? "#F0E6FF" : idx % 2 === 0 ? "#fff" : "#FAFAFA",
            borderBottom: item.highlight ? "3px solid #9B59B6" : "1px solid #E5E7EB",
            padding: item.highlight ? "16px 20px" : "14px 20px",
            fontWeight: item.highlight ? 700 : 500,
          }}>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 2 }}>{item.label}</div>
              {item.note && <div style={{ fontSize: 12, color: "#999" }}>{item.note}</div>}
            </div>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: item.highlight ? 24 : 18, fontWeight: 700, color: item.highlight ? "#9B59B6" : "#1a1a1a" }}>
              ${item.amount}
            </div>
          </div>
        ))}
      </div>
      <div style={s.note}>
        💡 <strong>Important:</strong> You pay your mover directly on move day. HeyMover never sees or handles that money. We only charge the coordination fee shown above.
      </div>
    </div>
  );
}

function ChecklistView({ moveData, checkedItems, onToggle }) {
  const categories = ["Booking", "Coordination", "Prep", "Day-Of", "After"];
  const progress = Object.keys(checkedItems).filter(k => checkedItems[k]).length;
  const total = moveData.checklist.length;

  return (
    <div style={s.section}>
      <h2 style={s.sectionHead}>Move Checklist</h2>
      <div style={s.progressBar}>
        <div style={{
          width: `${(progress / total) * 100}%`,
          height: "100%",
          background: "linear-gradient(90deg, #9B59B6, #FF1493)",
          borderRadius: "8px 0 0 8px",
          transition: "width 0.3s",
        }} />
      </div>
      <div style={{ marginBottom: 20, fontSize: 14, color: "#666" }}>
        {progress} of {total} completed
      </div>

      {categories.map(category => {
        const items = moveData.checklist.filter(i => i.category === category);
        return (
          <div key={category} style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#9B59B6", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {category}
            </h3>
            {items.map(item => (
              <div key={item.id} style={s.checklistItem}>
                <input
                  type="checkbox"
                  checked={checkedItems[item.id] || item.completed}
                  onChange={() => onToggle(item.id)}
                  style={{ width: 20, height: 20, cursor: "pointer", accentColor: "#9B59B6" }}
                />
                <span style={{
                  flex: 1,
                  textDecoration: checkedItems[item.id] || item.completed ? "line-through" : "none",
                  color: checkedItems[item.id] || item.completed ? "#999" : "#1a1a1a",
                }}>
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function PhotosView({ photos, onAddPhoto, photoInput, setPhotoInput }) {
  return (
    <div style={s.section}>
      <h2 style={s.sectionHead}>Move Day Photos</h2>
      <p style={{ color: "#666", marginBottom: 24 }}>Upload photos of your move as it happens. This helps document the condition of your items.</p>

      <div style={s.photoUploader}>
        <input
          type="text"
          placeholder="Paste photo URL or describe what to capture (e.g., 'damage to couch')"
          value={photoInput}
          onChange={(e) => setPhotoInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && onAddPhoto()}
          style={s.input}
        />
        <button
          onClick={onAddPhoto}
          style={{
            ...s.nextBtn,
            background: "#9B59B6",
            marginTop: 0,
            width: "auto",
          }}
        >
          Add Photo
        </button>
      </div>

      {photos.length > 0 ? (
        <div style={s.photoGrid}>
          {photos.map(photo => (
            <div key={photo.id} style={s.photoCard}>
              <div style={s.photoPlaceholder}>📸</div>
              <div style={{ fontSize: 12, color: "#666", marginTop: 8, wordBreak: "break-word" }}>
                {photo.url.length > 40 ? photo.url.substring(0, 40) + "..." : photo.url}
              </div>
              <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>{photo.timestamp}</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={s.emptyState}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📸</div>
          <p>No photos yet. Start documenting your move!</p>
        </div>
      )}
    </div>
  );
}

function SupportView({ moveData, unreadUpdates, setUnreadUpdates }) {
  const [contactForm, setContactForm] = useState({ subject: "", message: "" });

  const handleMarkRead = () => {
    setUnreadUpdates(0);
  };

  return (
    <div style={s.section}>
      <h2 style={s.sectionHead}>Updates & Support</h2>

      {/* Coordinator Info */}
      <div style={s.coordinatorCard}>
        <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16 }}>
          <img src={moveData.coordinator.avatar} alt={moveData.coordinator.name} style={{ width: 64, height: 64, borderRadius: "50%" }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{moveData.coordinator.name}</div>
            <div style={{ color: "#666", fontSize: 14 }}>Your Dedicated Coordinator</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
          <a href={`tel:${moveData.coordinator.phone}`} style={s.contactMethod}>
            <span style={{ fontSize: 18, marginRight: 8 }}>📱</span>
            <div>
              <div style={{ fontSize: 11, color: "#999" }}>Call or Text</div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{moveData.coordinator.phone}</div>
            </div>
          </a>
          <a href={`mailto:${moveData.coordinator.email}`} style={s.contactMethod}>
            <span style={{ fontSize: 18, marginRight: 8 }}>✉️</span>
            <div>
              <div style={{ fontSize: 11, color: "#999" }}>Email</div>
              <div style={{ fontWeight: 700, fontSize: 14, wordBreak: "break-all" }}>{moveData.coordinator.email}</div>
            </div>
          </a>
        </div>
      </div>

      {/* Recent Updates */}
      <div style={{ marginTop: 32 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Recent Updates</h3>
        <div style={s.updatesList}>
          {moveData.updates.map(update => (
            <div key={update.id} style={{
              ...s.updateItem,
              background: update.read ? "#fff" : "#F0E6FF",
              borderLeft: `4px solid ${update.read ? "#E5E7EB" : "#9B59B6"}`,
            }}>
              <div style={{ display: "flex", gap: 12 }}>
                <span style={{ fontSize: 20 }}>{update.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{update.title}</div>
                  <p style={{ color: "#666", fontSize: 14, marginBottom: 8 }}>{update.desc}</p>
                  <span style={{ fontSize: 12, color: "#999" }}>{update.timestamp}</span>
                </div>
                {!update.read && <span style={s.unreadDot} />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Contact */}
      <div style={{ marginTop: 32, background: "#FAFAFA", borderRadius: 12, padding: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Need Something?</h3>
        <p style={{ color: "#666", marginBottom: 16, fontSize: 14 }}>
          Your coordinator is available 24/7 leading up to your move. Use the contact methods above, or describe your issue here:
        </p>
        <textarea
          placeholder="What's up? Any concerns, questions, or last-minute issues?"
          value={contactForm.message}
          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
          style={{ ...s.input, height: 100, marginBottom: 12 }}
        />
        <button style={{ ...s.nextBtn, background: "#9B59B6", width: "100%" }}>
          Send Message to {moveData.coordinator.name}
        </button>
      </div>
    </div>
  );
}

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,400;9..144,700&display=swap');
      @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
      @keyframes slideIn { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
      * { box-sizing:border-box; margin:0; padding:0; }
      body { font-family:'Plus Jakarta Sans',sans-serif; }
      select,input,textarea { font-family:'Plus Jakarta Sans',sans-serif; }
      a { text-decoration:none; color:inherit; }
    `}</style>
  );
}

const s = {
  root: { fontFamily: "'Plus Jakarta Sans',sans-serif", background: "#FAFAFA", color: "#1a1a1a", minHeight: "100vh" },

  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 40px", background: "#fff", borderBottom: "1px solid #F0F0F0", position: "sticky", top: 0, zIndex: 1[...]
  logo: { fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, letterSpacing: "-0.01em" },
  navTag: { fontSize: 13, color: "#9B59B6", fontWeight: 700, background: "#F0E6FF", padding: "5px 14px", borderRadius: 20 },
  navCta: { background: "linear-gradient(135deg,#9B59B6,#FF1493)", color: "#fff", border: "none", borderRadius: 10, padding: "10px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer" },

  originStory: { padding: "64px 40px", background: "#fff", borderBottom: "1px solid #E5E7EB" },
  originInner: { maxWidth: 720, margin: "0 auto" },
  originBadge: { display: "inline-block", background: "linear-gradient(135deg, rgba(155,89,182,0.1), rgba(255,20,147,0.1))", border: "1px solid rgba(155,89,182,0.2)", color: "#9B59B6", borderRadius: 20, padding: "5px 16px", fontSize: 12, fontWeight: 700, marginBottom: 16, letterSpacing: "0.06em", textTransform: "uppercase" },
  originText: { fontSize: 16, lineHeight: 1.8, color: "#555", fontStyle: "italic" },

  hero: { display: "flex", alignItems: "center", padding: "72px 40px 60px", gap: 48, flexWrap: "wrap", position: "relative", overflow: "hidden", background: "#fff" },
  heroGradient: { position: "absolute", inset: 0, background: "radial-gradient(ellipse at 70% 50%, #F0E6FF 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, #FFE6F0 0%, transparent 50%)",[...]
  heroInner: { flex: 1, minWidth: 280, maxWidth: 560, position: "relative", zIndex: 1 },
  heroTag: { display: "inline-block", background: "rgba(155,89,182,0.1)", border: "1px solid rgba(155,89,182,0.3)", color: "#9B59B6", borderRadius: 20, padding: "6px 16px", fontSize: 13, fontWeig[...]
  heroTitle: { fontFamily: "'Fraunces',serif", fontSize: "clamp(32px,4.5vw,52px)", lineHeight: 1.12, marginBottom: 20, fontWeight: 700 },
  heroAccent: { color: "#9B59B6" },
  heroAccent2: { color: "#FF1493" },
  heroSub: { fontSize: 17, lineHeight: 1.72, color: "#555", marginBottom: 36 },
  heroActions: { display: "flex", flexDirection: "column", gap: 18, alignItems: "flex-start" },
  heroCta: { background: "linear-gradient(135deg,#9B59B6,#FF1493)", color: "#fff", border: "none", borderRadius: 12, padding: "16px 32px", fontSize: 16, fontWeight: 700, cursor: "pointer", boxSha[...]
  pillRow: { display: "flex", flexWrap: "wrap", gap: 8 },
  pill: { background: "transparent", border: "1.5px solid", borderRadius: 20, padding: "5px 13px", fontSize: 12, fontWeight: 700 },
  heroArt: { flex: 1, minWidth: 220, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, position: "relative", zIndex: 1 },
  floatCity: { display: "flex", alignItems: "flex-end", gap: 8, height: 190 },

  gotchaBanner: { background: "#1a1a2e", padding: "18px 40px" },
  gotchaInner: { maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" },
  gotchaLabel: { color: "#FFA500", fontWeight: 700, fontSize: 13, flexShrink: 0 },
  gotchaList: { display: "flex", flexWrap: "wrap", gap: 8 },
  gotchaItem: { background: "rgba(255,255,255,0.1)", color: "#fff", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 500 },

  how: { padding: "80px 40px", background: "#FAFAFA" },
  sectionTagWrap: { textAlign: "center", marginBottom: 16 },
  sectionTag: { display: "inline-block", background: "rgba(155,89,182,0.1)", border: "1px solid rgba(155,89,182,0.25)", color: "#9B59B6", borderRadius: 20, padding: "5px 16px", fontSize: 12, font[...]
  sectionTitle: { fontFamily: "'Fraunces',serif", fontSize: "clamp(26px,3vw,40px)", fontWeight: 700, marginBottom: 12, textAlign: "center" },
  sectionSub: { textAlign: "center", color: "#666", fontSize: 16, maxWidth: 560, margin: "0 auto 48px" },
  stepsRow: { display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center", marginTop: 48 },
  howCard: { flex: 1, minWidth: 240, maxWidth: 320, padding: 32, background: "#fff", borderRadius: 20, boxShadow: "0 2px 16px rgba(0,0,0,0.06)" },
  howTitle: { fontSize: 17, fontWeight: 700, marginBottom: 10 },
  howBody: { color: "#666", lineHeight: 1.65, fontSize: 14 },

  pricing: { padding: "80px 0", background: "#fff" },
  pricingInner: { maxWidth: 1100, margin: "0 auto", padding: "0 40px" },
  pricingGrid: { display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center", marginTop: 48 },
  pricingCard: { flex: 1, minWidth: 270, maxWidth: 330, borderRadius: 20, padding: "32px 24px", background: "#fff", boxShadow: "0 2px 20px rgba(0,0,0,0.06)", display: "flex", flexDirection: "colu[...]
  popularBadge: { display: "inline-block", color: "#fff", borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 700, marginBottom: 16, width: "fit-content" },
  pricingName: { fontSize: 13, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 },
  featureList: { listStyle: "none", display: "flex", flexDirection: "column", gap: 8, marginBottom: 24, flex: 1 },
  featureItem: { fontSize: 13, lineHeight: 1.5, display: "flex", alignItems: "flex-start" },
  tierBtn: { width: "100%", border: "none", borderRadius: 10, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer", color: "#fff", marginTop: "auto" },

  forYouSection: { padding: "80px 40px", background: "#FAFAFA", display: "flex", gap: 64, flexWrap: "wrap", maxWidth: 1100, margin: "0 auto" },
  forYouLeft: { flex: 1, minWidth: 280 },
  forYouRight: { flex: 1, minWidth: 260, display: "flex", flexDirection: "column", gap: 16 },

  footerCta: { background: "linear-gradient(135deg,#1a1a2e 0%,#4a235a 50%,#1a1a2e 100%)", padding: "80px 40px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center"[...]
  footerCtaGlow: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 500, height: 500, background: "radial-gradient(circle,rgba(155,89,182,0.3),transparent [...]
  footerTitle: { fontFamily: "'Fraunces',serif", color: "#fff", fontSize: "clamp(28px,3.5vw,46px)", fontWeight: 700, lineHeight: 1.2 },
  footer: { background: "#111", padding: "24px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 },

  bookingPage: { minHeight: "100vh", background: "#FAFAFA" },
  bookingHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 40px", background: "#fff", borderBottom: "1px solid #F0F0F0", flexWrap: "wrap", gap: 16, [...]
  logoSmall: { fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700, background: "none", border: "none", cursor: "pointer", color: "#1a1a1a" },
  stepBar: { display: "flex", gap: 20, alignItems: "center" },
  stepItem: { display: "flex", alignItems: "center", gap: 8 },
  stepDot: { width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, transition: "all 0.3s" },
  bookingBody: { maxWidth: 940, margin: "0 auto", padding: "48px 24px" },
  bookingTitle: { fontFamily: "'Fraunces',serif", fontSize: 34, fontWeight: 700, marginBottom: 8 },
  bookingSubtitle: { color: "#666", marginBottom: 36, fontSize: 15 },
  tierGrid: { display: "flex", gap: 16, flexWrap: "wrap" },
  tierCard: { flex: 1, minWidth: 220, borderRadius: 16, padding: "24px 20px", cursor: "pointer", transition: "all 0.2s" },
  tierBadge: { display: "inline-block", color: "#fff", borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 800, marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }[...]
  tierPrice: { fontFamily: "'Fraunces',serif", fontSize: 40, fontWeight: 700, lineHeight: 1, marginBottom: 10 },

  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 },
  formGroup: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 13, fontWeight: 700, color: "#333" },
  input: { border: "1.5px solid #E5E7EB", borderRadius: 10, padding: "11px 14px", fontSize: 15, outline: "none", background: "#fff", color: "#1a1a1a", fontFamily: "'Plus Jakarta Sans',sans-serif"[...]
  alertBox: { marginTop: 24, background: "#FFFBEB", border: "1.5px solid #FCD34D", borderRadius: 12, padding: "14px 18px", fontSize: 14, lineHeight: 1.6, color: "#92400E" },
  guaranteeBox: { marginTop: 20, background: "#F0FFF4", border: "1.5px solid #6EE7B7", borderRadius: 12, padding: "14px 18px", fontSize: 14, lineHeight: 1.6, color: "#065F46" },
  summaryBox: { background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 14, padding: "20px 24px", marginBottom: 28, display: "flex", flexDirection: "column", gap: 10 },
  detailRow: { display: "flex", justifyContent: "space-between", fontSize: 14, color: "#555", paddingBottom: 8, borderBottom: "1px solid #F5F5F5" },
  detailLabel: { color: "#9CA3AF", fontWeight: 600 },
  navRow: { display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 40, alignItems: "center" },
  ghostBtn: { background: "none", border: "1.5px solid #E5E7EB", borderRadius: 10, padding: "12px 24px", fontSize: 15, cursor: "pointer", color: "#555", fontWeight: 600 },
  nextBtn: { border: "none", borderRadius: 12, padding: "14px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer", color: "#fff", boxShadow: "0 4px 16px rgba(0,0,0,0.2)", transition: "opacity[...]

  confirmScreen: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative" },
  confirmBg: { position: "fixed", inset: 0, background: "linear-gradient(135deg,#F0E6FF,#FFE6F0,#E6FFFE)", zIndex: 0 },
  confirmCard: { background: "#fff", borderRadius: 24, padding: "48px 40px", maxWidth: 480, width: "100%", textAlign: "center", boxShadow: "0 8px 40px rgba(0,0,0,0.1)", position: "relative", zInd[...]
  checkmark: { width: 64, height: 64, borderRadius: "50%", color: "#fff", fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontWeight: 700 },
  confirmTitle: { fontFamily: "'Fraunces',serif", fontSize: 34, fontWeight: 700, marginBottom: 14 },
  confirmSub: { color: "#555", lineHeight: 1.7, marginBottom: 28, fontSize: 15 },
  confirmBox: { background: "#FAFAFA", borderRadius: 12, padding: "18px 20px", marginBottom: 20, display: "flex", flexDirection: "column", gap: 10, textAlign: "left" },
  newbieTip: { background: "#FFFBEB", border: "1.5px solid #FCD34D", borderRadius: 12, padding: "14px 16px", fontSize: 13, lineHeight: 1.6, color: "#92400E", marginBottom: 24, textAlign: "left" }[...]

  // Dashboard styles
  dashboardRoot: { minHeight: "100vh", background: "#FAFAFA", fontFamily: "'Plus Jakarta Sans',sans-serif" },
  dashHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", background: "#fff", borderBottom: "1px solid #E5E7EB", flexWrap: "wrap", gap: 24, pos[...]
  dashNav: { display: "flex", gap: 0, padding: "0 40px", background: "#fff", borderBottom: "1px solid #E5E7EB", overflowX: "auto" },
  navTab: { padding: "16px 20px", background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#666", whiteSpace: "nowrap", position: "relative" },
  badge: { background: "#FF1493", color: "#fff", borderRadius: "50%", width: 20, height: 20, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700,[...]
  dashboardBody: { maxWidth: 1200, margin: "0 auto", padding: "40px 40px" },
  section: { background: "#fff", borderRadius: 16, padding: 32, boxShadow: "0 2px 16px rgba(0,0,0,0.04)" },
  sectionHead: { fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 700, marginBottom: 24 },

  // Timeline
  timeline: { display: "flex", flexDirection: "column", gap: 0 },
  timelineItem: { display: "flex", gap: 20, paddingBottom: 24, position: "relative" },
  timelineMarker: { display: "flex", flexDirection: "column", alignItems: "center", minWidth: 40 },
  timelineDot: { width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  timelineConnector: { width: 2, flex: 1, background: "#E5E7EB", minHeight: 40, marginTop: 8 },
  timelineContent: { flex: 1, paddingTop: 4 },

  // Costs
  costTable: { borderRadius: 12, overflow: "hidden", border: "1px solid #E5E7EB" },
  costRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  note: { marginTop: 24, background: "#FFFBEB", border: "1.5px solid #FCD34D", borderRadius: 12, padding: "14px 18px", fontSize: 14, color: "#92400E" },

  // Checklist
  progressBar: { width: "100%", height: 8, background: "#E5E7EB", borderRadius: 8, overflow: "hidden", marginBottom: 16 },
  checklistItem: { display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #F5F5F5" },

  // Photos
  photoUploader: { display: "flex", gap: 12, marginBottom: 32 },
  photoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 16 },
  photoCard: { background: "#FAFAFA", borderRadius: 12, padding: 16, textAlign: "center", border: "1px solid #E5E7EB" },
  photoPlaceholder: { fontSize: 32, width: "100%", textAlign: "center" },
  emptyState: { textAlign: "center", padding: "60px 20px", color: "#999" },

  // Support
  coordinatorCard: { background: "#F0E6FF", borderRadius: 16, padding: 24, marginBottom: 32 },
  contactMethod: { display: "flex", alignItems: "center", gap: 12, padding: 12, background: "#fff", borderRadius: 10, cursor: "pointer", transition: "background 0.2s" },
  updatesList: { display: "flex", flexDirection: "column", gap: 16 },
  updateItem: { borderRadius: 12, padding: 16, background: "#fff", border: "1px solid #E5E7EB" },
  unreadDot: { width: 8, height: 8, borderRadius: "50%", background: "#9B59B6", flexShrink: 0 },
};
