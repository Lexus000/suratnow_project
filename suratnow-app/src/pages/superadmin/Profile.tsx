import { AnimatedPage } from "../../components/AnimatedPage";

export default function Profile() {
  return (
    <AnimatedPage className="p-6 md:p-8 min-h-screen">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Profil Super Admin</h1>
      <p className="text-slate-500 dark:text-slate-400 mt-2">Kelola informasi profil dan kredensial Anda.</p>
    </AnimatedPage>
  );
}
