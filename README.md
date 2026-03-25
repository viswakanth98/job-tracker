# Job Tracker

A structured, full-featured job application tracker built with React + TypeScript. Manage your entire job search — applications, interview rounds, recruiter contacts, insights, and notes — all in one place, with data stored locally in your browser.

![React](https://img.shields.io/badge/React-18-blue?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![TailwindCSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss) ![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite) ![Zustand](https://img.shields.io/badge/Zustand-4-orange)

---

## Features

### Applications Tracker
- Track every job application with 15+ fields: company, role, status, priority, HR contact, salary range, location, next action, job description, and more
- **Inline status update** — click the status badge directly in the table row, no modal needed
- **Overdue follow-up alerts** — red highlight and banner when `Next Action Date` has passed
- Color-coded status badges across a 10-stage workflow
- Filter by status, search by company or role
- **Table view** and **Kanban board view** — toggle between them instantly
- Direct link to job postings

### Export & Import
- **Export to CSV** — download all your applications as a `.csv` file for backup or Excel/Sheets
- **Import from CSV** — bulk-load applications from a spreadsheet with automatic field mapping and validation

### Interview Log
- Log every interview round per application (phone screen, technical, panel, HR, final, etc.)
- Record interviewer, format, topics covered, self-rating (1–10), outcome, feedback received, and personal takeaways
- Track whether follow-up thank-you was sent
- Visual self-rating progress bar (green/yellow/red based on score)

### Notes Timeline
- Timestamped activity log per application — like a mini journal
- Add notes with `Cmd+Enter` (or the Save button)
- Notes are shown in reverse chronological order with relative timestamps
- Hover to reveal delete button — keeps the UI clean

### Job Description Storage
- Paste the full job description inside the application form
- Saved permanently — so you still have it after the posting goes offline
- Collapsible section on the interview detail page for easy reference during prep

### Contacts
- Directory of recruiters, hiring managers, and referrals
- Store email, LinkedIn URL, how you connected, and last contact date
- Card-based layout for quick scanning and search

### Dashboard
- Summary cards: Total Applied, Active Pipeline, Interviewing, Offers
- Pipeline breakdown with visual progress bars per status
- Upcoming interviews (pending outcome, sorted by date)
- Recent application activity

### Insights Page
- **Response Rate** — % of applications that got any response
- **Interview Rate** — % that reached an interview stage
- **Offer Rate** — % that resulted in an offer
- **Conversion Funnel** — visual bar from Applied → Accepted
- **Monthly Applications Chart** — bar chart of applications added per month (last 8 months)
- **Source Performance Table** — which source (LinkedIn, Referral, etc.) gives the best interview rate
- **Offer Comparison Table** — side-by-side of all active offers (salary, location, status, notes)

---

## Status Workflow

```
Bookmarked → Applied → Shortlisted → Phone Screen → Interviewing → Offer → Accepted
                  ↓            ↓             ↓                ↓              ↓
               Ghosted      Rejected      Rejected         Withdrawn      Declined
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

No backend, no database, no sign-up required. Everything runs in your browser.

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

The production build outputs to `dist/`.

---

## Project Structure

```
src/
├── types/                     # TypeScript interfaces (Application, InterviewRound, Contact, NoteEntry)
├── constants/                 # Status colors, workflow arrays, dropdown options
├── lib/
│   ├── storage.ts             # localStorage read/write wrapper
│   ├── utils.ts               # ID generation, date formatting
│   └── csv.ts                 # Export to CSV + import/parse from CSV
├── store/
│   ├── useApplicationStore.ts # Applications CRUD + localStorage sync
│   ├── useInterviewStore.ts   # Interview rounds CRUD
│   ├── useContactStore.ts     # Contacts CRUD
│   ├── useNotesStore.ts       # Notes timeline CRUD
│   └── useUIStore.ts          # Modal state, filters, kanban toggle
├── components/
│   ├── ui/                    # Modal, StatusBadge, PriorityBadge, ConfirmDialog
│   ├── layout/                # Sidebar, PageHeader
│   ├── applications/          # ApplicationForm, KanbanView
│   ├── interviews/            # InterviewForm
│   └── contacts/              # ContactForm
└── pages/
    ├── DashboardPage.tsx
    ├── ApplicationsPage.tsx
    ├── InterviewLogPage.tsx
    ├── StatsPage.tsx
    └── ContactsPage.tsx
```

---

## Data Storage

All data is stored in your browser's `localStorage` under four keys:

| Key | Contents |
|-----|---------|
| `jt_applications` | All job applications |
| `jt_interviews` | All interview rounds |
| `jt_contacts` | All contacts |
| `jt_notes` | All activity notes |

> **Backup tip:** Use the **Export CSV** button regularly to keep a backup. Clearing browser data or switching browsers will erase your tracker.

---

## Usage Tips

- **Weekly habit:** Every Monday — update statuses, set next action dates, archive dead applications
- **Next Action + Date** are your north star. If both are empty on an active application, it's stale
- **Inline status** — update status directly from the table without opening a modal
- **Overdue alert** — any row with a past `Next Action Date` gets a red indicator. Fix it or it'll nag you
- **Notes timeline** — use it like a call log: "March 10 — recruiter said team is deciding by Friday"
- **Job description** — paste the full JD when you apply. Postings go offline after you get the call
- **Kanban view** — switch to it for a visual pipeline check at the start of your week
- **Insights** — check Source Performance to double down on what's actually getting you interviews
- Applications are seeded with sample data on first load — delete them to start fresh

---

## License

MIT — free to use, modify, and distribute.
