# CLAUDE.md — Job Tracker

This file gives Claude Code full context about the project so it can assist accurately without needing repeated explanation.

---

## Project Overview

A browser-based job application tracker built with React + TypeScript + Vite. No backend, no database — all data is persisted in `localStorage`. The app helps job seekers track applications, interview rounds, recruiter contacts, notes, and job search analytics.

---

## Commands

```bash
npm run dev        # Start dev server at http://localhost:5173
npm run build      # TypeScript check + Vite production build (output: dist/)
npm run preview    # Serve the production build locally
```

Always run `npm run build` after any code changes to verify zero TypeScript errors before committing.

---

## Architecture

### Tech Stack
- **React 18** + **TypeScript 5** — UI and type safety
- **Vite 5** — build tool and dev server
- **Tailwind CSS 3** — utility-first styling (no CSS modules, no styled-components)
- **React Router DOM 6** — client-side routing (SPA, `BrowserRouter`)
- **Zustand 4** — state management (one store per entity + one UI store)
- **Lucide React** — icons (tree-shakeable, always import by name)

### State Management Pattern
Every entity has its own Zustand store. Stores own their data AND sync to localStorage on every mutation.

```
useApplicationStore  →  jt_applications  (localStorage)
useInterviewStore    →  jt_interviews
useContactStore      →  jt_contacts
useNotesStore        →  jt_notes
useUIStore           →  (ephemeral, not persisted)
```

**No cross-store imports inside stores.** Cascade deletes (e.g., delete interviews when an application is deleted) are handled in the page component, not inside the store. See `ApplicationsPage.tsx → handleDelete`.

### localStorage Keys
| Key | Type | Description |
|-----|------|-------------|
| `jt_applications` | `Application[]` | All job applications |
| `jt_interviews` | `InterviewRound[]` | All interview rounds |
| `jt_contacts` | `Contact[]` | All contacts |
| `jt_notes` | `NoteEntry[]` | Timestamped notes per application |

---

## File Structure

```
src/
├── types/index.ts              # ALL TypeScript interfaces — single source of truth
├── constants/index.ts          # STATUS_WORKFLOW, STATUS_COLORS, PRIORITY_COLORS, dropdown options
├── lib/
│   ├── storage.ts              # localStorage get/set/remove with try/catch
│   ├── utils.ts                # generateId (crypto.randomUUID), formatDate, cn
│   └── csv.ts                  # exportApplicationsToCSV, parseApplicationsFromCSV
├── store/
│   ├── useApplicationStore.ts
│   ├── useInterviewStore.ts
│   ├── useContactStore.ts
│   ├── useNotesStore.ts
│   └── useUIStore.ts
├── components/
│   ├── ui/                     # Modal, StatusBadge, PriorityBadge, ConfirmDialog
│   ├── layout/                 # Sidebar, PageHeader
│   ├── applications/           # ApplicationForm, KanbanView
│   ├── interviews/             # InterviewForm
│   └── contacts/               # ContactForm
└── pages/
    ├── DashboardPage.tsx
    ├── ApplicationsPage.tsx
    ├── InterviewLogPage.tsx    # Route: /applications/:applicationId/interviews
    ├── StatsPage.tsx
    └── ContactsPage.tsx
```

---

## Routes

| Path | Page | Notes |
|------|------|-------|
| `/` | → redirect to `/dashboard` | |
| `/dashboard` | DashboardPage | Summary cards, pipeline, upcoming interviews |
| `/applications` | ApplicationsPage | Main tracker — table + kanban view |
| `/applications/:applicationId/interviews` | InterviewLogPage | Per-application interview rounds + notes |
| `/stats` | StatsPage | Insights, funnel, source performance, offer comparison |
| `/contacts` | ContactsPage | Recruiter/contact directory |

---

## Key Types (`src/types/index.ts`)

```ts
Application       // 15+ fields including jobDescription, nextActionDate, status, priority
InterviewRound    // Linked to Application via applicationId
Contact           // Recruiter/hiring manager directory
NoteEntry         // { id, applicationId, text, createdAt } — notes timeline
ApplicationStatus // 'Bookmarked' | 'Applied' | 'Shortlisted' | 'Phone Screen' |
                  // 'Interviewing' | 'Offer' | 'Accepted' | 'Rejected' | 'Ghosted' | 'Withdrawn'
Priority          // 'Low' | 'Medium' | 'High'
```

When adding a new field to any type, also update:
1. The store's seed data (SEED array)
2. The form component's `emptyForm` default values
3. The form's submit handler to explicitly read the field from FormData

---

## Coding Conventions

### Forms
Forms use uncontrolled inputs with `FormData` (no React Hook Form). The submit handler reads fields explicitly:
```ts
const values = {
  company: fd.get('company') as string,
  // ... all fields listed explicitly — do NOT use Object.fromEntries cast
};
```

### Styling
- Tailwind only — no inline styles except for dynamic values (e.g., `style={{ width: \`${pct}%\` }}`)
- Color-coded statuses live in `STATUS_COLORS` in `constants/index.ts` — never hardcode status colors inline
- Responsive breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px)
- Sidebar is fixed at 240px on `lg+`, hidden drawer on mobile

### Icons
Always import from `lucide-react` by name:
```ts
import { Plus, Edit2, Trash2 } from 'lucide-react';
```
Do not use `title` prop on Lucide icons — it causes a TypeScript error. Use a wrapper `<span title="...">` instead.

### Modal pattern
All modals use the generic `Modal` component from `src/components/ui/Modal.tsx`.
Modal open/close state lives in `useUIStore` — never in local component state.

### Overdue logic
An application is overdue when:
- `nextActionDate` is set AND
- `nextActionDate < today` AND
- `status` is not in `['Rejected', 'Ghosted', 'Withdrawn', 'Accepted']`

This check is defined locally in `ApplicationsPage.tsx` and `KanbanView.tsx` as `isOverdue(app)`.

---

## Adding a New Feature — Checklist

1. **New entity type?** → Add interface to `src/types/index.ts` first
2. **New store?** → Follow the pattern in `useNotesStore.ts` (CRUD + localStorage sync)
3. **New page?** → Add to `src/pages/`, register route in `src/App.tsx`, add nav link in `src/components/layout/Sidebar.tsx`
4. **New form field on Application?** → Update type, seed data, `emptyForm`, and form submit handler in `ApplicationForm.tsx`
5. **Always run `npm run build`** to confirm zero TypeScript errors before committing

---

## Data Backup

Users export data via **Applications → Export CSV**. There is no auto-backup. Warn users if implementing any feature that clears localStorage.

---

## GitHub

Repository: `https://github.com/viswakanth98/job-tracker`
Branch: `master`
