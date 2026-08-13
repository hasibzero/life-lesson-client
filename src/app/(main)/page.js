// app/(main)/page.js
import Hero from '@/components/Hero'; // <-- FIX: Removed curly braces for default import

export default function Home() {
  return (
    <div className="flex flex-col w-full bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300 min-h-[calc(100vh-6rem)]">
      <Hero />
    </div>
  );
}