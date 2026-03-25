# Job Tracker

A structured, minimal job application tracker built with React + TypeScript. Manage your entire job search — applications, interview rounds, and recruiter contacts — all in one place, with data stored locally in your browser.

![Dashboard](https://img.shields.io/badge/React-18-blue?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![TailwindCSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss) ![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)

---

## Features

### Applications Tracker
- Track every job application with 14+ fields: company, role, status, priority, HR contact, salary range, location, next action, and more
- Color-coded status badges across a 10-stage workflow
- Filter by status, search by company or role
- Direct link to job postings

### Interview Log
- Log every interview round per application (phone screen, technical, panel, HR, etc.)
- Record interviewer, format, topics covered, self-rating (1–10), outcome, feedback received, and personal takeaways
- Track whether follow-up thank-you was sent
- Visual self-rating progress bar

### Contacts
- Keep a directory of recruiters, hiring managers, and referrals
- Store email, LinkedIn, how you connected, and last contact date
- Card-based layout for quick scanning

### Dashboard
- Summary cards: Total Applied, Active Pipeline, Interviewing, Offers
- Pipeline breakdown with visual progress bars per status
- Upcoming interviews at a glance
- Recent application activity

---

## Status Workflow

```
Bookmarked → Applied → Shortlisted → Phone Screen → Interviewing → Offer → Accepted
                  ↓            ↓             ↓                ↓
               Ghosted      Rejected      Rejected         Declined / Withdrawn
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Routing | React Router DOM 6 |
| State Management | Zustand 4 |
| Icons | Lucide React |
| Persistence | Browser `localStorage` |

No backend, no database, no sign-up required. All data stays in your browser.

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/viswakanth98/job-tracker.git
cd job-tracker

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

The production build is output to `dist/`.

---

## Project Structure

```
src/
├── types/           # TypeScript interfaces (Application, InterviewRound, Contact)
├── constants/       # Status colors, workflow arrays, dropdown options
├── lib/
│   ├── storage.ts   # localStorage wrapper
│   └── utils.ts     # ID generation, date formatting, classnames
├── store/           # Zustand stores (applications, interviews, contacts, UI)
├── components/
│   ├── ui/          # Reusable: Modal, StatusBadge, PriorityBadge, ConfirmDialog
│   ├── layout/      # Sidebar, PageHeader
│   ├── applications/# ApplicationForm
│   ├── interviews/  # InterviewForm
│   └── contacts/    # ContactForm
└── pages/           # DashboardPage, ApplicationsPage, InterviewLogPage, ContactsPage
```

---

## Data Storage

All data is stored in your browser's `localStorage` under three keys:

| Key | Contents |
|-----|---------|
| `jt_applications` | All job applications |
| `jt_interviews` | All interview rounds |
| `jt_contacts` | All contacts |

**Note:** Clearing browser data will erase your tracker. For backup, export data via browser DevTools → Application → Local Storage.

---

## Usage Tips

- **Weekly habit:** Review every Monday — update statuses, set next action dates, archive dead applications
- **Next Action + Date** fields are your north star. If both are empty on an active application, it's stale
- Click the chat bubble icon on any application row to open its interview log
- The interview count badge shows how many rounds are logged per application
- Applications are seeded with sample data on first load — delete them to start fresh

---

## License

MIT — free to use, modify, and distribute.
