// ═══════════════════════════════════════════════════════════════════
// Pocket Survivor – Production Frontend (API-Connected)
// Connects to Spring Boot backend via api.js
// ═══════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from "react";
import * as api from "./api";
import {
  Target, ChevronRight, ChevronLeft, Plus, Star, Flame, Award,
  Coffee, Bus, UtensilsCrossed, ShoppingBag, Gamepad2, IceCream,
  BookOpen, Zap, Moon, Sun, Sunset, CloudSun, X, Check, Trash2,
  ArrowRight, Sparkles, PiggyBank, Receipt, BarChart3, Home, Settings, LogOut,
  Eye, EyeOff
} from "lucide-react";
import {
  PieChart, Pie, Cell, XAxis, YAxis, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from "recharts";

// ━━━ CONSTANTS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const C = {
  pri: "#FF6348", sec: "#1DD1A1", acc: "#FECA57", dark: "#222F3E",
  danger: "#FF6B6B", ok: "#00B894", purp: "#A29BFE", bg: "#FFF9F5",
  mut: "#8395A7", lite: "#FFF0EB",
};

const PERS = {
  spender:  { label: "Spender",  emoji: "🔥", color: "#FF6348", desc: "You love treating yourself. I'll keep you in check with savage honesty." },
  balanced: { label: "Balanced", emoji: "⚖️", color: "#A29BFE", desc: "You're practical. I'll give you straightforward, no-nonsense advice." },
  saver:    { label: "Saver",    emoji: "🐷", color: "#1DD1A1", desc: "You love saving up. I'll cheer you on and celebrate your wins." },
};

const TIMES = [
  { id: "morning",   label: "Morning",   icon: Sun,     color: "#FECA57", hrs: "6 AM – 12 PM" },
  { id: "afternoon", label: "Afternoon", icon: CloudSun, color: "#FF6348", hrs: "12 – 4 PM" },
  { id: "evening",   label: "Evening",   icon: Sunset,  color: "#A29BFE", hrs: "4 – 8 PM" },
  { id: "night",     label: "Night",     icon: Moon,    color: "#222F3E", hrs: "8 PM – 6 AM" },
];

const CAT_ICONS = {
  Breakfast: UtensilsCrossed, Coffee, Auto: Bus, Bus, Snacks: IceCream,
  Juice: Coffee, Stationery: BookOpen, Lunch: UtensilsCrossed,
  Canteen: UtensilsCrossed, Print: BookOpen, Brunch: UtensilsCrossed,
  Cafe: Coffee, Movie: Gamepad2, Shopping: ShoppingBag, Hangout: Star,
  Ride: Bus, Tea: Coffee, Gym: Zap, Groceries: ShoppingBag,
  Dinner: UtensilsCrossed, Dessert: IceCream, "Online Order": ShoppingBag,
  Medicine: Plus, Other: Receipt,
};

const BADGES_DEF = [
  { id: "first_log", name: "First Step", icon: "🎯" },
  { id: "streak_3",  name: "On Fire",    icon: "🔥" },
  { id: "streak_7",  name: "Unstoppable",icon: "⚡" },
  { id: "goal_set",  name: "Dreamer",    icon: "🌟" },
  { id: "goal_done", name: "Achiever",   icon: "🏆" },
  { id: "under_budget", name: "Budget Boss", icon: "👑" },
];

const DEFAULT_PRICES = [20, 40, 60, 80, 100, 150, 200];

const curSlot = () => {
  const h = new Date().getHours();
  return h >= 6 && h < 12 ? "morning" : h >= 12 && h < 16 ? "afternoon" : h >= 16 && h < 20 ? "evening" : "night";
};
const isWE = () => { const d = new Date().getDay(); return d === 0 || d === 6; };
const fmtDay = d => new Date(d).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

const is = { width: "100%", padding: "14px 16px", borderRadius: 12, border: "2px solid #E8E8E8", fontSize: 15, fontFamily: "Nunito", outline: "none", background: "white" };

// ━━━ CSS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const css = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Nunito:wght@400;500;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
.ps{font-family:'Nunito',sans-serif;background:${C.bg};min-height:100vh;color:${C.dark};max-width:430px;margin:0 auto;position:relative;overflow-x:hidden}
.hd{font-family:'Outfit',sans-serif;font-weight:700}
.dp{font-family:'Outfit',sans-serif;font-weight:800}
@keyframes bp{0%{transform:scale(0);opacity:0}60%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
@keyframes su{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes fi{from{opacity:0}to{opacity:1}}
@keyframes sh{0%{background-position:-200% 0}100%{background-position:200% 0}}
.be{animation:bp .4s cubic-bezier(.34,1.56,.64,1) forwards;opacity:0}
.su{animation:su .5s ease forwards}
.fi{animation:fi .4s ease forwards}
.bb{border:none;cursor:pointer;transition:all .15s ease;-webkit-tap-highlight-color:transparent;user-select:none}
.bb:active{transform:scale(.92)!important}
.gc{background:rgba(255,255,255,.85);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.5);border-radius:20px;box-shadow:0 4px 24px rgba(0,0,0,.06)}
.pb{height:8px;border-radius:4px;background:#F0F0F0;overflow:hidden}
.pf{height:100%;border-radius:4px;transition:width .8s cubic-bezier(.34,1.56,.64,1)}
.bn{position:fixed;bottom:0;left:50%;transform:translateX(-50%);max-width:430px;width:100%;background:rgba(255,255,255,.95);backdrop-filter:blur(20px);border-top:1px solid rgba(0,0,0,.05);padding:8px 0 max(8px,env(safe-area-inset-bottom));z-index:100}
.cb{background:linear-gradient(135deg,#FF6348,#FF8A65);color:#fff;border-radius:20px 20px 20px 4px;padding:16px 20px;font-size:15px;line-height:1.5;box-shadow:0 4px 20px rgba(255,99,72,.3)}
.sl{background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);background-size:200% 100%;animation:sh 1.5s infinite;border-radius:12px}
input[type=range]{-webkit-appearance:none;width:100%;height:6px;border-radius:3px;background:#E8E8E8;outline:none}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:28px;height:28px;border-radius:50%;background:${C.pri};cursor:pointer;box-shadow:0 2px 8px rgba(255,99,72,.4)}
.sp{padding-bottom:90px;min-height:100vh}
`;

// ━━━ AUTH SCREENS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("welcome"); // welcome, login, register, personality
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [budget, setBudget] = useState(10000);
  const [personality, setPersonality] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleLogin = async () => {
    setError(""); setLoading(true);
    try {
      const data = await api.login(email, password);
      onAuth(data.user);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!personality) return;
    setError(""); setLoading(true);
    try {
      const data = await api.register(email, password, name, personality, budget);
      onAuth(data.user);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  if (mode === "welcome") return (
    <div className="ps"><div className="su" style={{ textAlign: "center", padding: "60px 24px" }}>
      <div style={{ fontSize: 72, marginBottom: 16 }}>💸</div>
      <h1 className="dp" style={{ fontSize: 32, marginBottom: 12, color: C.pri }}>Pocket Survivor</h1>
      <p style={{ fontSize: 17, color: C.mut, lineHeight: 1.6, marginBottom: 48 }}>
        Your savage little spending coach that keeps your pocket money alive till month-end.
      </p>
      <button className="bb" onClick={() => setMode("register")} style={{ background: C.pri, color: "#fff", padding: "16px 48px", borderRadius: 50, fontSize: 17, fontWeight: 700, fontFamily: "Outfit", boxShadow: "0 4px 20px rgba(255,99,72,.4)", display: "block", width: "100%", marginBottom: 12 }}>
        Get Started <ArrowRight size={18} style={{ verticalAlign: "middle", marginLeft: 8 }} />
      </button>
      <button className="bb" onClick={() => setMode("login")} style={{ background: "none", color: C.pri, padding: "14px", fontSize: 15, fontWeight: 700 }}>
        Already have an account? Log in
      </button>
    </div></div>
  );

  if (mode === "login") return (
    <div className="ps"><div className="su" style={{ padding: "48px 24px" }}>
      <button className="bb" onClick={() => setMode("welcome")} style={{ background: "#F0F0F0", borderRadius: 50, padding: "8px 16px", fontSize: 14, fontWeight: 600, marginBottom: 24 }}>
        <ChevronLeft size={16} style={{ verticalAlign: "middle" }} /> Back
      </button>
      <h2 className="hd" style={{ fontSize: 26, marginBottom: 8 }}>Welcome back</h2>
      <p style={{ color: C.mut, marginBottom: 32 }}>Log in to continue surviving.</p>
      {error && <p style={{ color: C.danger, marginBottom: 12, fontSize: 14 }}>{error}</p>}
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" style={{ ...is, marginBottom: 12 }} />
      <div style={{ position: "relative", marginBottom: 20 }}>
        <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" style={{ ...is, paddingRight: 44 }} />
        <button className="bb" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", color: C.mut, padding: 4 }}>
          {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      <button className="bb" onClick={handleLogin} disabled={loading} style={{ background: email && password ? C.pri : "#DDD", color: "#fff", padding: 16, borderRadius: 16, fontSize: 17, fontWeight: 700, fontFamily: "Outfit", width: "100%", opacity: loading ? 0.7 : 1 }}>
        {loading ? "Logging in..." : "Log In"}
      </button>
    </div></div>
  );

  if (mode === "register") return (
    <div className="ps"><div className="su" style={{ padding: "48px 24px" }}>
      <button className="bb" onClick={() => setMode("welcome")} style={{ background: "#F0F0F0", borderRadius: 50, padding: "8px 16px", fontSize: 14, fontWeight: 600, marginBottom: 24 }}>
        <ChevronLeft size={16} style={{ verticalAlign: "middle" }} /> Back
      </button>
      <p style={{ fontSize: 14, color: C.mut, marginBottom: 8, fontWeight: 600 }}>STEP 1 OF 3</p>
      <h2 className="hd" style={{ fontSize: 26, marginBottom: 8 }}>Create your account</h2>
      {error && <p style={{ color: C.danger, marginBottom: 12, fontSize: 14 }}>{error}</p>}
      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={{ ...is, marginBottom: 12 }} />
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" style={{ ...is, marginBottom: 12 }} />
      <div style={{ position: "relative", marginBottom: 20 }}>
        <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Password (6+ characters)" style={{ ...is, paddingRight: 44 }} />
        <button className="bb" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", color: C.mut, padding: 4 }}>
          {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <p style={{ fontSize: 14, color: C.mut, marginBottom: 8, fontWeight: 600, marginTop: 16 }}>STEP 2: Monthly pocket money</p>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <span className="dp" style={{ fontSize: 36, color: C.pri }}>₹{budget.toLocaleString("en-IN")}</span>
        <p style={{ color: C.mut, fontSize: 13 }}>≈ ₹{Math.round(budget / 30).toLocaleString("en-IN")}/day</p>
      </div>
      <input type="range" min={5000} max={50000} step={500} value={budget} onChange={e => setBudget(+e.target.value)} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.mut, marginTop: 4, marginBottom: 20 }}><span>₹5,000</span><span>₹50,000</span></div>

      <button className="bb" onClick={() => { if (name && email && password.length >= 6) setMode("personality"); else setError("Fill all fields. Password must be 6+ chars."); }}
        style={{ background: name && email && password.length >= 6 ? C.pri : "#DDD", color: "#fff", padding: 16, borderRadius: 16, fontSize: 17, fontWeight: 700, fontFamily: "Outfit", width: "100%" }}>
        Next: Pick Your Vibe
      </button>
    </div></div>
  );

  // Personality selection
  return (
    <div className="ps"><div className="su" style={{ padding: "48px 24px" }}>
      <button className="bb" onClick={() => setMode("register")} style={{ background: "#F0F0F0", borderRadius: 50, padding: "8px 16px", fontSize: 14, fontWeight: 600, marginBottom: 24 }}>
        <ChevronLeft size={16} style={{ verticalAlign: "middle" }} /> Back
      </button>
      <p style={{ fontSize: 14, color: C.mut, marginBottom: 8, fontWeight: 600 }}>STEP 3 OF 3</p>
      <h2 className="hd" style={{ fontSize: 26, marginBottom: 8 }}>What's your vibe?</h2>
      <p style={{ color: C.mut, marginBottom: 24 }}>This decides how your coach talks to you.</p>
      {error && <p style={{ color: C.danger, marginBottom: 12, fontSize: 14 }}>{error}</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {Object.entries(PERS).map(([k, p], i) => (
          <button key={k} className="bb be gc" onClick={() => setPersonality(k)} style={{ padding: 20, textAlign: "left", animationDelay: `${i * .1}s`, border: personality === k ? `2px solid ${p.color}` : "2px solid transparent", background: personality === k ? `${p.color}10` : "rgba(255,255,255,.85)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <span style={{ fontSize: 28 }}>{p.emoji}</span>
              <span className="hd" style={{ fontSize: 20, color: p.color }}>{p.label}</span>
            </div>
            <p style={{ fontSize: 14, color: C.mut, lineHeight: 1.4 }}>{p.desc}</p>
          </button>
        ))}
      </div>
      <button className="bb" onClick={handleRegister} disabled={loading || !personality}
        style={{ background: personality ? C.pri : "#DDD", color: "#fff", padding: 16, borderRadius: 16, fontSize: 17, fontWeight: 700, fontFamily: "Outfit", width: "100%", marginTop: 24, opacity: loading ? 0.7 : 1 }}>
        {loading ? "Creating account..." : "Start Surviving 🚀"}
      </button>
    </div></div>
  );
}

// ━━━ BOTTOM NAV ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Nav({ active, go }) {
  const items = [
    { id: "dashboard", icon: Home, l: "Home" },
    { id: "history", icon: Receipt, l: "History" },
    { id: "entry", icon: Plus, l: "Add" },
    { id: "goals", icon: Target, l: "Goals" },
    { id: "insights", icon: BarChart3, l: "Stats" },
  ];
  return <div className="bn"><div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
    {items.map(it => {
      const isAdd = it.id === "entry", isA = active === it.id;
      return <button key={it.id} className="bb" onClick={() => go(it.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: isAdd ? C.pri : "none", color: isAdd ? "#fff" : isA ? C.pri : C.mut, borderRadius: isAdd ? 50 : 0, padding: isAdd ? "12px 20px" : "8px 12px", marginTop: isAdd ? -24 : 0, boxShadow: isAdd ? "0 4px 20px rgba(255,99,72,.4)" : "none", transform: isAdd ? "scale(1.1)" : "none" }}>
        <it.icon size={isAdd ? 24 : 22} />
        {!isAdd && <span style={{ fontSize: 11, fontWeight: isA ? 700 : 500 }}>{it.l}</span>}
      </button>;
    })}
  </div></div>;
}

// ━━━ DASHBOARD ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Dash({ user, go }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try { setData(await api.getDashboard()); } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const refreshCoach = async () => {
    try {
      const msg = await api.refreshCoach();
      setData(d => d ? { ...d, coachMessage: msg } : d);
    } catch {}
  };

  if (loading || !data) return <div className="sp" style={{ padding: "24px 16px" }}>
    <div className="sl" style={{ height: 60, marginBottom: 16 }} />
    <div className="sl" style={{ height: 80, marginBottom: 16 }} />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {[1, 2, 3, 4].map(i => <div key={i} className="sl" style={{ height: 80 }} />)}
    </div>
  </div>;

  const d = data;
  const sc = d.spendStatus === "over" ? C.danger : d.spendStatus === "under" ? C.ok : C.acc;

  return <div className="sp" style={{ padding: "24px 16px" }}>
    <div className="su" style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <p style={{ color: C.mut, fontSize: 14 }}>Hey,</p>
        <h1 className="dp" style={{ fontSize: 28 }}>{user.name} {PERS[user.personality]?.emoji}</h1>
      </div>
      <button className="bb" onClick={() => go("settings")} style={{ background: "#F0F0F0", borderRadius: 12, padding: 10, color: C.mut }}><Settings size={20} /></button>
    </div>

    <div className="su" style={{ marginBottom: 20, animationDelay: ".1s" }}>
      <div className="cb">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <p style={{ flex: 1 }}>{d.coachMessage || "Loading tip..."}</p>
          <button className="bb" onClick={refreshCoach} style={{ background: "rgba(255,255,255,.2)", borderRadius: 50, padding: 6, marginLeft: 8, color: "#fff", flexShrink: 0 }}><Sparkles size={16} /></button>
        </div>
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
      {[
        { l: "Today", v: `₹${d.todaySpent}`, s: `of ₹${d.dailyBudget}`, c: sc },
        { l: "This Week", v: `₹${d.weekSpent}`, s: `${d.todayExpenses?.length || 0} today`, c: C.purp },
        { l: "Remaining", v: `₹${d.remaining}`, s: `${d.daysLeft} days left`, c: C.sec },
        { l: "Monthly", v: `₹${d.monthSpent}`, s: `of ₹${d.monthlyBudget}`, c: C.pri },
      ].map(s => <div key={s.l} className="gc su" style={{ padding: 16 }}>
        <p style={{ fontSize: 12, color: C.mut, marginBottom: 4, fontWeight: 600 }}>{s.l}</p>
        <p className="hd" style={{ fontSize: 22, color: s.c }}>{s.v}</p>
        <p style={{ fontSize: 12, color: C.mut }}>{s.s}</p>
      </div>)}
    </div>

    <div className="gc su" style={{ padding: 20, marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontWeight: 700, fontSize: 15 }}>Today's Budget</span>
        <span style={{ color: sc, fontWeight: 700 }}>{d.spendStatus === "over" ? "Over!" : d.spendStatus === "under" ? "Great!" : "On Track"}</span>
      </div>
      <div className="pb"><div className="pf" style={{ width: `${Math.min(100, (d.todaySpent / Math.max(1, d.dailyBudget)) * 100)}%`, background: `linear-gradient(90deg,${C.sec},${sc})` }} /></div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 13, color: C.mut }}>
        <span>₹{d.todaySpent} spent</span><span>₹{d.dailyBudget} limit</span>
      </div>
    </div>

    {d.activeGoals?.filter(g => !g.isCompleted).length > 0 && <div className="su" style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 className="hd" style={{ fontSize: 18 }}>Goals</h3>
        <button className="bb" onClick={() => go("goals")} style={{ background: "none", color: C.pri, fontSize: 13, fontWeight: 700 }}>View All <ChevronRight size={14} style={{ verticalAlign: "middle" }} /></button>
      </div>
      {d.activeGoals.filter(g => !g.isCompleted).slice(0, 2).map(g => {
        const pct = Math.min(100, Math.round(g.savedAmount / g.targetAmount * 100));
        return <div key={g.id} className="gc" style={{ padding: 16, marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontWeight: 700 }}>{g.name}</span>
            <span style={{ color: C.pri, fontWeight: 700 }}>{pct}%</span>
          </div>
          <div className="pb"><div className="pf" style={{ width: `${pct}%`, background: `linear-gradient(90deg,${C.acc},${C.pri})` }} /></div>
          <p style={{ fontSize: 12, color: C.mut, marginTop: 6 }}>₹{g.savedAmount} / ₹{g.targetAmount}</p>
        </div>;
      })}
    </div>}

    {d.todayExpenses?.length > 0 && <div className="su">
      <h3 className="hd" style={{ fontSize: 18, marginBottom: 12 }}>Today</h3>
      {d.todayExpenses.map(e => {
        const Ic = CAT_ICONS[e.category] || Receipt;
        return <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #F0F0F0" }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: C.lite, display: "flex", alignItems: "center", justifyContent: "center" }}><Ic size={18} color={C.pri} /></div>
          <div style={{ flex: 1 }}><p style={{ fontWeight: 600, fontSize: 15 }}>{e.category}</p><p style={{ fontSize: 12, color: C.mut }}>{e.timeOfDay}{e.note ? ` • ${e.note}` : ""}</p></div>
          <span className="hd" style={{ fontSize: 17 }}>₹{e.amount}</span>
        </div>;
      })}
    </div>}
  </div>;
}

// ━━━ BUBBLE ENTRY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Entry({ onDone }) {
  const [step, setStep] = useState(0);
  const [time, setTime] = useState(null);
  const [cat, setCat] = useState(null);
  const [amt, setAmt] = useState(null);
  const [cAmt, setCAmt] = useState("");
  const [note, setNote] = useState("");
  const [showC, setShowC] = useState(false);
  const [done, setDone] = useState(false);
  const [cats, setCats] = useState([]);
  const [prices, setPrices] = useState(DEFAULT_PRICES);
  const at = curSlot();

  // Fetch smart suggestions from backend NLP
  const loadSuggestions = async (timeOfDay) => {
    try {
      const data = await api.getSuggestions(timeOfDay);
      if (data.categories?.length) setCats(data.categories);
      // Store prices map for later
      setPrices(DEFAULT_PRICES);
      window.__psPriceMap = data.prices || {};
    } catch {
      setCats(["Breakfast", "Coffee", "Lunch", "Snacks", "Auto", "Dinner", "Other"]);
    }
  };

  const confirm = async () => {
    const f = showC ? +cAmt : amt;
    if (!f || f <= 0) return;
    try {
      await api.addExpense({
        category: cat || "Other",
        amount: f,
        timeOfDay: time || at,
        note: note.trim() || null,
      });
      setDone(true);
      setTimeout(() => onDone(), 1500);
    } catch (e) { console.error(e); }
  };

  if (done) return <div className="sp" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, minHeight: "80vh" }}>
    <div style={{ fontSize: 72, animation: "bp .5s ease" }}>✅</div>
    <h2 className="hd su" style={{ fontSize: 24, marginTop: 16 }}>Logged!</h2>
    <p className="su" style={{ color: C.mut, animationDelay: ".1s" }}>₹{showC ? cAmt : amt} for {cat}</p>
  </div>;

  return <div className="sp" style={{ padding: "24px 16px" }}>
    <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      {step > 0 ? <button className="bb" onClick={() => setStep(step - 1)} style={{ background: "#F0F0F0", borderRadius: 50, padding: "8px 16px", fontSize: 14, fontWeight: 600, color: C.dark }}><ChevronLeft size={16} style={{ verticalAlign: "middle" }} /> Back</button> : <div />}
    </div>

    <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
      {[0, 1, 2, 3].map(s => <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: s <= step ? C.pri : "#E8E8E8", transition: "background .3s" }} />)}
    </div>

    {step === 0 && <div>
      <h2 className="hd" style={{ fontSize: 22, marginBottom: 4 }}>When did you spend?</h2>
      <p style={{ color: C.mut, fontSize: 14, marginBottom: 24 }}>{isWE() ? "🎉 Weekend mode" : "📚 Weekday mode"}</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {TIMES.map((sl, i) => {
          const isNow = sl.id === at;
          return <button key={sl.id} className="bb be gc" onClick={() => { setTime(sl.id); loadSuggestions(sl.id); setStep(1); }} style={{ padding: 20, textAlign: "center", animationDelay: `${i * .08}s`, border: isNow ? `2px solid ${sl.color}` : "2px solid transparent", position: "relative" }}>
            {isNow && <span style={{ position: "absolute", top: 8, right: 8, fontSize: 10, fontWeight: 700, background: sl.color, color: "#fff", padding: "2px 8px", borderRadius: 50 }}>NOW</span>}
            <sl.icon size={32} color={sl.color} />
            <p className="hd" style={{ marginTop: 8, fontSize: 16 }}>{sl.label}</p>
            <p style={{ fontSize: 12, color: C.mut }}>{sl.hrs}</p>
          </button>;
        })}
      </div>
    </div>}

    {step === 1 && <div>
      <h2 className="hd" style={{ fontSize: 22, marginBottom: 4 }}>What did you spend on?</h2>
      <p style={{ color: C.mut, fontSize: 14, marginBottom: 24 }}>{TIMES.find(t => t.id === time)?.label} picks</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
        {cats.map((c, i) => {
          const Ic = CAT_ICONS[c] || Receipt;
          return <button key={c} className="bb be" onClick={() => {
            setCat(c);
            const pm = window.__psPriceMap || {};
            if (pm[c]?.length) setPrices(pm[c]);
            else setPrices(DEFAULT_PRICES);
            setStep(2);
          }} style={{ background: "#fff", borderRadius: 20, padding: "14px 18px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 2px 12px rgba(0,0,0,.06)", animationDelay: `${i * .05}s` }}>
            <Ic size={18} color={C.pri} /><span style={{ fontWeight: 600, fontSize: 15 }}>{c}</span>
          </button>;
        })}
        <button className="bb be" onClick={() => { setCat("Other"); setStep(2); }} style={{ background: "#F0F0F0", borderRadius: 20, padding: "14px 18px", display: "flex", alignItems: "center", gap: 8 }}>
          <Plus size={18} color={C.mut} /><span style={{ fontWeight: 600, fontSize: 15, color: C.mut }}>Other</span>
        </button>
      </div>
    </div>}

    {step === 2 && <div>
      <h2 className="hd" style={{ fontSize: 22, marginBottom: 4 }}>How much?</h2>
      <p style={{ color: C.mut, fontSize: 14, marginBottom: 24 }}>{cat}</p>
      {!showC ? <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
        {prices.map((p, i) => (
          <button key={`${p}-${i}`} className="bb be" onClick={() => { setAmt(p); setStep(3); }}
            style={{ width: 80, height: 80, borderRadius: "50%", background: i === 0 && prices[0] !== DEFAULT_PRICES[0] ? `linear-gradient(135deg,${C.pri},${C.acc})` : "#fff", color: i === 0 && prices[0] !== DEFAULT_PRICES[0] ? "#fff" : C.dark, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 12px rgba(0,0,0,.06)", animationDelay: `${i * .05}s`, fontWeight: 700, fontSize: 17, fontFamily: "Outfit" }}>
            ₹{p}{i === 0 && prices[0] !== DEFAULT_PRICES[0] && <span style={{ fontSize: 9, opacity: .8 }}>usual</span>}
          </button>
        ))}
        <button className="bb be" onClick={() => setShowC(true)} style={{ width: 80, height: 80, borderRadius: "50%", background: "#F0F0F0", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 14, color: C.mut }}>Custom</button>
      </div> :
      <div className="fi" style={{ textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16 }}>
          <span className="dp" style={{ fontSize: 36, color: C.pri }}>₹</span>
          <input type="number" value={cAmt} onChange={e => setCAmt(e.target.value)} placeholder="0" autoFocus style={{ fontSize: 48, fontFamily: "Outfit", fontWeight: 800, width: 160, border: "none", outline: "none", textAlign: "center", background: "transparent", color: C.dark }} />
        </div>
        <button className="bb" onClick={() => { if (cAmt) { setAmt(+cAmt); setStep(3); } }} style={{ background: cAmt ? C.pri : "#DDD", color: "#fff", padding: "14px 48px", borderRadius: 50, fontSize: 16, fontWeight: 700, fontFamily: "Outfit" }}>Done</button>
        <button className="bb" onClick={() => setShowC(false)} style={{ display: "block", margin: "12px auto", background: "none", color: C.mut, fontSize: 14 }}>Back to quick picks</button>
      </div>}
    </div>}

    {step === 3 && <div className="fi" style={{ textAlign: "center" }}>
      <h2 className="hd" style={{ fontSize: 22, marginBottom: 24 }}>Confirm</h2>
      <div className="gc" style={{ padding: 24, marginBottom: 20, display: "inline-block" }}>
        <p style={{ fontSize: 14, color: C.mut, marginBottom: 4 }}>{cat}</p>
        <p className="dp" style={{ fontSize: 48, color: C.pri }}>₹{amt}</p>
        <p style={{ fontSize: 14, color: C.mut }}>{TIMES.find(t => t.id === time)?.label}</p>
      </div>
      <input type="text" value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note (optional)" style={{ ...is, marginBottom: 16 }} />
      <button className="bb" onClick={confirm} style={{ background: C.pri, color: "#fff", padding: 16, borderRadius: 16, fontSize: 18, fontWeight: 700, fontFamily: "Outfit", width: "100%", boxShadow: "0 4px 20px rgba(255,99,72,.4)" }}>
        Log Expense ✓
      </button>
    </div>}
  </div>;
}

// ━━━ GOALS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Goals() {
  const [goals, setGoals] = useState([]);
  const [show, setShow] = useState(false);
  const [gn, setGn] = useState(""); const [gt, setGt] = useState(""); const [gd, setGd] = useState("");
  const [addTo, setAddTo] = useState(null); const [addA, setAddA] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => { try { setGoals(await api.getGoals()); } catch {} setLoading(false); };
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!gn.trim() || !gt) return;
    try { await api.createGoal({ name: gn.trim(), targetAmount: +gt, deadline: gd || null }); setGn(""); setGt(""); setGd(""); setShow(false); load(); } catch {}
  };

  const handleSave = async (id) => {
    const a = +addA; if (!a || a <= 0) return;
    try { await api.contributeToGoal(id, a); setAddTo(null); setAddA(""); load(); } catch {}
  };

  const handleDel = async (id) => { try { await api.deleteGoal(id); load(); } catch {} };

  if (loading) return <div className="sp" style={{ padding: "24px 16px" }}><div className="sl" style={{ height: 200 }} /></div>;

  return <div className="sp" style={{ padding: "24px 16px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
      <h1 className="dp" style={{ fontSize: 26 }}>Goals 🎯</h1>
      <button className="bb" onClick={() => setShow(!show)} style={{ background: C.pri, color: "#fff", borderRadius: 50, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {show ? <X size={20} /> : <Plus size={20} />}
      </button>
    </div>

    {show && <div className="gc su" style={{ padding: 20, marginBottom: 20 }}>
      <h3 className="hd" style={{ fontSize: 17, marginBottom: 12 }}>New Goal</h3>
      <input type="text" value={gn} onChange={e => setGn(e.target.value)} placeholder="Goal name" style={is} />
      <input type="number" value={gt} onChange={e => setGt(e.target.value)} placeholder="Target amount (₹)" style={{ ...is, marginTop: 8 }} />
      <input type="date" value={gd} onChange={e => setGd(e.target.value)} style={{ ...is, marginTop: 8 }} />
      <button className="bb" onClick={handleAdd} style={{ background: gn && gt ? C.pri : "#DDD", color: "#fff", padding: 12, borderRadius: 12, width: "100%", marginTop: 12, fontWeight: 700, fontFamily: "Outfit" }}>Create Goal</button>
    </div>}

    {goals.length === 0 && !show && <div style={{ textAlign: "center", padding: "60px 24px" }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>🎯</div>
      <h3 className="hd" style={{ fontSize: 20, marginBottom: 8 }}>No goals yet</h3>
      <p style={{ color: C.mut }}>Set a savings goal and start tracking it!</p>
    </div>}

    {goals.map(g => {
      const pct = Math.min(100, Math.round(g.savedAmount / g.targetAmount * 100));
      const done = g.isCompleted || g.savedAmount >= g.targetAmount;
      return <div key={g.id} className="gc su" style={{ padding: 20, marginBottom: 12, border: done ? `2px solid ${C.ok}` : undefined }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div><h3 className="hd" style={{ fontSize: 18 }}>{done ? "🏆 " : ""}{g.name}</h3>
            {g.daysToDeadline != null && !done && <p style={{ fontSize: 12, color: g.daysToDeadline < 7 ? C.danger : C.mut }}>{g.daysToDeadline} days left</p>}
          </div>
          <button className="bb" onClick={() => handleDel(g.id)} style={{ background: "none", color: C.mut, padding: 4 }}><Trash2 size={16} /></button>
        </div>
        <div style={{ margin: "12px 0" }}>
          <div className="pb" style={{ height: 10 }}><div className="pf" style={{ width: `${pct}%`, height: 10, background: done ? C.ok : `linear-gradient(90deg,${C.acc},${C.pri})` }} /></div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 13 }}>
            <span style={{ color: C.mut }}>₹{g.savedAmount} saved</span><span style={{ fontWeight: 700, color: C.pri }}>₹{g.targetAmount}</span>
          </div>
        </div>
        {!done && g.dailySaveNeeded && <p style={{ fontSize: 13, color: C.pri, marginBottom: 8 }}>💡 Save ₹{g.dailySaveNeeded}/day to hit this</p>}
        {!done && (addTo === g.id ?
          <div className="fi" style={{ display: "flex", gap: 8 }}>
            <input type="number" value={addA} onChange={e => setAddA(e.target.value)} placeholder="₹ amount" autoFocus style={{ ...is, flex: 1, marginTop: 0 }} />
            <button className="bb" onClick={() => handleSave(g.id)} style={{ background: C.ok, color: "#fff", borderRadius: 12, padding: "0 16px", fontWeight: 700 }}><Check size={18} /></button>
            <button className="bb" onClick={() => setAddTo(null)} style={{ background: "#F0F0F0", borderRadius: 12, padding: "0 12px" }}><X size={18} /></button>
          </div> :
          <button className="bb" onClick={() => setAddTo(g.id)} style={{ background: C.lite, color: C.pri, borderRadius: 12, padding: "10px 16px", width: "100%", fontWeight: 700, fontSize: 14, marginTop: 4 }}>
            <PiggyBank size={16} style={{ verticalAlign: "middle", marginRight: 6 }} />Add Savings
          </button>
        )}
        {done && <p style={{ textAlign: "center", fontWeight: 700, color: C.ok, fontSize: 15 }}>Goal Achieved! 🎉</p>}
      </div>;
    })}
  </div>;
}

// ━━━ INSIGHTS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Stats() {
  const [data, setData] = useState(null);
  useEffect(() => { api.getInsights().then(setData).catch(console.error); }, []);
  const pc = [C.pri, C.sec, C.acc, C.purp, C.danger, "#636E72"];

  if (!data) return <div className="sp" style={{ padding: "24px 16px" }}><div className="sl" style={{ height: 300 }} /></div>;

  const pie = data.categoryBreakdown?.slice(0, 6).map(c => ({ name: c.category, value: c.totalSpent })) || [];
  const daily = data.dailyTotals?.map(d => ({ day: new Date(d.date).toLocaleDateString("en-IN", { weekday: "short" }), amount: d.amount })) || [];

  return <div className="sp" style={{ padding: "24px 16px" }}>
    <h1 className="dp" style={{ fontSize: 26, marginBottom: 24 }}>Insights 📊</h1>
    <div className="gc su" style={{ padding: 20, marginBottom: 16 }}>
      <div style={{ display: "flex", gap: 24, justifyContent: "center" }}>
        {[{ ic: Flame, v: data.streak?.currentStreak || 0, l: "Streak", c: C.pri }, { ic: Award, v: data.badges?.length || 0, l: "Badges", c: C.acc }, { ic: Star, v: data.streak?.bestStreak || 0, l: "Best", c: C.sec }].map(s =>
          <div key={s.l} style={{ textAlign: "center" }}><s.ic size={28} color={s.c} /><p className="hd" style={{ fontSize: 28 }}>{s.v}</p><p style={{ fontSize: 12, color: C.mut }}>{s.l}</p></div>
        )}
      </div>
    </div>
    {data.badges?.length > 0 && <div className="su" style={{ marginBottom: 16 }}>
      <h3 className="hd" style={{ fontSize: 17, marginBottom: 10 }}>Badges</h3>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {data.badges.map(b => { const bd = BADGES_DEF.find(x => x.id === b); return bd ? <div key={b} style={{ background: "#fff", borderRadius: 12, padding: "8px 14px", boxShadow: "0 2px 8px rgba(0,0,0,.05)", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 20 }}>{bd.icon}</span><span style={{ fontSize: 13, fontWeight: 600 }}>{bd.name}</span>
        </div> : null; })}
      </div>
    </div>}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
      <div className="gc" style={{ padding: 16 }}><p style={{ fontSize: 12, color: C.mut }}>Avg Daily</p><p className="hd" style={{ fontSize: 22, color: C.pri }}>₹{data.avgDaily}</p></div>
      <div className="gc" style={{ padding: 16 }}><p style={{ fontSize: 12, color: C.mut }}>Top Category</p><p className="hd" style={{ fontSize: 18, color: C.pri }}>{data.topCategory || "—"}</p></div>
    </div>
    {daily.length > 0 && <div className="gc" style={{ padding: 20, marginBottom: 16 }}>
      <h3 className="hd" style={{ fontSize: 17, marginBottom: 16 }}>Last 7 Days</h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={daily}><XAxis dataKey="day" tick={{ fontSize: 12, fill: C.mut }} axisLine={false} tickLine={false} /><YAxis hide />
          <Tooltip formatter={v => [`₹${v}`, "Spent"]} contentStyle={{ borderRadius: 12, border: "none" }} />
          <Bar dataKey="amount" radius={[8, 8, 0, 0]} fill={C.pri} /></BarChart>
      </ResponsiveContainer>
    </div>}
    {pie.length > 0 && <div className="gc" style={{ padding: 20 }}>
      <h3 className="hd" style={{ fontSize: 17, marginBottom: 16 }}>By Category</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart><Pie data={pie} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
          {pie.map((_, i) => <Cell key={i} fill={pc[i % pc.length]} />)}
        </Pie><Tooltip formatter={v => [`₹${v}`]} /></PieChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 8 }}>
        {pie.map((d, i) => <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}><div style={{ width: 10, height: 10, borderRadius: 3, background: pc[i] }} /><span>{d.name}</span></div>)}
      </div>
    </div>}
  </div>;
}

// ━━━ HISTORY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Hist() {
  const [exps, setExps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
    const to = now.toISOString().split("T")[0];
    api.getExpenses(from, to).then(setExps).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleDel = async (id) => { await api.deleteExpense(id); setExps(exps.filter(e => e.id !== id)); };

  const gr = {}; exps.forEach(e => { if (!gr[e.expenseDate]) gr[e.expenseDate] = []; gr[e.expenseDate].push(e); });
  const total = arr => arr.reduce((a, e) => a + e.amount, 0);

  if (loading) return <div className="sp" style={{ padding: "24px 16px" }}><div className="sl" style={{ height: 200 }} /></div>;

  return <div className="sp" style={{ padding: "24px 16px" }}>
    <h1 className="dp" style={{ fontSize: 26, marginBottom: 24 }}>History 📋</h1>
    {!Object.keys(gr).length ? <div style={{ textAlign: "center", padding: "60px 24px" }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>📭</div><h3 className="hd">No expenses yet</h3>
    </div> : Object.entries(gr).sort(([a], [b]) => b.localeCompare(a)).map(([d, es]) =>
      <div key={d} className="su" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>{fmtDay(d)}</span>
          <span style={{ color: C.pri, fontWeight: 700 }}>₹{total(es)}</span>
        </div>
        {es.map(e => { const Ic = CAT_ICONS[e.category] || Receipt;
          return <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #F5F5F5" }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: C.lite, display: "flex", alignItems: "center", justifyContent: "center" }}><Ic size={16} color={C.pri} /></div>
            <div style={{ flex: 1 }}><p style={{ fontWeight: 600, fontSize: 14 }}>{e.category}</p><p style={{ fontSize: 12, color: C.mut }}>{e.timeOfDay}{e.note ? ` • ${e.note}` : ""}</p></div>
            <span className="hd" style={{ fontSize: 16 }}>₹{e.amount}</span>
            <button className="bb" onClick={() => handleDel(e.id)} style={{ background: "none", padding: 4, color: C.mut }}><Trash2 size={14} /></button>
          </div>;
        })}
      </div>
    )}
  </div>;
}

// ━━━ SETTINGS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Sett({ user, onUpdate, onLogout }) {
  const [name, setName] = useState(user.name);
  const [bud, setBud] = useState(user.monthlyBudget);
  const [pers, setPers] = useState(user.personality);

  const save = async () => {
    try {
      const updated = await api.updateProfile({ name: name.trim() || user.name, monthlyBudget: bud, personality: pers });
      onUpdate(updated);
    } catch {}
  };

  return <div className="sp" style={{ padding: "24px 16px" }}>
    <h1 className="dp" style={{ fontSize: 26, marginBottom: 24 }}>Settings ⚙️</h1>
    <div className="gc" style={{ padding: 20, marginBottom: 16 }}>
      <h3 className="hd" style={{ fontSize: 17, marginBottom: 16 }}>Profile</h3>
      <label style={{ fontSize: 13, color: C.mut, fontWeight: 600, display: "block", marginBottom: 4 }}>Name</label>
      <input type="text" value={name} onChange={e => setName(e.target.value)} style={{ ...is, marginBottom: 12 }} />
      <label style={{ fontSize: 13, color: C.mut, fontWeight: 600, display: "block", marginBottom: 4 }}>Monthly Budget: ₹{bud.toLocaleString("en-IN")}</label>
      <input type="range" min={5000} max={50000} step={500} value={bud} onChange={e => setBud(+e.target.value)} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.mut, marginTop: 4, marginBottom: 16 }}><span>₹5,000</span><span>₹50,000</span></div>
      <label style={{ fontSize: 13, color: C.mut, fontWeight: 600, display: "block", marginBottom: 8 }}>Personality</label>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {Object.entries(PERS).map(([k, p]) => <button key={k} className="bb" onClick={() => setPers(k)} style={{ flex: 1, padding: "12px 8px", borderRadius: 12, fontSize: 14, fontWeight: 700, border: pers === k ? `2px solid ${p.color}` : "2px solid #E8E8E8", background: pers === k ? `${p.color}15` : "#fff", color: pers === k ? p.color : C.mut }}>{p.emoji} {p.label}</button>)}
      </div>
      <button className="bb" onClick={save} style={{ background: C.pri, color: "#fff", padding: 14, borderRadius: 12, width: "100%", fontWeight: 700, fontFamily: "Outfit", fontSize: 15 }}>Save Changes</button>
    </div>
    <button className="bb" onClick={onLogout} style={{ background: `${C.danger}15`, color: C.danger, padding: 14, borderRadius: 12, width: "100%", fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
      <LogOut size={18} /> Log Out
    </button>
  </div>;
}

// ━━━ MAIN APP ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function App() {
  const [user, setUser] = useState(api.getCachedUser());
  const [page, setPage] = useState("dashboard");
  const loggedIn = api.isLoggedIn() && user;

  if (!loggedIn) return <>
    <style>{css}</style>
    <AuthScreen onAuth={u => setUser(u)} />
  </>;

  return <>
    <style>{css}</style>
    <div className="ps">
      {page === "dashboard" && <Dash user={user} go={setPage} />}
      {page === "entry" && <Entry onDone={() => setPage("dashboard")} />}
      {page === "goals" && <Goals />}
      {page === "insights" && <Stats />}
      {page === "history" && <Hist />}
      {page === "settings" && <Sett user={user} onUpdate={u => setUser(u)} onLogout={() => { api.logout(); setUser(null); }} />}
      <Nav active={page} go={setPage} />
    </div>
  </>;
}
