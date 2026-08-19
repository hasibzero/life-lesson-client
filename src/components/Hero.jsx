// components/Hero.jsx
'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Link from 'next/link';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Hero() {
  // Array of exactly 3 slides
  const slides = [
    {
      id: 1,
      badge: 'Featured Series',
      title: 'Mastering Strategic Communication',
      description: 'Elevate your executive presence and drive organizational clarity with our curated modules on high-stakes communication.',
      bgImage: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2000&auto=format&fit=crop', 
    },
    {
      id: 2,
      badge: 'New Lessons',
      title: 'Advanced Leadership Dynamics',
      description: 'Learn how to lead through complexity and build resilient teams in fast-paced corporate environments.',
      bgImage: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2000&auto=format&fit=crop',
    },
    {
      id: 3,
      badge: 'Most Popular',
      title: 'Data-Driven Decision Making',
      description: 'Harness the power of analytics to drive growth, optimize operations, and stay ahead of market trends in the digital age.',
      bgImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2000&auto=format&fit=crop',
    }
  ];

  return (
    <section className="max-w-[1200px] mx-auto w-full h-[600px] relative bg-zinc-100 group">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={true}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="w-full h-full hero-swiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative w-full h-full">
            
            {/* Background Image with Gradient Overlays */}
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.bgImage})` }}
            >
              {/* This creates the faded white effect on the left side */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent dark:from-zinc-950/95 dark:via-zinc-950/80 dark:to-transparent" />
            </div>

            {/* Slide Content */}
            <div className="relative h-full max-w-[1920px] mx-auto px-12 lg:px-24 flex items-center">
              <div className="max-w-2xl mt-10">
                
                {/* Badge */}
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#e6f4f2] dark:bg-[#149788]/20 border border-[#bce4de] dark:border-[#149788]/30 mb-6">
                  <span className="text-sm font-semibold text-[#149788] dark:text-[#2dd4bf]">
                    {slide.badge}
                  </span>
                </div>

                {/* Heading */}
                <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-[#1a202c] dark:text-white mb-6 leading-[1.1]">
                  {slide.title}
                </h1>

                {/* Description */}
                <p className="text-lg lg:text-xl text-zinc-700 dark:text-zinc-300 mb-10 max-w-xl leading-relaxed">
                  {slide.description}
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Link 
                    href="/lessons" 
                    className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white rounded-xl transition-all hover:brightness-110 shadow-lg shadow-[#149788]/20"
                    style={{ backgroundColor: '#149788' }}
                  >
                    Start Learning
                  </Link>
                  
                  
                </div>

              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}