"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Container,
  Title,
  Text,
  Group,
  Stack,
  Badge,
  Divider,
  SimpleGrid,
  Image,
  Center,
  Loader,
  Button,
  Paper,
} from "@mantine/core";
import { IconFlame, IconArrowLeft } from "@tabler/icons-react";
import { createClient } from "@base44/sdk";
import Link from "next/link";

// ========== SINGLE Base44 CLIENT ==========
const base44 = createClient({
  appId: "6ab4c3844cd0d31fd45fd867",
  headers: {
    Authorization: "Bearer YOUR_PERSONAL_ACCESS_TOKEN",
  },
});

interface NewsItem {
  id: string;
  title: string;
  shortDescription?: string;
  content?: string;
  image?: string;
  category?: string;
  publishedAt?: string;
  isBreaking?: boolean;
  isFeatured?: boolean;
  author?: string;
}

export default function NewspaperPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const records = await base44.entities.News.list().catch(() => []);
        setNews(records as NewsItem[]);
      } catch {
        setNews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Group news for newspaper layout
  const featured = news.find((n) => n.isFeatured || n.isBreaking) || news[0];
  const topNews = news.filter((n) => n.id !== featured?.id).slice(0, 4);
  const goodNews = news.filter((n) => n.id !== featured?.id).slice(4, 8);
  const moreNews = news.filter((n) => n.id !== featured?.id).slice(8, 14);

  if (loading) {
    return (
      <Center h="100vh" bg="#f8f5f0">
        <Stack align="center">
          <Loader color="dark" size="lg" />
          <Text c="dimmed">Printing today’s edition...</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Box
      style={{
        minHeight: "100vh",
        background: "#f8f5f0", // classic newspaper paper color
        fontFamily: "'Times New Roman', Times, serif",
      }}
    >
      {/* Top thin bar */}
      <Box bg="#1a1a1a" py={6}>
        <Container size="lg">
          <Group justify="space-between">
            <Text size="xs" c="white" tt="uppercase" fw={600}>
              {formatDate(new Date().toISOString())}
            </Text>
            <Text size="xs" c="white" tt="uppercase">
              LiveUpdate24 • Digital Edition
            </Text>
          </Group>
        </Container>
      </Box>

      <Container size="lg" py={30}>
        {/* ========== MASTHEAD ========== */}
        <Paper
          withBorder
          radius={0}
          p="md"
          mb="xl"
          style={{
            borderColor: "#1a1a1a",
            borderWidth: 3,
            background: "white",
          }}
        >
          <Group justify="space-between" align="flex-start" mb="sm">
            <Box>
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Established 2024
              </Text>
            </Box>
            <Badge
              color="red"
              size="lg"
              radius={0}
              leftSection={<IconFlame size={14} />}
              style={{ fontFamily: "sans-serif" }}
            >
              EXTRA! EXTRA!
            </Badge>
          </Group>

          <Title
            order={1}
            ta="center"
            style={{
              fontFamily: "'Times New Roman', Times, serif",
              fontSize: "clamp(42px, 8vw, 72px)",
              fontWeight: 900,
              letterSpacing: "-1px",
              lineHeight: 0.9,
              margin: "10px 0 8px",
            }}
          >
            DAILY NEWS
          </Title>

          <Text
            ta="center"
            size="sm"
            fw={600}
            tt="uppercase"
            style={{ letterSpacing: 3 }}
          >
            LiveUpdate24 — India’s Fastest Digital Newspaper
          </Text>

          <Divider my="md" color="#1a1a1a" size={2} />

          <Group justify="center" gap="xl">
            <Text size="sm" fw={700}>
              TOP NEWS
            </Text>
            <Text size="sm" fw={700}>
              GOOD NEWS
            </Text>
            <Text size="sm" fw={700}>
              WORLD
            </Text>
            <Text size="sm" fw={700}>
              BUSINESS
            </Text>
            <Text size="sm" fw={700}>
              SPORTS
            </Text>
          </Group>
        </Paper>

        {/* Back button */}
        <Button
          component={Link}
          href="/"
          variant="subtle"
          color="dark"
          leftSection={<IconArrowLeft size={16} />}
          mb="lg"
          radius={0}
          style={{ fontFamily: "sans-serif" }}
        >
          Back to LiveUpdate24
        </Button>

        {/* ========== MAIN NEWSPAPER GRID ========== */}
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
          {/* LEFT COLUMN - Featured + Top News */}
          <Box style={{ gridColumn: "span 2" }}>
            {/* Lead Story */}
            {featured && (
              <Box mb="xl">
                {featured.image && (
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    radius={0}
                    mb="md"
                    style={{ border: "1px solid #ccc" }}
                  />
                )}
                <Group gap="xs" mb={6}>
                  {featured.isBreaking && (
                    <Badge color="red" radius={0} size="sm">
                      BREAKING
                    </Badge>
                  )}
                  {featured.category && (
                    <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                      {featured.category}
                    </Text>
                  )}
                </Group>
                <Title
                  order={2}
                  style={{
                    fontFamily: "'Times New Roman', Times, serif",
                    fontSize: "clamp(24px, 4vw, 36px)",
                    fontWeight: 800,
                    lineHeight: 1.15,
                    marginBottom: 12,
                  }}
                >
                  {featured.title}
                </Title>
                <Text size="md" style={{ lineHeight: 1.6 }}>
                  {featured.shortDescription ||
                    featured.content?.slice(0, 280) + "..."}
                </Text>
                <Text size="xs" c="dimmed" mt="sm" fw={600}>
                  {featured.author ? `By ${featured.author}` : ""} •{" "}
                  {formatDate(featured.publishedAt)}
                </Text>
              </Box>
            )}

            <Divider size={2} color="#1a1a1a" mb="xl" />

            {/* TOP NEWS Section */}
            <Title
              order={3}
              mb="md"
              style={{
                fontFamily: "'Times New Roman', Times, serif",
                borderBottom: "3px solid #1a1a1a",
                paddingBottom: 6,
                display: "inline-block",
              }}
            >
              TOP NEWS
            </Title>

            <Stack gap="lg">
              {topNews.map((item) => (
                <Box key={item.id}>
                  <Group gap="md" align="flex-start" wrap="nowrap">
                    {item.image && (
                      <Image
                        src={item.image}
                        w={120}
                        h={90}
                        radius={0}
                        fit="cover"
                        style={{ border: "1px solid #ddd", flexShrink: 0 }}
                      />
                    )}
                    <Box>
                      {item.category && (
                        <Text size="xs" fw={700} tt="uppercase" c="red" mb={4}>
                          {item.category}
                        </Text>
                      )}
                      <Text
                        fw={700}
                        size="md"
                        style={{
                          fontFamily: "'Times New Roman', Times, serif",
                          lineHeight: 1.3,
                        }}
                      >
                        {item.title}
                      </Text>
                      <Text size="sm" c="dimmed" mt={4} lineClamp={2}>
                        {item.shortDescription}
                      </Text>
                    </Box>
                  </Group>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* RIGHT COLUMN */}
          <Stack gap="xl">
            {/* GOOD NEWS */}
            <Box>
              <Title
                order={3}
                mb="md"
                style={{
                  fontFamily: "'Times New Roman', Times, serif",
                  borderBottom: "3px solid #1a1a1a",
                  paddingBottom: 6,
                  display: "inline-block",
                }}
              >
                GOOD NEWS
              </Title>
              <Stack gap="md">
                {goodNews.map((item) => (
                  <Box key={item.id}>
                    <Text
                      fw={700}
                      size="sm"
                      style={{
                        fontFamily: "'Times New Roman', Times, serif",
                        lineHeight: 1.3,
                      }}
                    >
                      {item.title}
                    </Text>
                    <Text size="xs" c="dimmed" mt={2} lineClamp={2}>
                      {item.shortDescription}
                    </Text>
                    <Divider mt="sm" color="#ddd" />
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* MORE NEWS */}
            <Box>
              <Title
                order={3}
                mb="md"
                style={{
                  fontFamily: "'Times New Roman', Times, serif",
                  borderBottom: "3px solid #1a1a1a",
                  paddingBottom: 6,
                  display: "inline-block",
                }}
              >
                IN BRIEF
              </Title>
              <Stack gap="sm">
                {moreNews.map((item) => (
                  <Text
                    key={item.id}
                    size="sm"
                    style={{
                      fontFamily: "'Times New Roman', Times, serif",
                      borderBottom: "1px dotted #aaa",
                      paddingBottom: 8,
                    }}
                  >
                    <strong>{item.title}</strong>
                  </Text>
                ))}
              </Stack>
            </Box>
          </Stack>
        </SimpleGrid>

        {/* Footer of newspaper */}
        <Divider my={40} size={2} color="#1a1a1a" />
        <Text ta="center" size="xs" c="dimmed" fw={600} tt="uppercase">
          © 2026 LiveUpdate24 • All rights reserved • Printed digitally
        </Text>
      </Container>
    </Box>
  );
}