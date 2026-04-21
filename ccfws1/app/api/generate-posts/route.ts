import { NextRequest, NextResponse } from "next/server";

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

    const results: Record<string, { text: string; imageUrl?: string }> = {};

    for (const platform of platforms) {
      const prompt = `${platformPrompts[platform]}\n\nTopic: ${topic}`;

      const response = await fetch("https://openrouter.ai/api/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://capital-compass-post-generator.vercel.app",
          "X-Title": "Capital Compass Post Generator",
        },
        body: JSON.stringify({
          model: "anthropic/claude-3.5-sonnet",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error(
          `OpenRouter error for ${platform}:`,
          response.status,
          errorData
        );
        throw new Error(
          `Failed to generate ${platform} post: ${response.statusText}`
        );
      }

      const data = await response.json();
      const content = data.content?.[0];
      if (content?.type === "text") {
        results[platform] = { text: content.text };

        // Generate image for the post
        try {
          const imagePrompt = `Create a professional and engaging image for a ${platform} post about: ${topic}. The image should be visually appealing, relevant to the topic, and suitable for social media. Use vibrant colors and modern design.`;

          const imageResponse = await fetch(
            "https://openrouter.ai/api/v1/images/generations",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "HTTP-Referer":
                  "https://capital-compass-post-generator.vercel.app",
                "X-Title": "Capital Compass Post Generator",
              },
              body: JSON.stringify({
                model: "openai/dall-e-3",
                prompt: imagePrompt,
                size: platform === "instagram" ? "1024x1024" : "1024x768",
                quality: "standard",
                n: 1,
              }),
            }
          );

          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            if (imageData.data?.[0]?.url) {
              results[platform].imageUrl = imageData.data[0].url;
            }
          } else {
            console.warn(
              `Failed to generate image for ${platform}:`,
              imageResponse.status
            );
          }
        } catch (imageError) {
          console.warn(`Image generation error for ${platform}:`, imageError);
          // Continue without image if generation fails
        }
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
