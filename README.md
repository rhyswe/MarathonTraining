# Marathon Training Log

A single-user calendar for marathon training: plan what you intend to run
each day, then log what you actually did (distance, time, pace — or any
other workout). Built with Next.js, Tailwind, and Supabase.

## What's here

- A month-grid calendar. Each day is a "split card": the top half is the
  plan, a dashed line (like a stopwatch split) divides it from the bottom
  half, which is what actually happened.
- Two workout types per entry: **Run** (distance + duration, pace is
  calculated automatically) or **Other** (a free-text name like "Strength"
  or "Bike" + duration).
- Units: miles, hours/minutes, and pace in minutes per mile, per your spec.
- One Postgres table (`workouts`), one row per date.

## Setup

### 1. Create a Supabase project
Go to [supabase.com](https://supabase.com), create a free project, then:
- Open the **SQL Editor** and run the contents of `schema.sql` to create
  the `workouts` table.
- Go to **Project Settings → API** and copy the **Project URL** and the
  **anon public key**.

### 2. Configure environment variables
```bash
cp .env.local.example .env.local
```
Paste your Supabase URL and anon key into `.env.local`.

### 3. Install and run
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### 4. Deploy (optional)
Push this to a GitHub repo and import it on [vercel.com](https://vercel.com).
Add the same two environment variables in the Vercel project settings.
Vercel's free tier is plenty for this.

## Notes on decisions made

- **No login screen.** Since this is for one person, Row Level Security is
  off and the table is wide open to anyone with the anon key. That's fine
  as long as you don't share the deployed URL or commit `.env.local`. If
  you ever want a lock screen, Supabase Auth (email/password) is a small
  addition — ask if you want that scaffolded.
- **Pace is never stored**, only distance and duration. Pace is calculated
  on the fly (`duration ÷ distance`), so editing either value later can't
  leave a stale pace behind.
- **Duration is stored as total minutes** in the database; the hours/minutes
  split is purely a form convenience.
- **No calendar library.** A custom grid (using `date-fns` for date math)
  made it straightforward to give each day a planned/actual split rather
  than fighting a library's default day-cell markup.

## Where to go next

A few natural additions once the basics feel right: a weekly mileage
summary above the calendar, a simple chart of pace or distance over time,
or marking a target race date so the calendar can show "weeks to go."
