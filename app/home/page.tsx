"use client";

import { useEffect, useState } from "react";
import {
  MantineProvider,
  createTheme,
  AppShell,
  Container,
  Title,
  Text,
  Card,
  SimpleGrid,
  Image,
  Badge,
  Group,
  Stack,
  Skeleton,
  Alert,
  Button,
  ThemeIcon,
  Box,
  ActionIcon,
  ColorSchemeScript,
  Divider,
  ScrollArea,
} from "@mantine/core";
import {
  IconNews,
  IconRefresh,
  IconAlertCircle,
  IconSun,
  IconMoon,
  IconArrowLeft,
  IconCalendar,
  IconUser,
} from "@tabler/icons-react";
import { createClient } from "@base44/sdk";
import "@mantine/core/styles.css";

// ---------- Types ----------
interface NewsArticle {
  id: string;
  title?: string;
  content?: string;
  summary?: string;
  imageUrl?: string;
  author?: string;
  publishedAt?: string;
  created_date?: string;
  [key: string]: any;
}

// ---------- Theme ----------
const theme = createTheme({
  primaryColor: "blue",
  fontFamily: "Inter, system-ui, sans-serif",
  defaultRadius: "md",
  headings: {
    fontFamily: "Inter, system-ui, sans-serif",
    sizes: {
      h1: { fontSize: "2rem", lineHeight: "1.3" },
      h2: { fontSize: "1.5rem", lineHeight: "1.35" },
      h3: { fontSize: "1.25rem", lineHeight: "1.4" },
      h4: { fontSize: "1.1rem", lineHeight: "1.45" },
    },
  },
});

// ---------- Base44 Client ----------
const base44 = createClient({
  appId: process.env.NEXT_PUBLIC_BASE44_APP_ID || "6ac47ab69017eaaaca59d2b6",
  token: process.env.NEXT_PUBLIC_BASE44_TOKEN,
});

// ---------- Main Component ----------
function NewsApp() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("light");
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const records = await base44.entities.NewsArticle.list("-created_date", 50);
setArticles(Array.isArray(records) ? (records as any[]) : []);    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to fetch articles from Base44");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const toggleColorScheme = () => {
    setColorScheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // ===================== FULL ARTICLE PAGE =====================
  if (selectedArticle) {
    const article = selectedArticle;
    return (
      <MantineProvider theme={theme} forceColorScheme={colorScheme}>
        <ColorSchemeScript />
        <AppShell header={{ height: 60 }} padding="md">
          <AppShell.Header>
            <Container size="md" h="100%">
              <Group justify="space-between" h="100%">
                <Button
                  variant="subtle"
                  leftSection={<IconArrowLeft size={18} />}
                  onClick={() => setSelectedArticle(null)}
                >
                  Back to News
                </Button>
                <ActionIcon
                  variant="subtle"
                  size="lg"
                  onClick={toggleColorScheme}
                  aria-label="Toggle theme"
                >
                  {colorScheme === "dark" ? (
                    <IconSun size={18} />
                  ) : (
                    <IconMoon size={18} />
                  )}
                </ActionIcon>
              </Group>
            </Container>
          </AppShell.Header>

          <AppShell.Main>
            <Container size="md" py="xl">
              {/* Heading */}
              <Stack gap="md" mb="xl">
                <Badge variant="light" size="lg" w="fit-content">
                  News Article
                </Badge>

                <Title order={1} style={{ lineHeight: 1.25 }}>
                  {article.title || "Untitled"}
                </Title>

                <Group gap="lg" c="dimmed">
                  {article.author && (
                    <Group gap={6}>
                      <IconUser size={16} />
                      <Text size="sm">{article.author}</Text>
                    </Group>
                  )}
                  {(article.publishedAt || article.created_date) && (
                    <Group gap={6}>
                      <IconCalendar size={16} />
                      <Text size="sm">
                        {formatDate(article.publishedAt || article.created_date)}
                      </Text>
                    </Group>
                  )}
                </Group>
              </Stack>

              {/* Cover Image */}
              {article.imageUrl && (
                <Box mb="xl" style={{ borderRadius: 12, overflow: "hidden" }}>
                  <Image
                    src={article.imageUrl}
                    alt={article.title || "News"}
                    radius="md"
                    fallbackSrc="https://placehold.co/800x400?text=No+Image"
                  />
                </Box>
              )}

              <Divider mb="xl" />

              {/* Full Content */}
              <Box
                style={{
                  fontSize: "1.05rem",
                  lineHeight: 1.75,
                  whiteSpace: "pre-wrap",
                }}
              >
                {article.summary && (
                  <>
                    <Title order={3} mb="sm">
                      Summary
                    </Title>
                    <Text size="lg" mb="xl" c="dimmed">
                      {article.summary}
                    </Text>
                  </>
                )}

                <Title order={3} mb="sm">
                  Full Article
                </Title>
                <Text component="div">
                  {article.content || article.summary || "No content available."}
                </Text>
              </Box>

              {/* Back button bottom */}
              <Group mt={48} justify="center">
                <Button
                  variant="light"
                  size="md"
                  leftSection={<IconArrowLeft size={18} />}
                  onClick={() => setSelectedArticle(null)}
                >
                  Back to all news
                </Button>
              </Group>
            </Container>
          </AppShell.Main>
        </AppShell>
      </MantineProvider>
    );
  }

  // ===================== LIST PAGE =====================
  return (
    <MantineProvider theme={theme} forceColorScheme={colorScheme}>
      <ColorSchemeScript />
      <AppShell header={{ height: 60 }} padding="md">
        {/* Header */}
        <AppShell.Header>
          <Container size="lg" h="100%">
            <Group justify="space-between" h="100%">
              <Group gap="xs">
                
                
              </Group>

              <Group gap="xs">
                <ActionIcon
                  variant="subtle"
                  size="lg"
                  onClick={toggleColorScheme}
                  aria-label="Toggle theme"
                >
                  {colorScheme === "dark" ? (
                    <IconSun size={18} />
                  ) : (
                    <IconMoon size={18} />
                  )}
                </ActionIcon>
                <Button
                  leftSection={<IconRefresh size={16} />}
                  variant="light"
                  size="sm"
                  onClick={fetchArticles}
                  loading={loading}
                >
                  Refresh
                </Button>
              </Group>
            </Group>
          </Container>
        </AppShell.Header>

        {/* Main Content */}
        <AppShell.Main>
          <Container size="lg" py="md">
            {/* Page Heading */}
            

            {error && (
              <Alert
                icon={<IconAlertCircle size={16} />}
                title="Error"
                color="red"
                mb="lg"
                withCloseButton
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            )}

            {loading ? (
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} padding="lg" radius="md" withBorder>
                    <Skeleton height={160} mb="md" radius="md" />
                    <Skeleton height={20} mb="sm" width="80%" />
                    <Skeleton height={14} mb="xs" />
                    <Skeleton height={14} width="60%" />
                  </Card>
                ))}
              </SimpleGrid>
            ) : articles.length === 0 ? (
              <Box ta="center" py={80}>
                <ThemeIcon size={64} radius="xl" variant="light" mb="md">
                  <IconNews size={32} />
                </ThemeIcon>
                <Title order={3} mb="xs">
                  No articles found
                </Title>
                <Text c="dimmed" mb="lg">
                  Base44 se koi NewsArticle nahi mila.
                </Text>
                <Button onClick={fetchArticles}>Try again</Button>
              </Box>
            ) : (
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                {articles.map((article) => (
                  <Card
                    key={article.id}
                    padding="lg"
                    radius="md"
                    withBorder
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Card.Section>
                      {article.imageUrl ? (
                        <Image
                          src={article.imageUrl}
                          height={180}
                          alt={article.title || "News"}
                          fallbackSrc="https://placehold.co/600x400?text=No+Image"
                        />
                      ) : (
                        <Box
                          h={180}
                          bg="var(--mantine-color-gray-1)"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <IconNews
                            size={48}
                            color="var(--mantine-color-gray-5)"
                          />
                        </Box>
                      )}
                    </Card.Section>

                    <Stack gap="xs" mt="md" style={{ flex: 1 }}>
                      <Group justify="space-between" wrap="nowrap">
                        <Badge variant="light" size="sm">
                          News
                        </Badge>
                        {(article.publishedAt || article.created_date) && (
                          <Text size="xs" c="dimmed">
                            {formatDate(
                              article.publishedAt || article.created_date
                            )}
                          </Text>
                        )}
                      </Group>

                      {/* Card Heading */}
                      <Title order={4} lineClamp={2}>
                        {article.title || "Untitled"}
                      </Title>

                      <Text size="sm" c="dimmed" lineClamp={3}>
                        {article.summary ||
                          article.content ||
                          "No description available."}
                      </Text>

                      {article.author && (
                        <Text size="xs" c="dimmed">
                          By {article.author}
                        </Text>
                      )}

                      {/* Read More Button */}
                      <Button
                        variant="light"
                        fullWidth
                        mt="auto"
                        onClick={() => setSelectedArticle(article)}
                      >
                        Read More
                      </Button>
                    </Stack>
                  </Card>
                ))}
              </SimpleGrid>
            )}
          </Container>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}

// ---------- Export ----------
export default function Page() {
  return <NewsApp />;
}