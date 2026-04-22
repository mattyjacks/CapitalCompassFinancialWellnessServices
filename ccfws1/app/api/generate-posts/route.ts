import { NextRequest, NextResponse } from "next/server";

const IMAGE_STYLES = {
  professional: "Professional and corporate style with clean design",
  vibrant: "Vibrant and colorful with modern aesthetics",
  minimalist: "Minimalist design with simple elegant elements",
  abstract: "Abstract artistic style with creative elements",
  illustration: "Hand-drawn illustration style",
  photography: "High-quality photography style",
  gradient: "Gradient background with modern design",
  retro: "Retro vintage style with classic elements",
  neon: "Neon glowing style with dark background",
  flat: "Flat design style with bold colors",
};

export async function POST(request: NextRequest) {
  try {
    const { topic, platforms, generateImage, imageStyle, postLengthMode, postLength } = await request.json();

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

    const getOptimalLength = (platform: string): number => {
      const lengths: Record<string, number> = {
        linkedin: 200,
        facebook: 150,
        instagram: 120,
        tiktok: 80,
      };
      return lengths[platform] || 150;
    };

    const results: Record<string, { text: string; imageUrl?: string }> = {};

    for (const platform of platforms) {
      const length = postLengthMode === "auto" ? getOptimalLength(platform) : postLength;
      
      const platformPrompts: Record<string, string> = {
        linkedin:
          `Create a professional, insightful LinkedIn post (approximately ${length} characters) about the following topic. Include relevant hashtags and maintain a professional tone suitable for business professionals.`,
        facebook:
          `Create an engaging Facebook post (approximately ${length} characters) about the following topic. Make it conversational and relatable. Include relevant emojis and hashtags.`,
        instagram:
          `Create a captivating Instagram caption (approximately ${length} characters) about the following topic. Include relevant hashtags (5-10) and emojis. Make it visually descriptive.`,
        tiktok:
          `Create a trendy TikTok caption (approximately ${length} characters) about the following topic. Use trending language, hashtags, and emojis. Make it catchy and shareable.`,
      };

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
          model: "anthropic/claude-4.5-haiku",
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

        if (generateImage && process.env.OPENAI_API_KEY) {
          try {
            const styleDescription =
              IMAGE_STYLES[imageStyle as keyof typeof IMAGE_STYLES] ||
              IMAGE_STYLES.professional;
            const imagePrompt = `Create an image for a ${platform} social media post about: ${topic}. Style: ${styleDescription}. The image should be visually appealing, relevant to the topic, and suitable for social media. No text in the image.`;

            // DALL-E 3 only supports: 1024x1024, 1024x1792, 1792x1024
            const size =
              platform === "instagram"
                ? "1024x1024"
                : platform === "tiktok"
                  ? "1024x1792"
                  : "1792x1024";

            const imageResponse = await fetch(
              "https://api.openai.com/v1/images/generations",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                  model: "dall-e-3",
                  prompt: imagePrompt,
                  size: size,
                  quality: "standard",
                  n: 1,
                }),
              }
            );

            if (imageResponse.ok) {
              const imageData = await imageResponse.json();
              console.log(`Image response for ${platform}:`, JSON.stringify(imageData).substring(0, 200));
              if (imageData.data?.[0]?.url) {
                results[platform].imageUrl = imageData.data[0].url;
              } else {
                console.warn(
                  `No image URL in response for ${platform}:`,
                  JSON.stringify(imageData)
                );
              }
            } else {
              const errorText = await imageResponse.text();
              console.warn(
                `Failed to generate image for ${platform}:`,
                imageResponse.status,
                errorText
              );
            }
          } catch (imageError) {
            console.warn(
              `Image generation error for ${platform}:`,
              imageError
            );
          }
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
