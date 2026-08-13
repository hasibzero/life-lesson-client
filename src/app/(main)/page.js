// app/(main)/page.js
import { Featured } from '@/components/Featured';
import Hero from '@/components/Hero'; // <-- FIX: Removed curly braces for default import
import { TopContributors } from '@/components/TopContributors';
import WhySection from '@/components/WhySection';

export default function Home() {
  return (
    <div className="flex flex-col w-full bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300 min-h-[calc(100vh-6rem)]">
      <Hero />
      
      <Featured/>
      <TopContributors/>
      <WhySection/>
    </div>
  );
}