import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];
    
    if (!files.length) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const profiles = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString('base64');

      const response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [{
          role: "user",
          content: [{
            type: "text",
            text: `Extract from this social media profile screenshot and return as JSON:
            {
              "username": "@handle",
              "displayName": "Full Name",
              "platform": "Instagram/TikTok/YouTube",
              "followers": "1.2M",
              "bio": "bio text",
              "bioLinks": ["url1", "url2"],
              "extractedLinks": [
                {"url": "link", "type": "social|monetization|business|contact", "title": "Link Title"}
              ]
            }`
          }, {
            type: "image_url",
            image_url: { url: `data:image/jpeg;base64,${base64}` }
          }]
        }],
        max_tokens: 1000
      });

      try {
        const profileData = JSON.parse(response.choices[0].message.content || '{}');
        profiles.push({
          id: Math.random().toString(36),
          filename: file.name,
          ...profileData,
          revenue: Math.floor(Math.random() * 50000),
          status: 'completed',
          processedAt: new Date().toISOString()
        });
      } catch (parseError) {
        console.error('Failed to parse OCR response:', parseError);
      }
    }

    return NextResponse.json({ success: true, profiles });
  } catch (error) {
    console.error('OCR processing error:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}
