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
import { IconFlame, IconArrowLeft, IconX, IconCalendar, IconArrowRight } from "@tabler/icons-react";
import { createClient } from "@base44/sdk";
import Link from "next/link";

// ========== Base44 CLIENT ==========
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

// ---------- Shared tokens ----------
const INK = "#1a1a1a";
const PAPER = "#f8f5f0";
const RULE = "#d8d2c4";
const ACCENT = "#a4292c"; // single strong editorial red — masthead accent
const SERIF = "'Times New Roman', Times, serif";

// A single, reusable "Read more" affordance so every card in the page
// uses the exact same visual language instead of ad-hoc text links.
function ReadMore({ compact = false }: { compact?: boolean }) {
  return (
    <Group
      gap={6}
      mt={compact ? 8 : 12}
      className="read-more"
      style={{ color: ACCENT }}
    >
      <Text
        size={compact ? "xs" : "sm"}
        fw={700}
        style={{ fontFamily: "sans-serif", letterSpacing: 0.2 }}
      >
        Read more
      </Text>
      <IconArrowRight size={compact ? 13 : 15} stroke={2.5} className="read-more-arrow" />
    </Group>
  );
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

  const featured = news.find((n) => n.isFeatured || n.isBreaking) || news[0];
  const sideStory = news.filter((n) => n.id !== featured?.id)[0];
  const moreStories = news.filter((n) => n.id !== featured?.id && n.id !== sideStory?.id).slice(0, 3);
  const bottomNews = news.filter(
    (n) => n.id !== featured?.id && n.id !== sideStory?.id && !moreStories.find((m) => m.id === n.id)
  ).slice(0, 4);

  // Shared hover styling for anything clickable, injected once.
  const HoverStyles = () => (
    <style>{`
      .news-card, .story-block { transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease; }
      .news-card:hover { transform: translateY(-3px); box-shadow: 0 10px 24px rgba(0,0,0,0.10); border-color: ${INK} !important; }
      .story-block:hover .story-title { color: ${ACCENT}; }
      .story-title { transition: color 140ms ease; }
      .read-more-arrow { transition: transform 140ms ease; }
      .news-card:hover .read-more-arrow, .story-block:hover .read-more-arrow { transform: translateX(3px); }
    `}</style>
  );

  // ====================== FULL ARTICLE VIEW ======================
  if (selectedNews) {
    return (
      <Box style={{ minHeight: "100vh", background: PAPER, fontFamily: SERIF }}>
        <HoverStyles />
        <Box bg={INK} py={10} style={{ borderBottom: `3px solid ${ACCENT}` }}>
          <Container size="md">
            <Group justify="space-between" wrap="nowrap">
              <Text size="sm" c="white" fw={600} lineClamp={1} style={{ fontFamily: "sans-serif" }}>
                {selectedNews.title}
              </Text>
              <ActionIcon variant="subtle" color="white" onClick={closeNews} aria-label="Close article">
                <IconX size={20} />
              </ActionIcon>
            </Group>
          </Container>
        </Box>

        <Container size="md" py={{ base: 30, sm: 56 }}>
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
                <Badge color="dark" variant="filled" size="lg" radius={0} style={{ fontFamily: "sans-serif" }}>
                  {selectedNews.category}
                </Badge>
              )}
              {selectedNews.isBreaking && (
                <Badge
                  color={ACCENT}
                  size="lg"
                  radius={0}
                  leftSection={<IconFlame size={14} />}
                  style={{ fontFamily: "sans-serif" }}
                >
                  Breaking
                </Badge>
              )}
            </Group>

            <Title
              order={1}
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(28px, 5vw, 46px)",
                lineHeight: 1.12,
                fontWeight: 800,
                letterSpacing: "-0.5px",
              }}
            >
              {selectedNews.title}
            </Title>

            <Group gap="lg" c="dimmed" style={{ fontFamily: "sans-serif" }}>
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
                mah={440}
                fit="cover"
                style={{ border: `1px solid ${RULE}` }}
              />
            )}

            {selectedNews.shortDescription && (
              <Text size="xl" fw={500} style={{ lineHeight: 1.65, fontStyle: "italic" }}>
                {selectedNews.shortDescription}
              </Text>
            )}

            <Divider my="sm" color={INK} size={2} />

            <Text
              size="lg"
              style={{ whiteSpace: "pre-wrap", lineHeight: 1.9, maxWidth: 720 }}
              dangerouslySetInnerHTML={{
                __html: (selectedNews.content || "").replace(/\n/g, "<br/>"),
              }}
            />

            {relatedNews.length > 0 && (
              <>
                <Divider my="xl" size={2} color={INK} />
                <Title
                  order={3}
                  mb="lg"
                  style={{
                    fontFamily: SERIF,
                    borderBottom: `3px solid ${ACCENT}`,
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
                      className="news-card"
                      p="md"
                      radius={0}
                      withBorder
                      style={{ cursor: "pointer", borderColor: RULE, background: "white" }}
                      onClick={() => openNews(item)}
                    >
                      {item.image && (
                        <Image
                          src={item.image}
                          height={120}
                          radius={0}
                          mb="sm"
                          alt={item.title}
                          style={{ border: `1px solid ${RULE}` }}
                        />
                      )}
                      <Text fw={700} size="sm" lineClamp={2} style={{ fontFamily: SERIF }}>
                        {item.title}
                      </Text>
                      <ReadMore compact />
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

  // ====================== NEWSPAPER FRONT PAGE ======================
  if (loading) {
    return (
      <Center h="100vh" bg={PAPER}>
        <Stack align="center">
          <Loader color="dark" size="lg" />
          <Text c="dimmed" style={{ fontFamily: "sans-serif" }}>
            Printing today's edition...
          </Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Box style={{ minHeight: "100vh", background: PAPER, fontFamily: SERIF }}>
      <HoverStyles />

      {/* Top date bar */}
      <Box bg={INK} py={7}>
        <Container size="lg">
          <Group justify="space-between">
            <Text size="xs" c="white" tt="uppercase" fw={600} style={{ fontFamily: "sans-serif", letterSpacing: 1 }}>
              {formatDate(new Date().toISOString())}
            </Text>
            <Text size="xs" c="white" tt="uppercase" style={{ fontFamily: "sans-serif", letterSpacing: 1 }}>
              LiveUpdate24 · Digital Edition
            </Text>
          </Group>
        </Container>
      </Box>

      <Container size="lg" py={30}>
        {/* ========== MASTHEAD ========== */}
        <Paper radius={0} p={0} mb="xl" style={{ background: "white", border: `3px solid ${INK}` }}>
          <Box px="md" pt="md" pb="xs">
            <Group justify="space-between" mb={4}>
              <Text size="xs" fw={700} c="dimmed" style={{ fontFamily: "sans-serif" }}>
                LiveUpdate24.online
              </Text>
              <Text size="xs" fw={700} c="dimmed" style={{ fontFamily: "sans-serif" }}>
                Vol. 01 · No. 24
              </Text>
            </Group>

            <Title
              order={1}
              ta="center"
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(48px, 9vw, 84px)",
                fontWeight: 900,
                letterSpacing: "-2px",
                lineHeight: 0.85,
                margin: "8px 0 6px",
                color: INK,
              }}
            >
              LiveUpdate24
            </Title>
          </Box>

          <Box bg={INK} py={9} px="md" style={{ borderTop: `2px solid ${ACCENT}` }}>
            <Text ta="center" size="sm" c="white" fw={600} style={{ fontFamily: "sans-serif", letterSpacing: 3 }}>
              LiveUpdate24 — World's Fastest Digital Newspaper
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

        {/* ========== MAIN CONTENT ========== */}
        <Grid >
          {/* LEFT - Main Headline + body */}
          <Grid.Col span={{ base: 12, md: 7 }}>
            {featured && (
              <Box className="story-block" style={{ cursor: "pointer" }} onClick={() => openNews(featured)}>
                {featured.isBreaking && (
                  <Badge
                    color={ACCENT}
                    size="md"
                    radius={0}
                    leftSection={<IconFlame size={13} />}
                    mb="sm"
                    style={{ fontFamily: "sans-serif" }}
                  >
                    Breaking
                  </Badge>
                )}
                <Title
                  order={2}
                  className="story-title"
                  style={{
                    fontFamily: SERIF,
                    fontSize: "clamp(28px, 4.5vw, 44px)",
                    fontWeight: 800,
                    lineHeight: 1.08,
                    letterSpacing: "-0.5px",
                    marginBottom: 16,
                    color: INK,
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
                    style={{ border: `1px solid ${RULE}` }}
                  />
                )}

                <Text size="md" style={{ lineHeight: 1.75, maxWidth: 560 }}>
                  {featured.shortDescription ||
                    (featured.content ? featured.content.slice(0, 420) + "..." : "")}
                </Text>

                <ReadMore />
              </Box>
            )}
          </Grid.Col>

          {/* RIGHT - Side story + More Stories */}
          <Grid.Col span={{ base: 12, md: 5 }}>
            {sideStory && (
              <Box
                className="story-block"
                mb="xl"
                pb="xl"
                style={{ cursor: "pointer", borderBottom: `1px solid ${RULE}` }}
                onClick={() => openNews(sideStory)}
              >
                <Title
                  order={3}
                  className="story-title"
                  style={{
                    fontFamily: SERIF,
                    fontSize: "clamp(20px, 3vw, 27px)",
                    fontWeight: 800,
                    lineHeight: 1.18,
                    marginBottom: 12,
                    color: INK,
                  }}
                >
                  {sideStory.title}
                </Title>

                {sideStory.image && (
                  <Image
                    src={sideStory.image}
                    radius={0}
                    mb="sm"
                    h={170}
                    fit="cover"
                    alt={sideStory.title}
                    style={{ border: `1px solid ${RULE}` }}
                  />
                )}

                <Text size="sm" style={{ lineHeight: 1.6 }} lineClamp={4}>
                  {sideStory.shortDescription}
                </Text>
                <ReadMore compact />
              </Box>
            )}

            <Title
              order={4}
              mb="md"
              style={{
                fontFamily: SERIF,
                fontWeight: 800,
                borderBottom: `2px solid ${INK}`,
                paddingBottom: 6,
                display: "inline-block",
                color: INK,
              }}
            >
              More Stories
            </Title>

            <Stack gap={0}>
              {moreStories.map((item, i) => (
                <Box
                  key={item.id}
                  className="story-block"
                  py="md"
                  style={{
                    cursor: "pointer",
                    borderBottom: i < moreStories.length - 1 ? `1px solid ${RULE}` : "none",
                  }}
                  onClick={() => openNews(item)}
                >
                  <Text
                    fw={700}
                    size="sm"
                    className="story-title"
                    style={{ fontFamily: SERIF, lineHeight: 1.3, color: INK }}
                  >
                    {item.title}
                  </Text>
                  <Text size="xs" c="dimmed" mt={4} lineClamp={2}>
                    {item.shortDescription}
                  </Text>
                  <ReadMore compact />
                </Box>
              ))}
            </Stack>
          </Grid.Col>
        </Grid>

        {/* ========== BOTTOM SECTION ========== */}
        <Divider my={40} size={2} color={INK} />

        <Title
          order={4}
          mb="lg"
          style={{
            fontFamily: SERIF,
            fontWeight: 800,
            borderBottom: `2px solid ${INK}`,
            paddingBottom: 6,
            display: "inline-block",
            color: INK,
          }}
        >
          Around the Edition
        </Title>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xl">
          {bottomNews.map((item) => (
            <Paper
              key={item.id}
              className="news-card"
              radius={0}
              withBorder
              p="md"
              style={{ cursor: "pointer", borderColor: RULE, background: "white" }}
              onClick={() => openNews(item)}
            >
              <Text
                fw={700}
                size="md"
                mb={6}
                style={{ fontFamily: SERIF, lineHeight: 1.25, color: INK }}
              >
                {item.title}
              </Text>
              <Text size="sm" c="dimmed" lineClamp={3}>
                {item.shortDescription}
              </Text>
              <ReadMore compact />
            </Paper>
          ))}
        </SimpleGrid>

        {/* Footer */}
        <Divider my={40} size={2} color={INK} />
        <Text ta="center" size="xs" c="dimmed" fw={600} style={{ fontFamily: "sans-serif", letterSpacing: 1 }}>
          © 2026 LiveUpdate24 · All rights reserved · Printed digitally
        </Text>
      </Container>
    </Box>
  );
}