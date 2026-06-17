"use client";

import { useEffect, useState } from "react";

// NOTE: this is a basic gate, not real security. The username/password
// below ship inside the JavaScript bundle, so anyone who opens browser
// dev tools and reads the source can find them. It's enough to keep
// casual visitors from landing on your data, not to protect anything
// sensitive. For real protection, swap this for Supabase Auth.
const USERNAME = "Jasmyn";
const PASSWORD = "marathon";
const STORAGE_KEY = "mt_authed";

export default function LoginGate({ children }) {
  const [authed, setAuthed] = useState(false);
  const [checkedStorage, setCheckedStorage] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (window.localStorage.getItem(STORAGE_KEY) === "true") {
      setAuthed(true);
    }
    setCheckedStorage(true);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (username === USERNAME && password === PASSWORD) {
      window.localStorage.setItem(STORAGE_KEY, "true");
      setAuthed(true);
      setError("");
    } else {
      setError("Incorrect username or password.");
    }
  }

  // Avoid a flash of the login form while we check localStorage.
  if (!checkedStorage) return null;

  if (authed) return children;

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-sm bg-surface p-6 shadow-xl">
        <h1 className="mb-1 font-display text-2xl text-ink">Marathon Training Log</h1>
        <p className="mb-5 text-sm text-ink-soft">Sign in to view the calendar.</p>

        <div className="mb-3">
          <label className="mb-1 block text-xs uppercase tracking-wide text-ink-soft">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            className="w-full rounded-sm border border-line bg-surface px-3 py-2 text-sm"
          />
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-xs uppercase tracking-wide text-ink-soft">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-sm border border-line bg-surface px-3 py-2 text-sm"
          />
        </div>

        {error && <p className="mb-3 text-sm text-bib">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-sm bg-bib px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
