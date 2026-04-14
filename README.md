<div align="center">

# 💸 Pocket Survivor — Frontend

### *Smart College Expense Manager with AI-Powered Financial Coaching*

A playful, bubble-based React SPA that makes tracking expenses feel like a game — powered by Claude AI coaching, NLP-driven learning, and live insights.

### 🔗 [**Live Demo →**](https://pocket-survivor-app.vercel.app)

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-2.12-FF7300?style=for-the-badge&logo=chartdotjs&logoColor=white)
![Claude AI](https://img.shields.io/badge/Claude%20AI-Anthropic-D97757?style=for-the-badge&logo=anthropic&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

---

## ✨ Features

- 🫧 **Bubble Pop UI** — Tap animated bubbles to log expenses in under 2 seconds. No forms, no friction.
- 🤖 **AI Financial Coach** — Personality-based coaching (Savage · Balanced · Supportive) powered by Anthropic's Claude API.
- 🎯 **Smart Goal Tracker** — Set savings goals and get auto-calculated daily savings targets, visualized with Recharts.
- 🧠 **NLP Learning** — Bubbles reorder themselves based on your habits, time of day, and weekend-vs-weekday context.
- 🏆 **Gamification** — Streaks, badges, and discipline scores that reward consistent budgeting.
- 📊 **Live Insights** — Category breakdowns, spend heatmaps, and trend analysis with interactive charts.
- 🔐 **JWT Auth** — Secure, stateless sessions backed by a Spring Boot API.
- 📱 **Responsive** — Tailwind-powered UI that works beautifully on mobile and desktop.

---

## 📸 Screenshots

> _Screenshots coming soon — placeholders below._

| Dashboard | Bubble Entry | AI Coach |
| :-------: | :----------: | :------: |
| ![Dashboard](docs/screenshots/dashboard.png) | ![Bubble Entry](docs/screenshots/bubbles.png) | ![Coach](docs/screenshots/coach.png) |

| Goals & Streaks | Insights | Login |
| :-------------: | :------: | :---: |
| ![Goals](docs/screenshots/goals.png) | ![Insights](docs/screenshots/insights.png) | ![Login](docs/screenshots/login.png) |

---

## 🛠️ Tech Stack

| Layer             | Technology                                         |
| ----------------- | -------------------------------------------------- |
| **Framework**     | React 18 · Vite 5                                  |
| **Styling**       | Tailwind CSS 3.4 · PostCSS · Autoprefixer          |
| **Charts**        | Recharts 2.12                                      |
| **Icons**         | Lucide React                                       |
| **AI**            | Anthropic Claude API (via backend)                 |
| **Auth**          | JWT (stored in localStorage)                       |
| **Deployment**    | Vercel · Docker                                    |
| **Backend API**   | [Spring Boot 3.2 + PostgreSQL](https://github.com/ShubhCodes21/pocket-survivor-api) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A running backend API ([pocket-survivor-api](https://github.com/ShubhCodes21/pocket-survivor-api))

### 1. Clone & Install

```bash
git clone https://github.com/ShubhCodes21/pocket-survivor-app.git
cd pocket-survivor-app
npm install
```

### 2. Configure API Endpoint

Create a `.env` file in the project root:

```bash
VITE_API_URL=http://localhost:8080
```

### 3. Run Dev Server

```bash
npm run dev
```

Open **http://localhost:3000** and start tracking. 🎉

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
pocket-survivor-app/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable React components
│   ├── pages/           # Route-level screens
│   ├── api.js           # Backend API client (JWT auth)
│   ├── App.jsx          # Root component
│   └── main.jsx         # Vite entry point
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 🔗 Related Repositories

- **Backend API** → [pocket-survivor-api](https://github.com/ShubhCodes21/pocket-survivor-api) (Spring Boot · PostgreSQL · Claude)

---

## 📜 License

Released under the MIT License.

---

<div align="center">

### Built with ☕ and 🤖 by **Shubh Agarwal**

[![GitHub](https://img.shields.io/badge/GitHub-ShubhCodes21-181717?style=for-the-badge&logo=github)](https://github.com/ShubhCodes21)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/shubhagarwal21/)
[![Email](https://img.shields.io/badge/Email-Contact-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:shubhagarwalval21@gmail.com)

⭐ Star this repo if you find it useful!

</div>
