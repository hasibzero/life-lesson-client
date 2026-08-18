'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Compass, 
  TrendingUp, 
  BookMarked, 
  Users, 
  ArrowRight 
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const benefits = [
  {
    icon: Compass,
    title: 'Distilled Real-World Wisdom',
    description:
      'Learn directly from authentic lived experiences and critical turning points rather than ungrounded abstract theories.',
    badge: 'Authenticity',
  },
  {
    icon: TrendingUp,
    title: 'Accelerated Personal Growth',
    description:
      'Bypass years of trial and error by adopting proven strategies and hard-won insights shared by experienced peers.',
    badge: 'Efficiency',
  },
  {
    icon: BookMarked,
    title: 'Preserving Generational Insight',
    description:
      'Create an enduring archive of personal lessons, ensuring valuable realizations and breakthroughs are never lost to time.',
    badge: 'Legacy',
  },
  {
    icon: Users,
    title: 'Empathetic Human Connection',
    description:
      'Find clarity and solidarity in shared struggles, building meaningful connections through vulnerability and honesty.',
    badge: 'Community',
  },
];

export default function WhySection() {
  return (
    <section className="w-full py-20 bg-slate-50 dark:bg-zinc-950 transition-colors duration-300 font-sans">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="inline-flex items-center text-[12px] font-bold px-3 py-1 rounded-full bg-teal-50 text-[#149788] dark:bg-teal-500/10 dark:text-teal-400 border border-teal-200/60 dark:border-teal-500/20 mb-3">
            Core Philosophy
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1a202c] dark:text-white tracking-tight mb-3">
            Why Learning From Life Matters
          </h2>
          <p className="text-[16px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Every experience leaves behind a blueprint. Discover why preserving and reflecting on personal wisdom creates lasting transformation.
          </p>
        </motion.div>

        {/* 4 Benefit Cards Animated Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-[#149788]/60 dark:hover:border-[#149788]/60 transition-colors group"
              >
                <div>
                  {/* Icon & Badge Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#e6f4f2] dark:bg-[#149788]/20 flex items-center justify-center text-[#149788] dark:text-[#2dd4bf] group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      {benefit.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-[18px] font-bold text-[#1a202c] dark:text-white mb-2.5 leading-snug group-hover:text-[#149788] transition-colors">
                    {benefit.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[14px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>

                {/* Subtle Bottom Accent Indicator */}
                <div className="pt-6 mt-6 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[13px] font-semibold text-zinc-400 group-hover:text-[#149788] transition-colors">
                  <span>Explore Wisdom</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Section Footer Action */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-14 text-center"
        >
          <Link
            href="/lessons"
            className="inline-flex items-center gap-2 text-[15px] font-bold text-[#149788] hover:text-[#0f766a] dark:text-[#2dd4bf] dark:hover:text-[#5eead4] transition-colors group"
          >
            <span>Start exploring community wisdom</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}