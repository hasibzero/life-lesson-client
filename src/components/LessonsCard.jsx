'use client';

import React, { useState } from 'react';
import { Card, Button, Chip } from "@heroui/react";
import Link from 'next/link';

// Standard SVG for the Lock Icon used in the Premium overlay
const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9c5236" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

export default function LessonsCard() {
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  const mockLessons = [
    {
      id: '1',
      title: 'The Art of Deep Work in a Distracted World',
      description: 'Master the ability to focus without distraction on a cognitively demanding task.',
      category: 'Productivity',
      tone: 'Tactical',
      accessLevel: 'Free',
      creator: {
        name: 'Dr. Sarah Jenkins',
        avatar: 'https://i.pravatar.cc/150?u=sarah',
      },
      createdAt: 'Oct 12, 2023',
    },
    {
      id: '2',
      title: 'Executive Decision Making Under Pressure',
      description: 'A comprehensive guide to frameworks used by top CEOs to make high-stakes choices.',
      category: 'Leadership',
      tone: 'Strategic',
      accessLevel: 'Premium',
      creator: {
        name: 'Marcus Vance',
        avatar: 'https://i.pravatar.cc/150?u=marcus',
      },
      createdAt: 'Nov 05, 2023',
    },
    {
      id: '3',
      title: 'Wealth Building in the Digital Age',
      description: 'Modern asset allocation and understanding decentralized financial systems.',
      category: 'Finance',
      tone: 'Analytical',
      accessLevel: 'Free',
      creator: {
        name: 'David Chen',
        avatar: 'https://i.pravatar.cc/150?u=david',
      },
      createdAt: 'Dec 01, 2023',
    },
    {
      id: '4',
      title: 'Digital Minimalism & Mental Clarity',
      description: 'Reclaiming your attention and designing a calm technological ecosystem.',
      category: 'Wellness',
      tone: 'Inspirational',
      accessLevel: 'Free',
      creator: {
        name: 'Elena Rostova',
        avatar: 'https://i.pravatar.cc/150?u=elena',
      },
      createdAt: 'Jan 15, 2024',
    }
  ];

  return (
    <section className="w-full min-h-screen  px-6  py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockLessons.map((lesson) => {
          
          const isLocked = lesson.accessLevel === 'Premium' && !isPremiumUser;

          return (
            <Card 
              key={lesson.id} 
              // FIX: Replaced shadow="sm" with standard Tailwind shadow-sm
              className="relative h-full w-full shadow-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
            >
              {isLocked && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-sm rounded-large">
                  <div className="w-14 h-14 bg-white dark:bg-zinc-100 rounded-full flex items-center justify-center shadow-sm border border-zinc-200 mb-4">
                    <LockIcon />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">
                    Premium Lesson
                  </h3>
                  <p className="text-[15px] font-medium text-zinc-600 dark:text-zinc-300 mb-6">
                    Upgrade to view
                  </p>
                  <Button 
                    radius="sm"
                    className="w-full font-semibold text-white shadow-md"
                    style={{ backgroundColor: '#9c5236' }} 
                  >
                    Upgrade Now
                  </Button>
                </div>
              )}

              <Card.Header className="flex justify-between items-start pt-5 px-5">
                <div className="flex flex-wrap gap-2">
                  <Chip size="sm" radius="sm" className="bg-[#f0f4fa] text-[#4b5563] dark:bg-zinc-800 dark:text-zinc-300 border-none font-medium">
                    {lesson.category}
                  </Chip>
                  <Chip size="sm" radius="sm" className="bg-[#6366f1] text-white border-none font-medium">
                    {lesson.tone}
                  </Chip>
                </div>
                <Chip size="sm" radius="sm" className="bg-[#f0f4fa] text-[#4b5563] dark:bg-zinc-800 dark:text-zinc-400 font-medium">
                  {lesson.accessLevel}
                </Chip>
              </Card.Header>

              {/* FIX: Changed from Card.Body to Card.Content for HeroUI v3 */}
              <Card.Content className="px-5 py-3 flex-grow overflow-visible">
                <h4 className="text-[20px] font-bold text-[#1a202c] dark:text-white mb-3 leading-tight line-clamp-2">
                  {lesson.title}
                </h4>
                <p className="text-[15px] text-zinc-600 dark:text-zinc-400 line-clamp-3 mb-8">
                  {lesson.description}
                </p>

                <div className="mt-auto flex items-center gap-3">
                  <img 
                    src={lesson.creator.avatar} 
                    alt={lesson.creator.name} 
                    className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                  />
                  <div className="flex flex-col">
                    <span className="text-[14px] font-bold text-[#1a202c] dark:text-white leading-none mb-1">
                      {lesson.creator.name}
                    </span>
                    <span className="text-[13px] text-zinc-500 font-medium leading-none">
                      {lesson.createdAt}
                    </span>
                  </div>
                </div>
              </Card.Content>

              <Card.Footer className="px-5 pb-5 pt-4">
                <Button
                  as={Link}
                  href={`/lessons/${lesson.id}`}
                  radius="sm"
                  variant={lesson.id === '1' ? 'solid' : 'bordered'} 
                  className="w-full font-semibold border-2"
                  style={{ 
                    borderColor: '#149788', 
                    backgroundColor: lesson.id === '1' ? '#149788' : 'transparent',
                    color: lesson.id === '1' ? 'white' : '#149788'
                  }}
                >
                  See Details
                </Button>
              </Card.Footer>
            </Card>
          );
        })}
      </div>
    </section>
  );
}