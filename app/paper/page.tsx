"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Button,
  Container,
  Group,
  Image,
  Stack,
  Text,
  Title,
  Loader,
  Center,
  Box,
  TextInput,
  ActionIcon,
  Divider,
  ScrollArea,
} from "@mantine/core";
import {
  IconNews,
  IconSearch,
  IconCalendar,
  IconArrowLeft,
  IconX,
} from "@tabler/icons-react";
import { createClient } from "@base44/sdk";

// ========== SINGLE Base44 CLIENT ==========
const base44 = createClient({
  appId: "6aa8edc0e27445204a122451",
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
        const records = await base44.entities.News.list();
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

  const sidebarNews = remainingNews.slice(0, 6);
  const latestNews = remainingNews.slice(6);

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

  const today = new Date()
    .toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .toUpperCase();

  // ====================== FULL SCREEN ARTICLE ======================
  if (selectedNews) {
    return (
      <Box style={{ minHeight: "100vh", background: "#f8f1e3" }}>
        <Box style={{ background: "#1a1a1a", padding: "10px 0" }}>
          <Container size="md">
            <Group justify="space-between">
              <Text
                size="xs"
                c="white"
                fw={600}
                tt="uppercase"
                style={{ letterSpacing: 1.5, fontFamily: "Georgia, serif" }}
              >
                LiveUpdate24 • Full Story
              </Text>
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={closeNews}
                size="md"
              >
                <IconX size={18} color="white" />
              </ActionIcon>
            </Group>
          </Container>
        </Box>

        <Container size="md" py={{ base: 30, sm: 50 }}>
          <Button
            variant="subtle"
            color="dark"
            leftSection={<IconArrowLeft size={16} />}
            mb="xl"
            onClick={closeNews}
            radius={0}
            styles={{
              root: {
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1,
                fontFamily: "Georgia, serif",
              },
            }}
          >
            Back to Front Page
          </Button>

          <Stack gap="lg">
            {selectedNews.category && (
              <Text
                size="xs"
                fw={800}
                tt="uppercase"
                style={{
                  letterSpacing: 2,
                  color: "#1a1a1a",
                  fontFamily: "Georgia, serif",
                }}
              >
                {selectedNews.category}
                {selectedNews.isBreaking ? "  •  BREAKING" : ""}
              </Text>
            )}

            <Title
              order={1}
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "clamp(28px, 5vw, 42px)",
                lineHeight: 1.15,
                fontWeight: 800,
                color: "#1a1a1a",
              }}
            >
              {selectedNews.title}
            </Title>

            <Group gap="md" c="dimmed">
              <Group gap={6}>
                <IconCalendar size={15} />
                <Text size="sm" style={{ fontFamily: "Georgia, serif" }}>
                  {formatDate(selectedNews.publishedAt)}
                </Text>
              </Group>
              {selectedNews.author && (
                <Text size="sm" style={{ fontFamily: "Georgia, serif" }}>
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
                style={{ border: "1px solid #bbb" }}
              />
            )}

            {selectedNews.shortDescription && (
              <Text
                size="xl"
                fw={500}
                style={{
                  fontFamily: "Georgia, serif",
                  lineHeight: 1.6,
                  color: "#222",
                  borderLeft: "4px solid #1a1a1a",
                  paddingLeft: 16,
                }}
              >
                {selectedNews.shortDescription}
              </Text>
            )}

            <Divider my="sm" color="#1a1a1a" size={2} />

            <Text
              size="lg"
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                whiteSpace: "pre-wrap",
                lineHeight: 1.85,
                color: "#222",
              }}
              dangerouslySetInnerHTML={{
                __html: (selectedNews.content || "").replace(/\n/g, "<br/>"),
              }}
            />

            {relatedNews.length > 0 && (
              <Box my="xl">
                <Box
                  style={{
                    borderTop: "3px solid #1a1a1a",
                    borderBottom: "1px solid #1a1a1a",
                    padding: "10px 0",
                    marginBottom: 20,
                  }}
                >
                  <Title
                    order={3}
                    ta="center"
                    style={{
                      fontFamily: "Georgia, serif",
                      fontWeight: 800,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      fontSize: 18,
                    }}
                  >
                    Related Stories
                  </Title>
                </Box>

                <Stack gap={0}>
                  {relatedNews.map((item, index) => (
                    <Box
                      key={item.id}
                      py="md"
                      style={{
                        borderBottom:
                          index < relatedNews.length - 1
                            ? "1px solid #ccc"
                            : "none",
                        cursor: "pointer",
                      }}
                      onClick={() => openNews(item)}
                    >
                      <Group gap="md" wrap="nowrap" align="flex-start">
                        {item.image && (
                          <Image
                            src={item.image}
                            w={90}
                            h={70}
                            radius={0}
                            fit="cover"
                            style={{ flexShrink: 0, border: "1px solid #bbb" }}
                          />
                        )}
                        <Box style={{ flex: 1 }}>
                          {item.category && (
                            <Text
                              size="xs"
                              fw={700}
                              tt="uppercase"
                              mb={2}
                              style={{ letterSpacing: 1, color: "#1a1a1a" }}
                            >
                              {item.category}
                            </Text>
                          )}
                          <Text
                            fw={700}
                            size="sm"
                            lineClamp={2}
                            style={{
                              fontFamily: "Georgia, serif",
                              lineHeight: 1.35,
                              color: "#1a1a1a",
                            }}
                          >
                            {item.title}
                          </Text>
                          <Text size="xs" c="dimmed" mt={3}>
                            {formatDate(item.publishedAt)}
                          </Text>
                        </Box>
                      </Group>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        </Container>
      </Box>
    );
  }

  // ====================== MAIN NEWSPAPER PAGE ======================
  return (
    <Box style={{ minHeight: "100vh", background: "#f8f1e3" }}>
      {/* ====== MASTHEAD ====== */}
      <Box style={{ background: "#f8f1e3", paddingTop: 28, paddingBottom: 8 }}>
        <Container size="lg">
          <Box
            style={{
              borderTop: "3px solid #1a1a1a",
              borderBottom: "1px solid #1a1a1a",
              height: 8,
              marginBottom: 18,
            }}
          />

          <Title
            order={1}
            ta="center"
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 900,
              fontSize: "clamp(42px, 11vw, 92px)",
              letterSpacing: -2,
              margin: 0,
              color: "#1a1a1a",
              lineHeight: 0.9,
              textTransform: "uppercase",
            }}
          >
            LiveUpdate24
          </Title>

          <Group
            justify="center"
            gap="xl"
            mt={12}
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 13,
              letterSpacing: 1.5,
              color: "#1a1a1a",
              fontWeight: 600,
            }}
          >
            <Text size="sm" fw={600}>
              VOL. 1, NO. 01
            </Text>
            <Text size="sm">✦</Text>
            <Text size="sm" fw={600}>
              LIVEUPDATE24.COM
            </Text>
            <Text size="sm">✦</Text>
            <Text size="sm" fw={600}>
              {today}
            </Text>
          </Group>

          <Box
            style={{
              borderTop: "1px solid #1a1a1a",
              borderBottom: "3px solid #1a1a1a",
              height: 8,
              marginTop: 18,
            }}
          />
        </Container>
      </Box>

      {/* ====== SEARCH + CATEGORIES ====== */}
      <Box
        style={{
          position: "sticky",
          top: 0,
          zIndex: 200,
          background: "#f8f1e3",
          borderBottom: "1px solid #ccc",
        }}
      >
        <Container size="lg" py="sm">
          <Group justify="space-between" align="center" wrap="nowrap" gap="md">
            <TextInput
              placeholder="Search the paper..."
              leftSection={<IconSearch size={15} stroke={1.5} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              radius={0}
              size="sm"
              styles={{
                input: {
                  border: "1px solid #bbb",
                  background: "#fff",
                  fontFamily: "Georgia, serif",
                },
              }}
              style={{ maxWidth: 280, width: "100%" }}
              rightSection={
                searchQuery ? (
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    onClick={() => setSearchQuery("")}
                    size="sm"
                  >
                    <IconX size={13} />
                  </ActionIcon>
                ) : null
              }
            />
          </Group>
        </Container>

        <Box style={{ borderTop: "1px solid #ddd" }}>
          <Container size="lg">
            <ScrollArea type="never" offsetScrollbars={false}>
              <Group gap={0} wrap="nowrap" py={10}>
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant="subtle"
                    color="dark"
                    size="compact-sm"
                    radius={0}
                    onClick={() => setActiveCategory(cat)}
                    styles={{
                      root: {
                        fontWeight: activeCategory === cat ? 800 : 500,
                        fontSize: 12,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        borderBottom:
                          activeCategory === cat
                            ? "2px solid #1a1a1a"
                            : "2px solid transparent",
                        borderRadius: 0,
                        paddingLeft: 14,
                        paddingRight: 14,
                        fontFamily: "Georgia, serif",
                        color: "#1a1a1a",
                      },
                    }}
                  >
                    {cat}
                  </Button>
                ))}
              </Group>
            </ScrollArea>
          </Container>
        </Box>
      </Box>

      <Container size="lg" py={{ base: 24, sm: 32 }} pb={60}>
        {loading ? (
          <Center py={120}>
            <Stack align="center" gap="md">
              <Loader size="lg" color="dark" type="dots" />
              <Text
                c="dimmed"
                size="sm"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Setting the type...
              </Text>
            </Stack>
          </Center>
        ) : filteredNews.length === 0 ? (
          <Center py={100}>
            <Stack align="center" gap="md">
              <Text
                c="dimmed"
                size="lg"
                ta="center"
                style={{ fontFamily: "Georgia, serif" }}
              >
                No stories found for “{searchQuery || activeCategory}”
              </Text>
              <Button
                variant="outline"
                color="dark"
                radius={0}
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
              >
                Clear Filters
              </Button>
            </Stack>
          </Center>
        ) : (
          <Stack gap={36}>
            {/* ========== BREAKING NEWS HEADER ========== */}
            <Box>
              <Box
                style={{
                  borderTop: "3px solid #1a1a1a",
                  borderBottom: "1px solid #1a1a1a",
                  height: 8,
                  marginBottom: 8,
                }}
              />
              <Title
                order={2}
                ta="center"
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontWeight: 900,
                  fontSize: "clamp(26px, 5vw, 38px)",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  color: "#1a1a1a",
                  margin: "8px 0",
                }}
              >
                Breaking News
              </Title>
              <Box
                style={{
                  borderTop: "1px solid #1a1a1a",
                  borderBottom: "3px solid #1a1a1a",
                  height: 8,
                  marginTop: 8,
                }}
              />
            </Box>

            {/* ========== HERO STORY ========== */}
            {featuredNews && (
              <Box
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: 28,
                }}
                className="hero-grid"
              >
                {/* Left text */}
                <Box>
                  <Text
                    size="xs"
                    fw={800}
                    tt="uppercase"
                    mb={8}
                    style={{
                      letterSpacing: 1.5,
                      color: "#1a1a1a",
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    {featuredNews.category || "TOP STORY"}
                    {featuredNews.isBreaking ? "  •  BREAKING" : ""}
                  </Text>

                  <Title
                    order={2}
                    style={{
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontWeight: 800,
                      fontSize: "clamp(22px, 3.5vw, 32px)",
                      lineHeight: 1.2,
                      color: "#1a1a1a",
                      marginBottom: 14,
                      cursor: "pointer",
                    }}
                    onClick={() => openNews(featuredNews)}
                  >
                    {featuredNews.title}
                  </Title>

                  <Text
                    size="md"
                    style={{
                      fontFamily: "Georgia, serif",
                      lineHeight: 1.75,
                      color: "#222",
                      marginBottom: 18,
                    }}
                  >
                    {featuredNews.shortDescription ||
                      "Click to read the full story..."}
                  </Text>

                  {featuredNews.shortDescription && (
                    <Box
                      style={{
                        border: "2px solid #1a1a1a",
                        padding: "12px 16px",
                        marginBottom: 14,
                        background: "#fff",
                      }}
                    >
                      <Text
                        size="sm"
                        fw={600}
                        style={{
                          fontFamily: "Georgia, serif",
                          fontStyle: "italic",
                          lineHeight: 1.5,
                          color: "#1a1a1a",
                        }}
                      >
                        “
                        {featuredNews.shortDescription.length > 90
                          ? featuredNews.shortDescription.slice(0, 90) + "..."
                          : featuredNews.shortDescription}
                        ”
                      </Text>
                    </Box>
                  )}

                  <Text
                    size="sm"
                    fw={700}
                    style={{
                      fontFamily: "Georgia, serif",
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      cursor: "pointer",
                      color: "#1a1a1a",
                    }}
                    onClick={() => openNews(featuredNews)}
                  >
                    Continue Reading →
                  </Text>
                </Box>

                {/* Right image */}
                <Box
                  style={{ cursor: "pointer" }}
                  onClick={() => openNews(featuredNews)}
                >
                  {featuredNews.image ? (
                    <Image
                      src={featuredNews.image}
                      radius={0}
                      alt={featuredNews.title}
                      style={{
                        width: "100%",
                        height: "auto",
                        maxHeight: 360,
                        objectFit: "cover",
                        border: "1px solid #bbb",
                      }}
                    />
                  ) : (
                    <Box
                      h={300}
                      bg="#e8e0d0"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #bbb",
                      }}
                    >
                      <IconNews size={48} color="#999" />
                    </Box>
                  )}
                  <Text
                    size="xs"
                    c="dimmed"
                    mt={6}
                    style={{
                      fontFamily: "Georgia, serif",
                      fontStyle: "italic",
                    }}
                  >
                    {formatDate(featuredNews.publishedAt)}
                    {featuredNews.author
                      ? ` • By ${featuredNews.author}`
                      : ""}
                  </Text>
                </Box>
              </Box>
            )}

            {/* ========== ALSO ON THE FRONT ========== */}
            {sidebarNews.length > 0 && (
              <Box>
                <Box
                  style={{
                    borderTop: "2px solid #1a1a1a",
                    borderBottom: "1px solid #1a1a1a",
                    padding: "8px 0",
                    marginBottom: 12,
                  }}
                >
                  <Text
                    size="sm"
                    fw={800}
                    tt="uppercase"
                    style={{
                      letterSpacing: 2,
                      fontFamily: "Georgia, serif",
                      color: "#1a1a1a",
                    }}
                  >
                    Also on the Front Page
                  </Text>
                </Box>

                <Stack gap={0}>
                  {sidebarNews.map((item, index) => (
                    <Box
                      key={item.id}
                      py="sm"
                      style={{
                        borderBottom:
                          index < sidebarNews.length - 1
                            ? "1px solid #ccc"
                            : "none",
                        cursor: "pointer",
                      }}
                      onClick={() => openNews(item)}
                    >
                      <Group gap="md" wrap="nowrap" align="flex-start">
                        {item.image && (
                          <Image
                            src={item.image}
                            w={85}
                            h={65}
                            radius={0}
                            fit="cover"
                            style={{ flexShrink: 0, border: "1px solid #bbb" }}
                          />
                        )}
                        <Box style={{ flex: 1 }}>
                          {item.category && (
                            <Text
                              size="xs"
                              fw={700}
                              tt="uppercase"
                              mb={2}
                              style={{ letterSpacing: 0.8, color: "#1a1a1a" }}
                            >
                              {item.category}
                            </Text>
                          )}
                          <Text
                            size="sm"
                            fw={700}
                            lineClamp={2}
                            style={{
                              fontFamily: "Georgia, serif",
                              lineHeight: 1.3,
                              color: "#1a1a1a",
                            }}
                          >
                            {item.title}
                          </Text>
                          <Text size="xs" c="dimmed" mt={3}>
                            {timeAgo(item.publishedAt)}
                          </Text>
                        </Box>
                      </Group>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            {/* ========== LATEST STORIES ========== */}
            <Box>
              <Box
                style={{
                  borderTop: "3px solid #1a1a1a",
                  borderBottom: "1px solid #1a1a1a",
                  padding: "10px 0",
                  marginBottom: 8,
                }}
              >
                <Title
                  order={3}
                  ta="center"
                  style={{
                    fontFamily: "Georgia, serif",
                    fontWeight: 900,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    fontSize: 20,
                    color: "#1a1a1a",
                  }}
                >
                  Latest Stories
                </Title>
              </Box>

              <Stack gap={0}>
                {(latestNews.length > 0 ? latestNews : remainingNews).map(
                  (item) => (
                    <Box
                      key={item.id}
                      py="md"
                      style={{
                        borderBottom: "1px solid #ccc",
                        cursor: "pointer",
                      }}
                      onClick={() => openNews(item)}
                    >
                      <Group gap="md" wrap="nowrap" align="flex-start">
                        {item.image && (
                          <Image
                            src={item.image}
                            w={110}
                            h={80}
                            radius={0}
                            fit="cover"
                            style={{ flexShrink: 0, border: "1px solid #bbb" }}
                          />
                        )}
                        <Box style={{ flex: 1 }}>
                          {item.category && (
                            <Text
                              size="xs"
                              fw={700}
                              tt="uppercase"
                              mb={3}
                              style={{ letterSpacing: 0.8, color: "#1a1a1a" }}
                            >
                              {item.category}
                            </Text>
                          )}
                          <Text
                            fw={700}
                            size="md"
                            lineClamp={2}
                            style={{
                              fontFamily: "Georgia, serif",
                              lineHeight: 1.3,
                              color: "#1a1a1a",
                              marginBottom: 4,
                            }}
                          >
                            {item.title}
                          </Text>
                          {item.shortDescription && (
                            <Text
                              size="sm"
                              c="dimmed"
                              lineClamp={2}
                              style={{
                                fontFamily: "Georgia, serif",
                                lineHeight: 1.5,
                              }}
                            >
                              {item.shortDescription}
                            </Text>
                          )}
                          <Text
                            size="xs"
                            c="dimmed"
                            mt={6}
                            style={{ fontFamily: "Georgia, serif" }}
                          >
                            {timeAgo(item.publishedAt)}
                          </Text>
                        </Box>
                      </Group>
                    </Box>
                  )
                )}
              </Stack>
            </Box>
          </Stack>
        )}
      </Container>

      {/* ====== FOOTER ====== */}
      <Box
        style={{
          background: "#1a1a1a",
          padding: "22px 0",
          marginTop: 40,
        }}
      >
        <Container size="lg">
          <Group justify="space-between" wrap="wrap" gap="md">
            <Text
              c="#f8f1e3"
              fw={800}
              size="lg"
              style={{ fontFamily: "Georgia, serif" }}
            >
              LiveUpdate24
            </Text>
            <Text
              size="sm"
              c="#aaa"
              style={{ fontFamily: "Georgia, serif" }}
            >
              © 2026 LiveUpdate24 • Powered by Base44
            </Text>
          </Group>
        </Container>
      </Box>

      <style jsx global>{`
        @media (min-width: 900px) {
          .hero-grid {
            grid-template-columns: 1.2fr 0.8fr !important;
          }
        }
      `}</style>
    </Box>
  );
}