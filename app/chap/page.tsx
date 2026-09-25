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
  ActionIcon,
  Grid,
} from "@mantine/core";
import { IconFlame, IconArrowLeft, IconX, IconCalendar } from "@tabler/icons-react";
import { createClient } from "@base44/sdk";
import Link from "next/link";

// ========== NEW Base44 CLIENT ==========
const base44 = createClient({
  appId: "6ab4c278a87c64b26180c135",
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
  slug?: string;
}

export default function NewspaperPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

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

  const openNews = async (item: NewsItem) => {
    try {
      const fullRecord = await base44.entities.News.get(item.id);
      setSelectedNews(fullRecord as NewsItem);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSelectedNews(item);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const closeNews = () => setSelectedNews(null);

  const relatedNews = useMemo(() => {
    if (!selectedNews) return [];
    const sameCategory = news.filter(
      (n) =>
        n.id !== selectedNews.id &&
        n.category &&
        selectedNews.category &&
        n.category === selectedNews.category
    );
    const others = news.filter(
      (n) =>
        n.id !== selectedNews.id &&
        (!selectedNews.category || n.category !== selectedNews.category)
    );
    return [...sameCategory, ...others].slice(0, 6);
  }, [selectedNews, news]);

  // Layout groups matching the template
  const featured = news.find((n) => n.isFeatured || n.isBreaking) || news[0];
  const sideStory = news.filter((n) => n.id !== featured?.id)[0];
  const moreStories = news.filter((n) => n.id !== featured?.id && n.id !== sideStory?.id).slice(0, 3);
  const bottomNews = news.filter(
    (n) => n.id !== featured?.id && n.id !== sideStory?.id && !moreStories.find((m) => m.id === n.id)
  ).slice(0, 4);

  // ====================== FULL ARTICLE VIEW ======================
  if (selectedNews) {
    return (
      <Box
        style={{
          minHeight: "100vh",
          background: "#f8f5f0",
          fontFamily: "'Times New Roman', Times, serif",
        }}
      >
        <Box bg="#1a1a1a" py={8}>
          <Container size="md">
            <Group justify="space-between">
              <Text size="sm" c="white" fw={600} lineClamp={1}>
                {selectedNews.title}
              </Text>
              <ActionIcon variant="subtle" color="white" onClick={closeNews}>
                <IconX size={20} />
              </ActionIcon>
            </Group>
          </Container>
        </Box>

        <Container size="md" py={{ base: 30, sm: 50 }}>
          <Button
            variant="subtle"
            color="dark"
            leftSection={<IconArrowLeft size={18} />}
            mb="xl"
            onClick={closeNews}
            radius={0}
            style={{ fontFamily: "sans-serif" }}
          >
            Back to Newspaper
          </Button>

          <Stack gap="lg">
            <Group gap="sm">
              {selectedNews.category && (
                <Badge color="dark" variant="filled" size="lg" radius={0}>
                  {selectedNews.category}
                </Badge>
              )}
              {selectedNews.isBreaking && (
                <Badge color="red" size="lg" radius={0} leftSection={<IconFlame size={14} />}>
                  BREAKING
                </Badge>
              )}
            </Group>

            <Title
              order={1}
              style={{
                fontFamily: "'Times New Roman', Times, serif",
                fontSize: "clamp(28px, 5vw, 44px)",
                lineHeight: 1.15,
                fontWeight: 800,
              }}
            >
              {selectedNews.title}
            </Title>

            <Group gap="md" c="dimmed">
              <Group gap={6}>
                <IconCalendar size={16} />
                <Text size="sm">{formatDate(selectedNews.publishedAt)}</Text>
              </Group>
              {selectedNews.author && (
                <Text size="sm" fw={600}>
                  By {selectedNews.author}
                </Text>
              )}
            </Group>

            {selectedNews.image && (
              <Image
                src={selectedNews.image}
                radius={0}
                alt={selectedNews.title}
                mah={420}
                fit="cover"
                style={{ border: "1px solid #ccc" }}
              />
            )}

            {selectedNews.shortDescription && (
              <Text size="xl" fw={500} style={{ lineHeight: 1.65, fontStyle: "italic" }}>
                {selectedNews.shortDescription}
              </Text>
            )}

            <Divider my="sm" color="#1a1a1a" size={2} />

            <Text
              size="lg"
              style={{ whiteSpace: "pre-wrap", lineHeight: 1.85 }}
              dangerouslySetInnerHTML={{
                __html: (selectedNews.content || "").replace(/\n/g, "<br/>"),
              }}
            />

            {relatedNews.length > 0 && (
              <>
                <Divider my="xl" size={2} color="#1a1a1a" />
                <Title
                  order={3}
                  mb="lg"
                  style={{
                    fontFamily: "'Times New Roman', Times, serif",
                    borderBottom: "3px solid #1a1a1a",
                    paddingBottom: 6,
                    display: "inline-block",
                  }}
                >
                  Related Stories
                </Title>
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
                  {relatedNews.map((item) => (
                    <Paper
                      key={item.id}
                      p="md"
                      radius={0}
                      withBorder
                      style={{
                        cursor: "pointer",
                        borderColor: "#ccc",
                        background: "white",
                      }}
                      onClick={() => openNews(item)}
                    >
                      {item.image && (
                        <Image
                          src={item.image}
                          height={120}
                          radius={0}
                          mb="sm"
                          alt={item.title}
                          style={{ border: "1px solid #ddd" }}
                        />
                      )}
                      <Text
                        fw={700}
                        size="sm"
                        lineClamp={2}
                        style={{ fontFamily: "'Times New Roman', Times, serif" }}
                      >
                        {item.title}
                      </Text>
                    </Paper>
                  ))}
                </SimpleGrid>
              </>
            )}
          </Stack>
        </Container>
      </Box>
    );
  }

  // ====================== NEWSPAPER FRONT PAGE (matches your template) ======================
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
        background: "#f8f5f0",
        fontFamily: "'Times New Roman', Times, serif",
      }}
    >
      {/* Top date bar */}
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
          radius={0}
          p={0}
          mb="lg"
          style={{ background: "white", border: "3px solid #1a1a1a" }}
        >
          <Box px="md" pt="md" pb="xs">
            <Group justify="space-between" mb={4}>
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Established 2024
              </Text>
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Vol. 01 • No. 24
              </Text>
            </Group>

            <Title
              order={1}
              ta="center"
              style={{
                fontFamily: "'Times New Roman', Times, serif",
                fontSize: "clamp(48px, 9vw, 82px)",
                fontWeight: 900,
                letterSpacing: "-2px",
                lineHeight: 0.85,
                margin: "8px 0 6px",
              }}
            >
              DAILY NEWS
            </Title>
          </Box>

          {/* Black sub-header bar like the template */}
          <Box bg="#1a1a1a" py={8} px="md">
            <Text
              ta="center"
              size="sm"
              c="white"
              fw={600}
              tt="uppercase"
              style={{ letterSpacing: 4 }}
            >
              LiveUpdate24 — India’s Fastest Digital Newspaper
            </Text>
          </Box>
        </Paper>

        <Button
          component={Link}
          href="/"
          variant="subtle"
          color="dark"
          leftSection={<IconArrowLeft size={16} />}
          mb="xl"
          radius={0}
          style={{ fontFamily: "sans-serif" }}
        >
          Back to LiveUpdate24
        </Button>

        {/* ========== MAIN CONTENT - matches template layout ========== */}
        <Grid >
          {/* LEFT - Main Headline + body */}
          <Grid.Col span={{ base: 12, md: 7 }}>
            {featured && (
              <Box
                style={{ cursor: "pointer" }}
                onClick={() => openNews(featured)}
              >
                <Title
                  order={2}
                  style={{
                    fontFamily: "'Times New Roman', Times, serif",
                    fontSize: "clamp(28px, 4.5vw, 42px)",
                    fontWeight: 800,
                    lineHeight: 1.1,
                    marginBottom: 16,
                  }}
                >
                  {featured.title}
                </Title>

                {featured.image && (
                  <Image
                    src={featured.image}
                    radius={0}
                    mb="md"
                    alt={featured.title}
                    style={{ border: "1px solid #ccc" }}
                  />
                )}

                <Text size="md" style={{ lineHeight: 1.7 }}>
                  {featured.shortDescription ||
                    (featured.content ? featured.content.slice(0, 420) + "..." : "")}
                </Text>

                <Text size="sm" c="red" fw={700} mt="md">
                  Read the full story →
                </Text>
              </Box>
            )}
          </Grid.Col>

          {/* RIGHT - Side story + More Stories */}
          <Grid.Col span={{ base: 12, md: 5 }}>
            {sideStory && (
              <Box
                mb="xl"
                style={{ cursor: "pointer" }}
                onClick={() => openNews(sideStory)}
              >
                <Title
                  order={3}
                  style={{
                    fontFamily: "'Times New Roman', Times, serif",
                    fontSize: "clamp(20px, 3vw, 26px)",
                    fontWeight: 800,
                    lineHeight: 1.2,
                    marginBottom: 12,
                  }}
                >
                  {sideStory.title}
                </Title>

                {sideStory.image && (
                  <Image
                    src={sideStory.image}
                    radius={0}
                    mb="sm"
                    h={160}
                    fit="cover"
                    alt={sideStory.title}
                    style={{ border: "1px solid #ccc" }}
                  />
                )}

                <Text size="sm" style={{ lineHeight: 1.6 }} lineClamp={4}>
                  {sideStory.shortDescription}
                </Text>
                <Text size="xs" c="red" fw={700} mt={8}>
                  Read more →
                </Text>
              </Box>
            )}

            <Divider size={2} color="#1a1a1a" mb="md" />

            <Title
              order={4}
              mb="md"
              style={{
                fontFamily: "'Times New Roman', Times, serif",
                fontWeight: 800,
                borderBottom: "2px solid #1a1a1a",
                paddingBottom: 4,
                display: "inline-block",
              }}
            >
              More Stories
            </Title>

            <Stack gap="md">
              {moreStories.map((item) => (
                <Box
                  key={item.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => openNews(item)}
                >
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
                </Box>
              ))}
            </Stack>
          </Grid.Col>
        </Grid>

        {/* ========== BOTTOM SECTION ========== */}
        <Divider my={40} size={2} color="#1a1a1a" />

        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xl">
          {bottomNews.map((item) => (
            <Box
              key={item.id}
              style={{ cursor: "pointer" }}
              onClick={() => openNews(item)}
            >
              <Text
                fw={700}
                size="md"
                mb={6}
                style={{
                  fontFamily: "'Times New Roman', Times, serif",
                  lineHeight: 1.25,
                }}
              >
                {item.title}
              </Text>
              <Text size="sm" c="dimmed" lineClamp={3}>
                {item.shortDescription}
              </Text>
              <Text size="xs" c="red" fw={700} mt={8}>
                Read more →
              </Text>
            </Box>
          ))}
        </SimpleGrid>

        {/* Footer */}
        <Divider my={40} size={2} color="#1a1a1a" />
        <Text ta="center" size="xs" c="dimmed" fw={600} tt="uppercase">
          © 2026 LiveUpdate24 • All rights reserved • Printed digitally
        </Text>
      </Container>
    </Box>
  );
}