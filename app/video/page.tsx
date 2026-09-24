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

        const records = await base44.entities.News.list().catch((err) => {
          console.error("API error:", err);
          return [];
        });

        setNews(records as NewsItem[]);
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

  // Sidebar items (next 4 after featured)
  const sidebarNews = remainingNews.slice(0, 4);
  // Rest for Latest News grid
  const latestNews = remainingNews.slice(4);

  // Related news for article page
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

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const timeAgo = (dateStr?: string) => {
    if (!dateStr) return "";
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  // ====================== FULL SCREEN ARTICLE ======================
  if (selectedNews) {
    return (
      <Box style={{ minHeight: "100vh", background: "#ffffff" }}>
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
              <Text size="xl" fw={500} c="dark.6" style={{ lineHeight: 1.65 }}>
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

            {relatedNews.length > 0 && (
              <>
                <Divider my="xl" />
                <Box>
                  <Title order={3} fw={800} mb="lg" style={{ letterSpacing: -0.3 }}>
                    Related News
                  </Title>
                  <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
                    {relatedNews.map((item) => (
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
                              height={140}
                              alt={item.title}
                              fallbackSrc="https://placehold.co/600x400?text=News"
                            />
                          ) : (
                            <Box
                              h={140}
                              bg="gray.1"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <IconNews size={32} color="#ced4da" />
                            </Box>
                          )}
                        </Card.Section>

                        <Stack gap={6} mt="sm" style={{ flex: 1 }}>
                          <Group gap={6}>
                            {item.category && (
                              <Badge color="red" variant="light" size="xs" radius="sm">
                                {item.category}
                              </Badge>
                            )}
                          </Group>
                          <Text fw={700} size="sm" lineClamp={2} style={{ lineHeight: 1.4 }}>
                            {item.title}
                          </Text>
                          <Text size="xs" c="dimmed" mt="auto">
                            {formatDate(item.publishedAt)}
                          </Text>
                        </Stack>
                      </Card>
                    ))}
                  </SimpleGrid>
                </Box>
              </>
            )}
          </Stack>
        </Container>
      </Box>
    );
  }

  // ====================== MAIN PAGE ======================
  return (
    <Box style={{ minHeight: "100vh", background: "#ffffff" }}>
      {/* Breaking News Bar */}
      <Box
        style={{
          background: "#e03131",
          padding: "8px 0",
        }}
      >
        <Container size="lg">
          <Group gap="md" wrap="nowrap">
            <Badge
              color="dark"
              variant="filled"
              size="sm"
              radius="xs"
              leftSection={<IconFlame size={12} />}
              style={{ flexShrink: 0, background: "#1a1a1a" }}
            >
              BREAKING
            </Badge>
            <Text size="sm" c="white" fw={500} lineClamp={1} style={{ flex: 1 }}>
              {news.find((n) => n.isBreaking)?.title ||
                "Stay updated with the latest news from India and around the world"}
            </Text>
          </Group>
        </Container>
      </Box>

      {/* Header */}
      <Paper
        style={{
          position: "sticky",
          top: 0,
          zIndex: 200,
          background: "white",
          borderBottom: "1px solid #eee",
        }}
      >
        <Container size="lg" py="sm">
          <Group justify="space-between" align="center" wrap="nowrap" gap="md">
            {/* Logo */}
            <Group gap={8} style={{ cursor: "pointer", flexShrink: 0 }}>
              <Box
                w={10}
                h={10}
                style={{
                  background: "#e03131",
                  borderRadius: "50%",
                }}
              />
              <Title
                order={3}
                style={{
                  fontWeight: 800,
                  letterSpacing: -0.5,
                  fontSize: "1.35rem",
                  margin: 0,
                }}
              >
                LiveUpdate
                <span style={{ color: "#e03131" }}>24</span>
              </Title>
            </Group>

            {/* Search */}
            <Group gap="sm" style={{ flex: 1 }} justify="flex-end">
              <TextInput
                placeholder="Search news"
                leftSection={<IconSearch size={16} stroke={1.5} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
                radius="md"
                size="sm"
                styles={{
                  input: {
                    border: "1px solid #e0e0e0",
                    background: "#fafafa",
                  },
                }}
                style={{ maxWidth: 260, width: "100%" }}
                rightSection={
                  searchQuery ? (
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      onClick={() => setSearchQuery("")}
                      size="sm"
                    >
                      <IconX size={14} />
                    </ActionIcon>
                  ) : null
                }
              />
            </Group>
          </Group>
        </Container>

        {/* Categories */}
        <Box style={{ borderTop: "1px solid #f0f0f0" }}>
          <Group justify="flex-start" gap={12}>
            <Button component="a" href="/paper">
              Paper
            </Button>
            <Button component="a" href="/video">
              Video
            </Button>
          </Group>

          <Container size="lg">
            <ScrollArea type="never" offsetScrollbars={false}>
              <Group gap={8} wrap="nowrap" py={12}>
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={activeCategory === cat ? "filled" : "light"}
                    color={activeCategory === cat ? "red" : "gray"}
                    size="sm"
                    radius="md"
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      minWidth: 90,
                      height: 34,
                      fontWeight: activeCategory === cat ? 700 : 500,
                      fontSize: 13,
                      textTransform: "uppercase",
                      flexShrink: 0,
                    }}
                  >
                    {cat}
                  </Button>
                ))}
              </Group>
            </ScrollArea>
          </Container>
        </Box>
      </Paper>

      <Container size="lg" py={{ base: 20, sm: 28 }} pb={60}>
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
          <Stack gap={36}>
            {/* ========== HERO + SIDEBAR ========== */}
            {featuredNews && (
              <Box
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: 24,
                }}
                className="hero-grid"
              >
                {/* Left - Big Featured */}
                <Card
                  padding={0}
                  radius="md"
                  style={{
                    overflow: "hidden",
                    cursor: "pointer",
                    position: "relative",
                  }}
                  onClick={() => openNews(featuredNews)}
                >
                  <Box pos="relative">
                    {featuredNews.image ? (
                      <Image
                        src={featuredNews.image}
                        h={{ base: 280, sm: 420 }}
                        fit="cover"
                        alt={featuredNews.title}
                      />
                    ) : (
                      <Box
                        h={320}
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

                    <Box
                      pos="absolute"
                      bottom={0}
                      left={0}
                      right={0}
                      p={{ base: "md", sm: "xl" }}
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 55%, transparent 100%)",
                      }}
                    >
                      <Group gap={8} mb={10}>
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
                            style={{ background: "rgba(0,0,0,0.5)" }}
                          >
                            {featuredNews.category}
                          </Badge>
                        )}
                      </Group>

                      <Title
                        order={2}
                        c="white"
                        style={{
                          fontSize: "clamp(18px, 3.5vw, 28px)",
                          lineHeight: 1.3,
                          fontWeight: 800,
                        }}
                        lineClamp={3}
                      >
                        {featuredNews.title}
                      </Title>
                    </Box>
                  </Box>
                </Card>

                {/* Right - Sidebar list */}
                <Stack gap={0} style={{ borderLeft: "1px solid #f0f0f0" }} visibleFrom="md">
                  {sidebarNews.map((item, index) => (
                    <Box
                      key={item.id}
                      px="md"
                      py="sm"
                      style={{
                        cursor: "pointer",
                        borderBottom:
                          index < sidebarNews.length - 1 ? "1px solid #f0f0f0" : "none",
                        transition: "background 0.15s",
                      }}
                      onClick={() => openNews(item)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#fafafa";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <Group gap="sm" wrap="nowrap" align="flex-start">
                        {item.image ? (
                          <Image
                            src={item.image}
                            w={70}
                            h={55}
                            radius="sm"
                            fit="cover"
                            style={{ flexShrink: 0 }}
                          />
                        ) : (
                          <Box
                            w={70}
                            h={55}
                            bg="gray.1"
                            style={{
                              borderRadius: 4,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <IconNews size={22} color="#ced4da" />
                          </Box>
                        )}
                        <Box style={{ flex: 1, minWidth: 0 }}>
                          {item.category && (
                            <Text size="xs" c="red" fw={700} tt="uppercase" mb={2}>
                              {item.category}
                            </Text>
                          )}
                          <Text
                            size="sm"
                            fw={600}
                            lineClamp={2}
                            style={{ lineHeight: 1.35 }}
                          >
                            {item.title}
                          </Text>
                          <Text size="xs" c="dimmed" mt={4}>
                            {timeAgo(item.publishedAt)}
                          </Text>
                        </Box>
                      </Group>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            {/* Mobile sidebar */}
            <Stack gap="xs" hiddenFrom="md">
              {sidebarNews.map((item) => (
                <Card
                  key={item.id}
                  padding="sm"
                  radius="md"
                  withBorder
                  style={{ cursor: "pointer" }}
                  onClick={() => openNews(item)}
                >
                  <Group gap="sm" wrap="nowrap" align="flex-start">
                    {item.image ? (
                      <Image src={item.image} w={80} h={60} radius="sm" fit="cover" />
                    ) : (
                      <Box w={80} h={60} bg="gray.1" style={{ borderRadius: 4 }} />
                    )}
                    <Box style={{ flex: 1 }}>
                      {item.category && (
                        <Text size="xs" c="red" fw={700} tt="uppercase">
                          {item.category}
                        </Text>
                      )}
                      <Text size="sm" fw={600} lineClamp={2}>
                        {item.title}
                      </Text>
                      <Text size="xs" c="dimmed" mt={2}>
                        {timeAgo(item.publishedAt)}
                      </Text>
                    </Box>
                  </Group>
                </Card>
              ))}
            </Stack>

            {/* ========== LATEST NEWS ========== */}
            <Box>
              <Group justify="space-between" mb="md" align="flex-end">
                <Title
                  order={3}
                  fw={800}
                  style={{
                    letterSpacing: -0.3,
                    borderBottom: "3px solid #e03131",
                    paddingBottom: 6,
                    display: "inline-block",
                  }}
                >
                  LATEST NEWS
                </Title>
                <Text size="sm" c="red" fw={600} style={{ cursor: "pointer" }}>
                  ALL ›
                </Text>
              </Group>

              <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} spacing="lg">
                {(latestNews.length > 0 ? latestNews : remainingNews).map((item) => (
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
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      borderColor: "#eee",
                    }}
                    onClick={() => openNews(item)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,0.1)";
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
                          height={160}
                          alt={item.title}
                          fallbackSrc="https://placehold.co/600x400?text=News"
                        />
                      ) : (
                        <Box
                          h={160}
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

                    <Stack gap={6} mt="md" style={{ flex: 1 }}>
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

                      <Text fw={700} size="sm" lineClamp={2} style={{ lineHeight: 1.4 }}>
                        {item.title}
                      </Text>

                      <Text size="xs" c="dimmed" lineClamp={2}>
                        {item.shortDescription}
                      </Text>

                      <Group justify="space-between" mt="auto" pt={4}>
                        <Text size="xs" c="dimmed">
                          {timeAgo(item.publishedAt)}
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
          background: "#1a1a1a",
          padding: "28px 0",
          marginTop: 20,
        }}
      >
        <Container size="lg">
          <Group justify="space-between" wrap="wrap" gap="md">
            <Group gap={8}>
              <Box
                w={9}
                h={9}
                style={{ background: "#e03131", borderRadius: "50%" }}
              />
              <Text c="white" fw={700} size="lg">
                LiveUpdate
                <span style={{ color: "#fa5252" }}>24</span>
              </Text>
            </Group>
            <Text size="sm" c="dimmed">
              © 2026 LiveUpdate24 • Powered by Base44
            </Text>
          </Group>
        </Container>
      </Box>

      <style jsx global>{`
        @media (min-width: 992px) {
          .hero-grid {
            grid-template-columns: 1.6fr 1fr !important;
          }
        }
      `}</style>
    </Box>
  );
}