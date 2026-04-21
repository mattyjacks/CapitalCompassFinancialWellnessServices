import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(request: NextRequest) {
  try {
    const { topic, platforms } = await request.json();

    if (!topic || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: "Topic and platforms are required" },
        { status: 400 }
      );
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "OpenRouter API key not configured" },
        { status: 500 }
      );
    }

    const platformPrompts: Record<string, string> = {
      linkedin:
        "Create a professional, insightful LinkedIn post (150-200 words) about the following topic. Include relevant hashtags and maintain a professional tone suitable for business professionals.",
      facebook:
        "Create an engaging Facebook post (100-150 words) about the following topic. Make it conversational and relatable. Include relevant emojis and hashtags.",
      instagram:
        "Create a captivating Instagram caption (80-150 characters) about the following topic. Include relevant hashtags (5-10) and emojis. Make it visually descriptive.",
      tiktok:
        "Create a trendy TikTok caption (50-100 characters) about the following topic. Use trending language, hashtags, and emojis. Make it catchy and shareable.",
    };

    const results: Record<string, string> = {};

    for (const platform of platforms) {
      const prompt = `${platformPrompts[platform]}\n\nTopic: ${topic}`;

      const message = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const content = message.content[0];
      if (content.type === "text") {
        results[platform] = content.text;
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error generating posts:", error);
    return NextResponse.json(
      { error: "Failed to generate posts" },
      { status: 500 }
    );
  }
}
