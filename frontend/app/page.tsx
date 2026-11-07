import { Header } from "@/components/Header";
import { TrackingSection } from "@/components/TrackingSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <Header />
      <main className="flex flex-1 flex-col">
        <TrackingSection />
      </main>
      <Footer />
    </div>
  );
}
