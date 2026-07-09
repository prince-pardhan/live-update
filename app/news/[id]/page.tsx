'use client';

import { useState, useEffect } from 'react';
import { Container, Paper, Title, Text, Stack, Badge, Group, Image, Skeleton, Alert, Button } from '@mantine/core';
import { IconArrowLeft, IconEye, IconCalendar, IconUser } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { News } from '@/types';

interface NewsPageProps {
  params: {
    id: string;
  };
}

export default function NewsPage({ params }: NewsPageProps) {
  const router = useRouter();
  const [news, setNews] = useState<News | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/news/${params.id}`);
        const data = await response.json();
        
        if (data.success) {
          setNews(data.data);
          setError(null);
        } else {
          setError(data.message || 'Failed to fetch news');
        }
      } catch (err) {
        setError('Error connecting to server');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [params.id]);

  if (isLoading) {
    return (
      <Container size="md" py="xl">
        <Stack gap="lg">
          <Skeleton height={300} />
          <Skeleton height={40} width="70%" />
          <Skeleton height={20} width="40%" />
          <Skeleton height={100} />
          <Skeleton height={200} />
        </Stack>
      </Container>
    );
  }

  if (error || !news) {
    return (
      <Container size="md" py="xl">
        <Alert color="red" title="Error" variant="filled">
          {error || 'News not found'}
        </Alert>
        <Button mt="md" onClick={() => router.push('/')} leftSection={<IconArrowLeft size={16} />}>
          Back to News
        </Button>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <Button 
        variant="subtle" 
        onClick={() => router.push('/')} 
        leftSection={<IconArrowLeft size={16} />}
        mb="lg"
      >
        Back to News
      </Button>

      <Paper withBorder radius="md" p="lg">
        <Stack gap="md">
          <Image
            src={news.image}
            height={400}
            alt={news.title}
            radius="md"
            fallbackSrc="https://placehold.co/800x400?text=News+Image"
          />

          <Badge size="lg" color="blue" variant="light" w="fit-content">
            {news.category}
          </Badge>

          <Title order={1}>{news.title}</Title>

          <Group gap="xl">
            <Group gap="xs">
              <IconUser size={16} />
              <Text size="sm">{news.author}</Text>
            </Group>
            <Group gap="xs">
              <IconCalendar size={16} />
              <Text size="sm">
                {new Date(news.publishedAt).toLocaleDateString()} at {new Date(news.publishedAt).toLocaleTimeString()}
              </Text>
            </Group>
            <Group gap="xs">
              <IconEye size={16} />
              <Text size="sm">{news.views.toLocaleString()} views</Text>
            </Group>
          </Group>

          <Text size="lg" fw={500}>
            {news.summary}
          </Text>

          <Paper withBorder p="md" bg="gray.0">
            <Text>{news.content}</Text>
          </Paper>

          <Group justify="space-between" mt="md">
            <Text size="sm" c="dimmed">
              Last updated: {new Date(news.publishedAt).toLocaleString()}
            </Text>
            <Badge variant="outline" size="lg">
              ID: {news.id}
            </Badge>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
}