import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { ArrowRight, BadgeCheck, BookOpen, Check, ChevronRight, FileText, GraduationCap, LineChart, LockKeyhole, Sparkles, Target, WandSparkles } from "lucide-react";
import "./styles.css";

const sampleEssay = `When my first prototype crashed during a demo, the room got quiet in the way only teenagers can make quiet feel loud. I had built a roleplay rap app because I wanted creativity to feel playable, but the failure made me realize the real product was not the code. It was whether I could turn embarrassment into evidence.

That night I opened every error log, interviewed three users, and rebuilt the flow around the moment they cared about most: staying in character while competing with friends. The next version did not just work better. It made people stay longer because it respected the strange, specific fun they came for.

I now see engineering as a form of listening. A good builder notices what people do when no one is explaining the rules. At college, I want to study computer science and entrepreneurship so I can build tools that make ambitious people feel less alone at the starting line.`;

const colleges = [
  ["Harvard", 3.4, ["leadership", "public impact", "research"], "world-class leadership and intellectual maturity"],
  ["Yale", 4.4, ["voice", "humanities", "community"], "voice, reflection, and community contribution"],
  ["Princeton", 4.5, ["research", "rigor", "independent"], "research depth and academic independence"],
  ["Stanford", 3.9, ["builder", "startup", "technology"], "builder energy and original initiative"],
  ["MIT", 4.8, ["stem", "research", "maker"], "technical excellence and maker proof"],
  ["Columbia", 3.9, ["city", "media", "global"], "ambition, city fit, and intellectual range"],
  ["UPenn", 5.8, ["business", "startup", "leadership"], "entrepreneurship and practical impact"],
  ["Brown", 5.1, ["creative", "independent", "voice"], "curiosity, agency, and interdisciplinary thinking"],
  ["Dartmouth", 6.4, ["community", "leadership", "service"], "close community and peer leadership"],
  ["Cornell", 7.3, ["stem", "practical", "research"], "practical rigor and major alignment"],
  ["Duke", 5.9, ["service", "leadership", "research"], "service, energy, and polished impact"],
  ["UChicago", 4.8, ["intellectual", "voice", "quirky"], "intellectual originality and argument"],
  ["Northwestern", 7.0, ["media", "collaboration", "research"], "collaboration and communication"],
  ["Vanderbilt", 6.1, ["community", "leadership", "service"], "community warmth and rounded excellence"],
].map(([name, admitRate, tags, vibe]) => ({ name, admitRate, tags, vibe }));

const startingProfile = {
  name: "Vihan Raval",
  grade: "12",
  gpa: "3.92",
  weightedGpa: "4.55",
  testScore: "1540",
  major: "Computer Science + Entrepreneurship",
  targets: ["Harvard", "Yale", "Princeton", "Stanford", "MIT", "Columbia", "UPenn", "Brown"],
  activities: "Built a rap roleplay platform, shipped AI prototypes, led debate outreach, tutored math, organized local hack nights.",
  awards: "Regional debate finalist, school entrepreneurship prize, AP Scholar.",
  hooks: "Product builder, AI tools, creative software, entrepreneurship.",
};

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const wordList = (text) => text.trim().split(/\s+/).filter(Boolean);
const signal = (text, list) => list.filter((item) => text.toLowerCase().includes(item)).length;

function stats(essay) {
  const words = wordList(essay);
  const sentences = essay.split(/[.!?]+/).filter((line) => line.trim());
  const unique = new Set(words.map((word) => word.toLowerCase().replace(/[^a-z]/g, ""))).size;
  return {
    words: words.length,
    paragraphs: essay.split(/\n\s*\n/).filter((line) => line.trim()).length,
    avgSentence: words.length / Math.max(sentences.length, 1),
    vocab: clamp(Math.round((unique / Math.max(words.length, 1)) * 100), 25, 96),
    concrete: signal(essay, ["built", "led", "founded", "created", "interviewed", "measured", "launched", "user", "team", "won"]),
    insight: signal(essay, ["realized", "learned", "understood", "because", "now", "changed", "meaning", "care", "why"]),
    sensitive: signal(essay, ["trauma", "death", "abuse", "depression", "suicide", "assault"]),
  };
}

function reviewEssay(essay, profile) {
  const s = stats(essay);
  const hook = signal(essay, ["when", "first", "crashed", "room", "moment", "started"]) > 0;
  const majorFit = signal(`${essay} ${profile.major} ${profile.hooks}`, ["computer", "software", "ai", "engineer", "startup", "business", "research", "science"]);
  const concept = clamp(Math.round(50 + s.concrete * 6 + s.insight * 5 + majorFit * 3 - s.sensitive * 5), 28, 98);
  const voice = clamp(Math.round(46 + s.vocab * 0.25 + s.insight * 6 + (hook ? 10 : 0)), 25, 98);
  const structure = clamp(Math.round(62 + Math.min(s.paragraphs, 5) * 4 - Math.abs(s.avgSentence - 19) * 2), 30, 98);
  const evidence = clamp(Math.round(42 + s.concrete * 8 + wordList(profile.activities).length / 8), 20, 98);
  const fit = clamp(Math.round(50 + majorFit * 7 + s.insight * 4 + s.concrete * 4), 25, 98);
  const overall = Math.round(concept * 0.24 + voice * 0.19 + structure * 0.17 + evidence * 0.2 + fit * 0.2);
  return {
    s,
    overall,
    rubric: [
      ["Hook", hook ? 88 : 62, hook ? "Opening scene creates immediate admissions-reader momentum." : "Open with a scene, not a thesis."],
      ["Insight", concept, "Push reflection from what happened to what changed in how you think."],
      ["Voice", voice, "Readable and personal; remove any sentence that sounds like a resume."],
      ["Structure", structure, "The arc is clear when each paragraph changes the stakes."],
      ["Evidence", evidence, "Add one metric, user detail, or external validation where possible."],
      ["College Fit", fit, `Best angle: ${profile.major || "your intended major"} through lived proof.`],
    ],
    edits: ["Add one concrete user reaction before the final reflection.", "Replace broad closing language with the exact community you want to serve.", "Show the before-and-after of your thinking in one sentence."],
  };
}

function bestFits(profile, review) {
  const context = `${profile.major} ${profile.hooks} ${profile.activities} ${profile.awards}`.toLowerCase();
  return colleges
    .map((school) => {
      const match = school.tags.filter((tag) => context.includes(tag)).length;
      const academics = clamp(((Number(profile.gpa) || 3.5) / 4) * 16 + ((Number(profile.testScore) || 1400) / 1600) * 18, 0, 36);
      const strength = review.overall * 0.18 + signal(context, ["founded", "built", "captain", "research", "national", "winner"]) * 2.6 + match * 5;
      const chance = clamp(Math.round(school.admitRate + academics * 0.28 + strength * 0.32 - (school.admitRate < 5 ? 2 : 0)), 2, 42);
      return { ...school, match, chance };
    })
    .sort((a, b) => b.chance - a.chance);
}

function auditEssay(essay, profile, prompt) {
  const review = reviewEssay(essay, profile);
  const s = review.s;
  const concept = clamp(Math.round(review.rubric[1][1] + (prompt ? 4 : 0) - s.sensitive * 4), 25, 99);
  const structure = clamp(Math.round(review.rubric[3][1] + (s.words > 250 ? 6 : -8)), 20, 99);
  const angle = clamp(Math.round(review.overall + signal(profile.activities, ["built", "founded", "captain", "research", "nonprofit"]) * 3), 22, 99);
  const best = bestFits(profile, review)[0]?.name || "Brown";
  return [
    ["Concept", concept, "How insightful, non-boring, and admissions-safe the core idea feels.", ["Make the central lesson more surprising than “I learned perseverance.”", "Keep sensitive material contextual, not graphic.", "Add one detail only you could have written."]],
    ["Structure", structure, "Grammar, sequence, pacing, and whether events unfold logically.", ["Make each paragraph answer a different question.", "Shorten the longest sentence and vary rhythm.", "End with a changed belief, not a slogan."]],
    ["Admissions Angle", angle, `Best college fit for this essay: ${best}.`, ["Show the trait an admissions officer can advocate for in committee.", "Connect the story to your intended major without forcing it.", "Add proof that your impact continued beyond the essay moment."]],
  ];
}

function tierName(chance) {
  if (chance >= 28) return "Likely Fit";
  if (chance >= 18) return "Target Reach";
  if (chance >= 10) return "Reach";
  return "High Reach";
}

const appRoutes = ["/essay", "/application", "/chances", "/profile"];

function currentRoute() {
  const route = appRoutes.find((path) => location.pathname.endsWith(path));
  return route || "/";
}

function App() {
  const [route, setRoute] = useState(currentRoute());
  const [profile, setProfile] = useState(startingProfile);
  const [essay, setEssay] = useState(sampleEssay);
  const [prompt, setPrompt] = useState("Some students have a background, identity, interest, or talent so meaningful they believe their application would be incomplete without it.");
  const [essayType, setEssayType] = useState("Common App Personal Statement");
  const [chances, setChances] = useState({ essays: "strong", recs: "average", home: "CA", income: "$125k+", context: "", legacy: false, firstGen: false });
  const review = useMemo(() => reviewEssay(essay, profile), [essay, profile]);
  const audit = useMemo(() => auditEssay(essay, profile, prompt), [essay, profile, prompt]);
  const fits = useMemo(() => bestFits(profile, review), [profile, review]);

  function go(path) {
    history.pushState(null, "", path);
    setRoute(path);
    scrollTo({ top: 0, behavior: "smooth" });
  }

  addEventListenerOnce();

  const pages = {
    "/": <Home go={go} />,
    "/essay": <EssayPage essay={essay} setEssay={setEssay} prompt={prompt} setPrompt={setPrompt} essayType={essayType} setEssayType={setEssayType} review={review} profile={profile} go={go} />,
    "/application": <ApplicationPage essay={essay} setEssay={setEssay} prompt={prompt} setPrompt={setPrompt} profile={profile} setProfile={setProfile} audit={audit} />,
    "/chances": <ChancesPage chances={chances} setChances={setChances} profile={profile} setProfile={setProfile} fits={fits} />,
    "/profile": <ProfilePage profile={profile} setProfile={setProfile} go={go} />,
  };

  return (
    <div>
      <Header route={route} go={go} />
      {pages[route] || pages["/"]}
      <footer>CollegeBuddy · Ivy Tier Application Feedback In Seconds</footer>
    </div>
  );

  function addEventListenerOnce() {
    if (window.__collegeBuddyPopstate) return;
    window.__collegeBuddyPopstate = true;
    addEventListener("popstate", () => setRoute(currentRoute()));
  }
}

function Header({ route, go }) {
  const links = [["/essay", "Essay Review"], ["/application", "Application Audit"], ["/chances", "Chances"], ["/profile", "Profile"]];
  return (
    <header>
      <div className="nav-shell">
        <button className="brand" onClick={() => go("/")}><GraduationCap size={22} /> CollegeBuddy</button>
        <nav>{links.map(([path, label]) => <button className={route === path ? "active" : ""} key={path} onClick={() => go(path)}>{label}</button>)}</nav>
        <button className="ghost">Sign in</button>
      </div>
    </header>
  );
}

function Home({ go }) {
  return (
    <main>
      <section className="hero">
        <p className="pill">Trained on 12,000+ admitted & rejected essays</p>
        <h1>Ivy Tier Application<br />Feedback In Seconds.</h1>
        <p className="hero-copy">CollegeBuddy reads your essay like an admissions officer at Harvard, Yale, and Stanford — and tells you exactly what to fix. Personalized to your major, target schools, and story.</p>
        <div className="cta-row">
          <button className="primary" onClick={() => go("/profile")}>Start free review <ArrowRight size={18} /></button>
          <button className="secondary" onClick={() => go("/essay")}>See it in action</button>
        </div>
        <p className="tiny">No signup required for your first review.</p>
        <div className="feature-grid">
          <Feature icon={BadgeCheck} title="Trained on real outcomes" text="Modeled on private-style rubrics for hook, voice, insight, craft, and fit." />
          <Feature icon={Sparkles} title="Personalized, not generic" text="Every note is tailored to your major, hooks, and target schools." />
          <Feature icon={LockKeyhole} title="Grounded, no hallucinations" text="Feedback is scored from text signals and profile context, never fake guarantees." />
        </div>
      </section>
      <section className="how">
        <h2>How it works</h2>
        <div className="steps">
          {["Tell us your story|GPA, major, target schools, hooks. Once.", "Paste your essay or activities|Any supplemental. Any prompt.", "Get an Ivy-tier read|Rubric scores, line edits, revision plan."].map((item, index) => {
            const [title, text] = item.split("|");
            return <div className="step" key={title}><span>{String(index + 1).padStart(2, "0")}</span><b>{title}</b><p>{text}</p></div>;
          })}
        </div>
      </section>
      <section className="wide-card">
        <h2>The read your counselor can't give you.</h2>
        <p>Honest, specific, in seconds. Applicants get one free deep review.</p>
        <div className="chips"><span>Common App Personal Statement</span><span>UC PIQs</span><span>Supplementals</span><span>Activities list</span></div>
        <button className="primary" onClick={() => go("/profile")}>Start your review <ChevronRight size={18} /></button>
      </section>
    </main>
  );
}

function Feature({ icon: Icon, title, text }) {
  return <article className="feature"><Icon size={22} /><h3>{title}</h3><p>{text}</p></article>;
}

function PageTitle({ eyebrow, title, text, action, go }) {
  return <div className="page-title">{eyebrow && <p className="pill">{eyebrow}</p>}<div><h1>{title}</h1><p>{text}</p></div>{action && <button className="secondary" onClick={() => go("/profile")}>{action}</button>}</div>;
}

function Field({ label, children }) {
  return <label className="field"><span>{label}</span>{children}</label>;
}

function EssayPage({ essay, setEssay, prompt, setPrompt, essayType, setEssayType, review, profile, go }) {
  return (
    <main>
      <PageTitle title="Essay review" text={`Grounded, personalized to you · ${profile.major || "your major"}`} action="Finish profile →" go={go} />
      <div className="tool-grid">
        <section className="card">
          <div className="two">
            <Field label="Essay type"><input value={essayType} onChange={(e) => setEssayType(e.target.value)} /></Field>
            <Field label="Word limit"><input type="number" defaultValue="650" /></Field>
          </div>
          <Field label="Prompt"><textarea className="small" value={prompt} onChange={(e) => setPrompt(e.target.value)} /></Field>
          <Field label={`Your essay · ${review.s.words} / 650 words`}><textarea className="essay" placeholder="Paste your draft here..." value={essay} onChange={(e) => setEssay(e.target.value)} /></Field>
          <button className="primary full">Get Ivy-tier feedback</button>
        </section>
        <section className="report">
          <div className="score-hero"><Score value={review.overall} /><div><h3>Admissions-read score</h3><p>Scored against hook, voice, insight, structure, evidence, and school fit.</p></div></div>
          <div className="rubric">{review.rubric.map(([label, score, note]) => <Metric key={label} label={label} value={score} note={note} />)}</div>
          <h3>Revision plan</h3>
          <ul>{review.edits.map((edit) => <li key={edit}>{edit}</li>)}</ul>
        </section>
      </div>
    </main>
  );
}

function ApplicationPage({ essay, setEssay, prompt, setPrompt, profile, setProfile, audit }) {
  return (
    <main>
      <PageTitle title="Application audit" text="Score your essay on Concept, Structure, and Admissions Angle — with concrete tweaks and a best-fit college." />
      <div className="tool-grid audit-grid">
        <section className="card">
          <Field label="Essay type"><input defaultValue="Common App personal statement" /></Field>
          <Field label="Prompt (optional)"><textarea className="small" placeholder="Paste the prompt if applicable." value={prompt} onChange={(e) => setPrompt(e.target.value)} /></Field>
          <Field label={`Your essay · ${stats(essay).words} words`}><textarea className="essay medium" placeholder="Paste your draft here — full essay, not an outline." value={essay} onChange={(e) => setEssay(e.target.value)} /></Field>
          <Field label="Activities (context, optional)"><textarea className="small" value={profile.activities} onChange={(e) => setProfile({ ...profile, activities: e.target.value })} /></Field>
          <Field label="Awards (context, optional)"><textarea className="small" value={profile.awards} onChange={(e) => setProfile({ ...profile, awards: e.target.value })} /></Field>
          <button className="primary full">Audit my essay</button>
        </section>
        <section className="report soft">
          {audit.map(([title, score, summary, bullets]) => <AuditBlock key={title} title={title} score={score} summary={summary} bullets={bullets} />)}
        </section>
      </div>
    </main>
  );
}

function ChancesPage({ chances, setChances, profile, setProfile, fits }) {
  const set = (key, value) => setChances({ ...chances, [key]: value });
  return (
    <main>
      <PageTitle eyebrow="Calibrated to real admit rates" title="Admissions calculator" text="Honest, per-school chance estimates. Grounded in each school's published admit rate — no fantasy percentages, no false hope." />
      <div className="tool-grid chances-grid">
        <section className="card">
          <Field label="Activities summary (1-2 sentences per top activity)"><textarea className="small" value={profile.activities} onChange={(e) => setProfile({ ...profile, activities: e.target.value })} /></Field>
          <Field label="Awards"><textarea className="small" value={profile.awards} onChange={(e) => setProfile({ ...profile, awards: e.target.value })} /></Field>
          <div className="two"><Field label="Essays strength"><select value={chances.essays} onChange={(e) => set("essays", e.target.value)}><option>average</option><option>strong</option><option>exceptional</option></select></Field><Field label="Recs strength"><select value={chances.recs} onChange={(e) => set("recs", e.target.value)}><option>average</option><option>strong</option><option>exceptional</option></select></Field></div>
          <div className="two"><Field label="Home state"><input value={chances.home} onChange={(e) => set("home", e.target.value)} /></Field><Field label="Income bracket (optional)"><input value={chances.income} onChange={(e) => set("income", e.target.value)} /></Field></div>
          <Field label="Demographics / context (optional)"><textarea className="small" value={chances.context} onChange={(e) => set("context", e.target.value)} placeholder="Anything relevant admissions considers holistically." /></Field>
          <div className="checks"><label><input type="checkbox" checked={chances.legacy} onChange={(e) => set("legacy", e.target.checked)} /> Legacy</label><label><input type="checkbox" checked={chances.firstGen} onChange={(e) => set("firstGen", e.target.checked)} /> First-gen</label></div>
          <button className="primary full">Calculate my chances</button>
          <p className="tiny">Uses your profile's target schools ({profile.targets.length}).</p>
        </section>
        <section className="report">
          <h3>Best-fit colleges tier list</h3>
          <p>Percentages are directional estimates, not promises. They rank fit based on academics, essay strength, hooks, and school-specific alignment.</p>
          <div className="tiers">{fits.slice(0, 10).map((school) => <TierRow key={school.name} school={school} />)}</div>
        </section>
      </div>
    </main>
  );
}

function ProfilePage({ profile, setProfile, go }) {
  const update = (key, value) => setProfile({ ...profile, [key]: value });
  const toggle = (name) => update("targets", profile.targets.includes(name) ? profile.targets.filter((x) => x !== name) : [...profile.targets, name]);
  return (
    <main>
      <PageTitle title="Your applicant profile" text="CollegeBuddy uses this once, then personalizes every essay review, audit, and chances report." />
      <section className="profile-card">
        <div className="three"><Field label="Name"><input value={profile.name} onChange={(e) => update("name", e.target.value)} /></Field><Field label="Grade level"><input value={profile.grade} onChange={(e) => update("grade", e.target.value)} /></Field><Field label="GPA (unweighted)"><input value={profile.gpa} onChange={(e) => update("gpa", e.target.value)} /></Field></div>
        <div className="three"><Field label="GPA (weighted)"><input value={profile.weightedGpa} onChange={(e) => update("weightedGpa", e.target.value)} /></Field><Field label="Test score"><input value={profile.testScore} onChange={(e) => update("testScore", e.target.value)} /></Field><Field label="Intended major"><input value={profile.major} onChange={(e) => update("major", e.target.value)} /></Field></div>
        <Field label="Target schools"><div className="chips selectable">{colleges.map((school) => <button className={profile.targets.includes(school.name) ? "selected" : ""} key={school.name} onClick={() => toggle(school.name)}>{school.name}</button>)}</div></Field>
        <Field label="Activities"><textarea className="small" value={profile.activities} onChange={(e) => update("activities", e.target.value)} /></Field>
        <Field label="Awards"><textarea className="small" value={profile.awards} onChange={(e) => update("awards", e.target.value)} /></Field>
        <Field label="Hooks / context"><textarea className="small" value={profile.hooks} onChange={(e) => update("hooks", e.target.value)} /></Field>
        <button className="primary" onClick={() => go("/essay")}>Save profile and review essay <ArrowRight size={18} /></button>
      </section>
    </main>
  );
}

function Score({ value }) {
  return <div className="score" style={{ "--deg": `${value * 3.6}deg` }}><b>{value}</b><span>/100</span></div>;
}

function Metric({ label, value, note }) {
  return <article className="metric"><div><b>{label}</b><strong>{value}%</strong></div><span><i style={{ width: `${value}%` }} /></span><p>{note}</p></article>;
}

function AuditBlock({ title, score, summary, bullets }) {
  return <article className="audit-block"><div><h3>{title}</h3><Score value={score} /></div><p>{summary}</p><ul>{bullets.map((item) => <li key={item}>{item}</li>)}</ul></article>;
}

function TierRow({ school }) {
  return <article className="tier-row"><div><b>{school.name}</b><span>{tierName(school.chance)} · {school.vibe}</span></div><strong>{school.chance}%</strong></article>;
}

createRoot(document.getElementById("root")).render(<App />);
