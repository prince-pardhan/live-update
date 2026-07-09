import { NextResponse } from 'next/server';
import { getNewsById, updateNewsViews } from '@/lib/news';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const news = getNewsById(params.id);
    
    if (!news) {
      return NextResponse.json(
        { success: false, message: 'News not found' },
        { status: 404 }
      );
    }
    
    // Update views
    updateNewsViews(params.id);
    
    return NextResponse.json({ 
      success: true, 
      data: news 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error fetching news' },
      { status: 500 }
    );
  }
}