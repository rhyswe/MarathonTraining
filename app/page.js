import MonthCalendar from "../components/MonthCalendar";
import LoginGate from "../components/LoginGate";

export default function Page() {
  return (
    <main className="min-h-screen bg-bg">
      <LoginGate>
        <MonthCalendar />
      </LoginGate>
    </main>
  );
}
