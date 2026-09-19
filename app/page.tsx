"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Badge,
  Button,
  Card,
  Container,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Loader,
  Center,
  Box,
  TextInput,
  ActionIcon,
  Divider,
  Paper,
  ScrollArea,
} from "@mantine/core";
import {
  IconNews,
  IconSearch,
  IconCalendar,
  IconArrowLeft,
  IconX,
  IconFlame,
} from "@tabler/icons-react";
import { createClient } from "@base44/sdk";

// Base44 client
const base44 = createClient({
  appId: "6a9fc3ec7fb02e0fe4f0af78",
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
  slug?: string;
  status?: string;
  author?: string;
}

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const records = await base44.entities.News.filter(
          { status: "published" },
          "-publishedAt",
          50
        );
setNews(records as any[]);
      } catch (error) {
        console.error("News fetch error:", error);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(
      new Set(news.map((n) => n.category).filter(Boolean) as string[])
    );
    return ["All", ...cats];
  }, [news]);

  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        item.title?.toLowerCase().includes(q) ||
        item.shortDescription?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q);

      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [news, searchQuery, activeCategory]);

  const featuredNews =
    filteredNews.find((n) => n.isFeatured || n.isBreaking) || filteredNews[0];
  const remainingNews = filteredNews.filter((n) => n.id !== featuredNews?.id);

  const openNews = async (item: NewsItem) => {
    try {
      const fullRecord = await base44.entities.News.get(item.id);
      setSelectedNews(fullRecord);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSelectedNews(item);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const closeNews = () => setSelectedNews(null);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // ====================== FULL SCREEN ARTICLE ======================
  if (selectedNews) {
    return (
      <Box style={{ minHeight: "100vh", background: "#ffffff" }}>
        {/* Top Red Bar */}
        <Box
          style={{
            background: "linear-gradient(90deg, #c92a2a, #e03131)",
            padding: "10px 0",
          }}
        >
          <Container size="lg">
            <Group justify="space-between" wrap="nowrap">
              <Group gap="sm" style={{ flex: 1, minWidth: 0 }}>
                <Badge
                  color="white"
                  variant="filled"
                  c="red"
                  size="sm"
                  radius="sm"
                  style={{ flexShrink: 0 }}
                >
                  LIVE
                </Badge>
                <Text size="sm" c="white" fw={500} lineClamp={1}>
                  {selectedNews.title}
                </Text>
              </Group>
              <ActionIcon
                variant="subtle"
                color="white"
                onClick={closeNews}
                size="lg"
              >
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
            radius="xl"
          >
            Back to News
          </Button>

          <Stack gap="lg">
            <Group gap="sm">
              {selectedNews.category && (
                <Badge color="red" variant="light" size="lg" radius="sm">
                  {selectedNews.category}
                </Badge>
              )}
              {selectedNews.isBreaking && (
                <Badge
                  color="red"
                  size="lg"
                  radius="sm"
                  leftSection={<IconFlame size={14} />}
                >
                  BREAKING
                </Badge>
              )}
            </Group>

            <Title
              order={1}
              style={{
                fontSize: "clamp(26px, 5vw, 42px)",
                lineHeight: 1.2,
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
                <Text size="sm">By {selectedNews.author}</Text>
              )}
            </Group>

            {selectedNews.image && (
              <Image
                src={selectedNews.image}
                radius="md"
                alt={selectedNews.title}
                mah={440}
                fit="cover"
                style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
              />
            )}

            {selectedNews.shortDescription && (
              <Text
                size="xl"
                fw={500}
                c="dark.6"
                style={{ lineHeight: 1.65 }}
              >
                {selectedNews.shortDescription}
              </Text>
            )}

            <Divider my="sm" />

            <Text
              size="lg"
              style={{ whiteSpace: "pre-wrap", lineHeight: 1.85 }}
              dangerouslySetInnerHTML={{
                __html: (selectedNews.content || "").replace(/\n/g, "<br/>"),
              }}
            />
          </Stack>
        </Container>
      </Box>
    );
  }

  // ====================== MAIN PAGE ======================
  return (
    <Box style={{ minHeight: "100vh", background: "#f1f3f5" }}>
      {/* Breaking News Bar */}
      <Box
        style={{
          background: "linear-gradient(90deg, #c92a2a, #e03131)",
          padding: "9px 0",
        }}
      >
        <Container size="lg">
          <Group gap="md" wrap="nowrap">
            <Badge
              color="white"
              variant="filled"
              c="red"
              size="md"
              radius="sm"
              leftSection={<IconFlame size={13} />}
              style={{ flexShrink: 0 }}
            >
              BREAKING
            </Badge>
            <Text
              size="sm"
              c="white"
              fw={500}
              lineClamp={1}
              style={{ flex: 1 }}
            >
              {news.find((n) => n.isBreaking)?.title ||
                "Stay updated with the latest news from India and around the world"}
            </Text>
          </Group>
        </Container>
      </Box>

      {/* Sticky Header */}
      <Paper
        shadow="sm"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 200,
          background: "white",
        }}
      >
        <Container size="lg" py="md">
          <Group
            justify="space-between"
            mb="md"
            wrap="wrap"
            gap="md"
            align="center"
          >
            {/* Logo */}
            <Group gap={8} style={{ cursor: "pointer" }}>
              <Box
                w={11}
                h={11}
                style={{
                  background: "#e03131",
                  borderRadius: "50%",
                  boxShadow: "0 0 0 3px rgba(224,49,49,0.25)",
                }}
              />
              <Title
                order={2}
                style={{
                  fontWeight: 800,
                  letterSpacing: -0.8,
                  fontSize: "1.6rem",
                }}
              >
                LiveUpdate
                <span style={{ color: "#e03131" }}>24</span>
              </Title>
            </Group>

            {/* Search */}
            <TextInput
              placeholder="Search news..."
              leftSection={<IconSearch size={18} stroke={1.5} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              radius="xl"
              size="md"
              styles={{
                input: {
                  border: "1px solid #dee2e6",
                  background: "#f8f9fa",
                },
              }}
              style={{ flex: 1, maxWidth: 420 }}
              rightSection={
                searchQuery ? (
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    onClick={() => setSearchQuery("")}
                    size="sm"
                    radius="xl"
                  >
                    <IconX size={14} />
                  </ActionIcon>
                ) : null
              }
            />
          </Group>

          {/* Categories */}
          <ScrollArea type="never" offsetScrollbars={false}>
            <Group gap={8} wrap="nowrap" pb={2}>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? "filled" : "light"}
                  color={activeCategory === cat ? "red" : "gray"}
                  size="compact-sm"
                  radius="xl"
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    flexShrink: 0,
                    fontWeight: activeCategory === cat ? 600 : 500,
                  }}
                >
                  {cat}
                </Button>
              ))}
            </Group>
          </ScrollArea>
        </Container>
      </Paper>

      <Container size="lg" py={{ base: 24, sm: 36 }} pb={70}>
        {loading ? (
          <Center py={120}>
            <Stack align="center" gap="md">
              <Loader size="lg" color="red" type="dots" />
              <Text c="dimmed" size="sm">
                Loading latest news...
              </Text>
            </Stack>
          </Center>
        ) : filteredNews.length === 0 ? (
          <Center py={100}>
            <Stack align="center" gap="md">
              <ThemeIcon size={80} radius="xl" variant="light" color="gray">
                <IconNews size={40} />
              </ThemeIcon>
              <Text c="dimmed" size="lg" ta="center">
                No news found for &quot;{searchQuery || activeCategory}&quot;
              </Text>
              <Button
                variant="light"
                color="red"
                radius="xl"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
              >
                Clear filters
              </Button>
            </Stack>
          </Center>
        ) : (
          <Stack gap={40}>
            {/* Featured Hero Card */}
            {featuredNews && (
              <Card
                padding={0}
                radius="lg"
                shadow="md"
                style={{
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                }}
                onClick={() => openNews(featuredNews)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 16px 40px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                <Box pos="relative">
                  {featuredNews.image ? (
                    <Image
                      src={featuredNews.image}
                      h={320}
                      fit="cover"
                      alt={featuredNews.title}
                      style={{ minHeight: 240 }}
                    />
                  ) : (
                    <Box
                      h={280}
                      bg="gray.2"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <IconNews size={64} color="#adb5bd" />
                    </Box>
                  )}

                  {/* Dark Gradient Overlay */}
                  <Box
                    pos="absolute"
                    bottom={0}
                    left={0}
                    right={0}
                    p={{ base: "md", sm: "xl" }}
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
                      color: "white",
                    }}
                  >
                    <Group gap={8} mb={8}>
                      {featuredNews.isBreaking && (
                        <Badge color="red" size="sm" radius="sm">
                          BREAKING
                        </Badge>
                      )}
                      {featuredNews.category && (
                        <Badge
                          color="dark"
                          variant="filled"
                          size="sm"
                          radius="sm"
                        >
                          {featuredNews.category}
                        </Badge>
                      )}
                    </Group>

                    <Title
                      order={2}
                      c="white"
                      style={{
                        fontSize: "clamp(20px, 4vw, 34px)",
                        lineHeight: 1.25,
                        fontWeight: 800,
                      }}
                      lineClamp={3}
                    >
                      {featuredNews.title}
                    </Title>

                    <Text size="sm" c="gray.4" mt={8} visibleFrom="sm">
                      {formatDate(featuredNews.publishedAt)}
                    </Text>
                  </Box>
                </Box>
              </Card>
            )}

            {/* Latest News Section */}
            <Box>
              <Group justify="space-between" mb="lg" align="flex-end">
                <Title order={3} fw={800} style={{ letterSpacing: -0.3 }}>
                  Latest News
                </Title>
                <Text size="sm" c="dimmed">
                  {remainingNews.length} articles
                </Text>
              </Group>

              <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} spacing="lg">
                {remainingNews.map((item) => (
                  <Card
                    key={item.id}
                    padding="md"
                    radius="md"
                    withBorder
                    shadow="sm"
                    style={{
                      cursor: "pointer",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.22s ease, box-shadow 0.22s ease",
                      borderColor: "#e9ecef",
                    }}
                    onClick={() => openNews(item)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow =
                        "0 12px 28px rgba(0,0,0,0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "";
                    }}
                  >
                    <Card.Section>
                      {item.image ? (
                        <Image
                          src={item.image}
                          height={168}
                          alt={item.title}
                          fallbackSrc="https://placehold.co/600x400?text=News"
                        />
                      ) : (
                        <Box
                          h={168}
                          bg="gray.1"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <IconNews size={36} color="#ced4da" />
                        </Box>
                      )}
                    </Card.Section>

                    <Stack gap={8} mt="md" style={{ flex: 1 }}>
                      <Group gap={6}>
                        {item.category && (
                          <Badge color="red" variant="light" size="xs" radius="sm">
                            {item.category}
                          </Badge>
                        )}
                        {item.isBreaking && (
                          <Badge color="red" size="xs" radius="sm">
                            BREAKING
                          </Badge>
                        )}
                      </Group>

                      <Text
                        fw={700}
                        size="sm"
                        lineClamp={2}
                        style={{ lineHeight: 1.4 }}
                      >
                        {item.title}
                      </Text>

                      <Text size="xs" c="dimmed" lineClamp={2} style={{ lineHeight: 1.5 }}>
                        {item.shortDescription}
                      </Text>

                      <Group justify="space-between" mt="auto" pt={6}>
                        <Text size="xs" c="dimmed">
                          {formatDate(item.publishedAt)}
                        </Text>
                        <Text size="xs" c="red" fw={600}>
                          Read more →
                        </Text>
                      </Group>
                    </Stack>
                  </Card>
                ))}
              </SimpleGrid>
            </Box>
          </Stack>
        )}
      </Container>

      {/* Footer */}
      <Box
        style={{
          background: "#212529",
          padding: "32px 0",
          marginTop: 20,
        }}
      >
        <Container size="lg">
          <Group justify="space-between" wrap="wrap" gap="md">
            <Group gap={8}>
              <Box
                w={10}
                h={10}
                style={{
                  background: "#e03131",
                  borderRadius: "50%",
                }}
              />
              <a href="https://i24.base44.app" target="_blank" rel="noopener noreferrer">
                <Text c="white" fw={700} size="lg">
                  LiveUpdate
                  <span style={{ color: "#fa5252" }}>24</span>
                </Text>
              </a>
            </Group>
            <Text size="sm" c="dimmed">
              © 2026 LiveUpdate24 • Powered by Base44
            </Text>
          </Group>
        </Container>
      </Box>
    </Box>
  );
}