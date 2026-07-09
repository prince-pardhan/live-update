'use client';

import { useEffect, useState } from 'react';
import { Paper, Text, Badge, Group, Stack, ThemeIcon, Transition } from '@mantine/core';
import { IconRefresh, IconClock } from '@tabler/icons-react';
import { News } from '@/types';

interface LiveUpdateProps {
  news: News[];
}

export function LiveUpdate({ news }: LiveUpdateProps) {
  const [liveNews, setLiveNews] = useState<News[]>(news);
  const [latestUpdate, setLatestUpdate] = useState<string>(new Date().toISOString());
  const [isVisible, setIsVisible] = useState(true);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new news update
      const fakeNews: News = {
        id: `live-${Date.now()}`,
        title: `Breaking News: Live Update ${new Date().toLocaleTimeString()}`,
        summary: 'This is a simulated breaking news update.',
        content: 'Detailed content for this breaking news update.',
        category: 'Breaking News',
        author: 'Live Reporter',
        publishedAt: new Date().toISOString(),
        image: `https://picsum.photos/seed/${Date.now()}/800/400`,
        views: 0
      };

    //   setLiveNews(prev => [fakeNews, ...prev.slice(0, 9)]);
      setLatestUpdate(new Date().toISOString());
      setIsVisible(false);
      
      // Trigger animation
      setTimeout(() => setIsVisible(true), 50);
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Paper>
    
    </Paper>
  );
}