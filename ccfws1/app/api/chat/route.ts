import { NextRequest, NextResponse } from "next/server";

interface GeneratedPost {
  platform: string;
  content: string;
  timestamp: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const { message, posts, conversationHistory } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "OpenRouter API key not configured" },
        { status: 500 }
      );
    }

    const systemPrompt = `You are an AI assistant helping with social media content creation for Capital Compass Financial and Wellness Services. 
You have access to the generated posts and can help refine, edit, or improve them based on user requests.
You can suggest:
- Making posts shorter or longer
- Adding or removing emojis
- Changing the tone (more professional, more casual, etc.)
- Adding calls-to-action
- Improving hashtags
- Making content more engaging

Current generated posts:
${posts
  .map(
    (post: GeneratedPost) =>
      `${post.platform.toUpperCase()}: ${post.content}`
  )
  .join("\n\n")}

Be helpful, concise, and focused on improving social media content.`;

    const messages: Array<{ role: "user" | "assistant"; content: string }> = [
      ...conversationHistory.map((msg: Message) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      {
        role: "user" as const,
        content: message,
      },
    ];

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
        messages: messages,
        system: systemPrompt,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenRouter error:", response.status, errorData);
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.content?.[0];
    if (content?.type !== "text") {
      throw new Error("Unexpected response type");
    }

    return NextResponse.json({ response: content.text });
  } catch (error) {
    console.error("Error in chat:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}
