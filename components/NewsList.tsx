'use client';

import { useState, useEffect } from 'react';
import { SimpleGrid, Container, Title, Stack, Skeleton, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { NewsCard } from './NewsCard';
import { LiveUpdate } from './LiveUpdate';
import { News } from '@/types';

interface NewsListProps {
  searchQuery?: string;
}

export function NewsList({ searchQuery = '' }: NewsListProps) {
  const [news, setNews] = useState<News[]>([]);
  const [filteredNews, setFilteredNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/news?limit=10');
      const data = await response.json();
      
      if (data.success) {
        setNews(data.data);
        setFilteredNews(data.data);
        setError(null);
      } else {
        setError('Failed to fetch news');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter news based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredNews(news);
    } else {
      const query = searchQuery.toLowerCase().trim();
      const filtered = news.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.author.toLowerCase().includes(query)
      );
      setFilteredNews(filtered);
    }
  }, [searchQuery, news]);

  useEffect(() => {
    fetchNews();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchNews, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <Container size="xl" py="xl">
        <Stack gap="lg">
          <Skeleton height={60} />
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} height={350} />
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="xl" py="xl">
        <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" variant="filled">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <LiveUpdate news={news} />
        
        {searchQuery && (
          <Alert color="blue" variant="light" icon={<IconAlertCircle size={16} />}>
            Showing results for: <strong>"{searchQuery}"</strong> ({filteredNews.length} articles found)
          </Alert>
        )}

       

        {filteredNews.length === 0 ? (
          <Alert color="yellow" variant="light" icon={<IconAlertCircle size={16} />}>
            No news found matching your search criteria.
          </Alert>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
            {filteredNews.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </Container>
  );
}