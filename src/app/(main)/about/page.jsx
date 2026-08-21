import React from "react";
import Link from "next/link";
import { 
  BookOpen, 
  Users, 
  Shield, 
  Sparkles, 
  Heart, 
  ArrowRight 
} from "lucide-react";

export const metadata = {
  title: "About Us | Digital Life Lessons",
  description: "Learn more about our mission to preserve personal wisdom and foster community growth.",
};

export default function AboutPage() {
  const coreValues = [
    {
      icon: <BookOpen className="w-6 h-6 text-[#0f766e] dark:text-[#16A696]" />,
      title: "Preserve Wisdom",
      description: "People often learn valuable lessons but forget them over time. We provide a safe space to document and organize your life's most important takeaways."
    },
    {
      icon: <Users className="w-6 h-6 text-[#0f766e] dark:text-[#16A696]" />,
      title: "Community Growth",
      description: "Grow by exploring public lessons shared by others. Connect through shared experiences, reactions, and meaningful discussions."
    },
    {
      icon: <Shield className="w-6 h-6 text-[#0f766e] dark:text-[#16A696]" />,
      title: "Privacy & Control",
      description: "Your reflections are yours. Choose exactly what stays private in your personal vault and what gets shared with the world."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[#0f766e] dark:text-[#16A696]" />,
      title: "Premium Insights",
      description: "Unlock specialized strategies and deep-dive modules from top contributors through our lifetime premium membership."
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#f9fafb] dark:bg-[#0c0c0e] font-sans selection:bg-[#0f766e]/20">
      
      {/* === Hero Section === */}
      <section className="relative px-6 pt-20 pb-24 lg:pt-32 lg:pb-32 overflow-hidden flex flex-col items-center text-center">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[300px] bg-[#0f766e]/10 dark:bg-[#0f766e]/20 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 dark:bg-teal-500/10 text-[#0f766e] dark:text-[#16A696] text-sm font-bold tracking-wide mb-6 border border-teal-200/50 dark:border-teal-500/20">
            <Heart className="w-4 h-4 fill-current" /> Our Mission
          </span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-zinc-900 dark:text-white leading-[1.15] tracking-tight mb-6">
            Turning Experiences Into <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0f766e] to-teal-400 dark:from-[#16A696] dark:to-teal-300">
              Lifelong Wisdom
            </span>
          </h1>
          
          <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mb-10">
            Digital Life Lessons is a platform where users can create, store, and share meaningful life lessons, personal growth insights, and wisdom they have gathered over time.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link 
              href="/signup" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0f766e] hover:bg-[#0d6e63] text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-md hover:shadow-teal-500/20 active:scale-[0.98]"
            >
              Start Your Journey <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/lessons" 
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3.5 rounded-xl font-bold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Explore Public Lessons
            </Link>
          </div>
        </div>
      </section>

      {/* === Core Values Grid === */}
      <section className="px-6 py-20 bg-white dark:bg-zinc-950 border-y border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-4">
              Why Learning From Life Matters
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
              We built this platform to encourage mindful reflection and help you navigate the complexities of life with a documented history of your growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, index) => (
              <div 
                key={index} 
                className="bg-[#f9fafb] dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-teal-50 dark:bg-teal-500/10 border border-teal-100 dark:border-teal-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === The Story Section === */}
      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 md:p-16 shadow-sm">
          <div className="prose prose-zinc dark:prose-invert max-w-none text-lg leading-[1.85] text-zinc-800 dark:text-zinc-200">
            <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-6 text-center">
              The Story Behind The Platform
            </h2>
            <p>
              We realized that as we go through life, we overcome hurdles, endure heartbreaks, and achieve milestones. In those moments, clarity strikes. We learn profound lessons about who we are and how the world works.
            </p>
            <p>
              <strong>But human memory is fragile.</strong> Fast forward a few months or years, and the sharp clarity of those realizations often fades, causing us to repeat the same mistakes.
            </p>
            <p>
              <strong>Digital Life Lessons</strong> was created to solve this. It acts as your personal digital diary of wisdom. By writing down what you've learned, assigning it an emotional tone, and categorizing it, you solidify that knowledge. Furthermore, by sharing it publicly, you allow your past struggles to become the stepping stones for someone else's success.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}