'use client';

import { Card, Image, Text, Badge, Group, Stack, Button, ActionIcon } from '@mantine/core';
import { IconEye, IconCalendar, IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';
import { News } from '@/types';

interface NewsCardProps {
  news: News;
}

export function NewsCard({ news }: NewsCardProps) {
  return (
    <Card withBorder padding="lg" radius="md" shadow="sm">
      <Card.Section>
        <Image
          src={news.image}
          height={200}
          alt={news.title}
          fallbackSrc="https://placehold.co/800x400?text=News+Image"
        />
      </Card.Section>

      <Stack gap="sm" mt="md">
        <Group justify="space-between">
          <Badge color="blue" variant="light">
            {news.category}
          </Badge>
          <Group gap="xs">
            <IconEye size={14} />
            <Text size="xs" c="dimmed">{news.views.toLocaleString()}</Text>
          </Group>
        </Group>

        <Text fw={700} size="lg" lineClamp={2}>
          {news.title}
        </Text>

        <Text size="sm" c="dimmed" lineClamp={3}>
          {news.summary}
        </Text>

        <Group justify="space-between" align="center">
          <Group gap="xs">
            <IconCalendar size={14} />
            <Text size="xs" c="dimmed">
              {new Date(news.publishedAt).toLocaleDateString()}
            </Text>
          </Group>
          <Group gap="xs">
            <Text size="xs" c="dimmed">{news.author}</Text>
            <Button
              component={Link}
              href={`/news/${news.id}`}
              variant="subtle"
              size="xs"
              rightSection={<IconArrowRight size={14} />}
            >
              Read More
            </Button>
          </Group>
        </Group>
      </Stack>
    </Card>
  );
}