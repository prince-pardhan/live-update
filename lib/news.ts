import { News } from '@/types';

// Generate fake news data
const generateFakeNews = (): News[] => {
  const categories = ['Technology', 'Politics', 'Sports', 'Entertainment', 'Science', 'Health', 'Business'];
  const authors = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams', 'David Brown'];
  const titles = [
    'Breakthrough in Quantum Computing',
    'Global Summit on Climate Change',
    'New AI Model Surpasses Human Performance',
    'Major Breakthrough in Cancer Research',
    'SpaceX Successfully Launches New Satellite',
    'New Study Reveals Impact of Social Media on Mental Health',
    'Revolutionary Battery Technology Announced',
    'Global Economy Shows Signs of Recovery',
    'New Species Discovered in Amazon Rainforest',
    'Scientists Develop New Treatment for Alzheimer\'s'
  ];
  
  const summaries = [
    'Scientists have achieved a major breakthrough in quantum computing, potentially revolutionizing the field.',
    'World leaders gathered at the global summit to discuss urgent climate change measures.',
    'A new AI model has demonstrated capabilities surpassing human performance in key areas.',
    'Researchers have discovered a promising new treatment for cancer that shows remarkable results.',
    'SpaceX has successfully launched a new satellite into orbit, marking another milestone.',
    'A comprehensive study reveals the complex relationship between social media use and mental health.',
    'Innovative battery technology promises to revolutionize the energy storage industry.',
    'Economic indicators suggest a positive trend in global markets.',
    'A team of researchers has discovered a new species in the Amazon rainforest.',
    'Breakthrough in Alzheimer\'s research offers new hope for millions affected.'
  ];

  const contents = summaries.map(summary => 
    `${summary} This development represents a significant step forward in the field. 
    Experts from around the world have praised the breakthrough, noting its potential 
    to address some of the most pressing challenges. The research team is now planning 
    further studies to explore additional applications and improve existing methods. 
    This achievement is expected to have far-reaching implications for years to come.`
  );

  return Array.from({ length: 20 }, (_, index) => ({
    id: `news-${index + 1}`,
    title: titles[index % titles.length] + ` (${index + 1})`,
    summary: summaries[index % summaries.length],
    content: contents[index % contents.length],
    category: categories[index % categories.length],
    author: authors[index % authors.length],
    publishedAt: new Date(Date.now() - (index * 3600000 * Math.random() * 10)).toISOString(),
    image: `https://picsum.photos/seed/${index + 1}/800/400`,
    views: Math.floor(Math.random() * 1000000) + 1000
  }));
};

let newsData = generateFakeNews();

export const getNews = (limit?: number): News[] => {
  return limit ? newsData.slice(0, limit) : newsData;
};

export const getNewsById = (id: string): News | undefined => {
  return newsData.find(news => news.id === id);
};

export const addNews = (news: News): void => {
  newsData = [news, ...newsData];
};

export const updateNewsViews = (id: string): void => {
  const news = newsData.find(n => n.id === id);
  if (news) {
    news.views += 1;
  }
};