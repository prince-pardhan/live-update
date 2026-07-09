export interface News {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  image: string;
  views: number;
}

export interface NewsState {
  news: News[];
  isLoading: boolean;
  error: string | null;
}