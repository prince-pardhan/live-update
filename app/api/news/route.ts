import { NextResponse } from 'next/server';
import { getNews } from '@/lib/news';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10');
  
  try {
    const news = getNews(limit);
    return NextResponse.json({ 
      success: true, 
      data: news,
      total: news.length 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error fetching news' },
      { status: 500 }
    );
  }
}