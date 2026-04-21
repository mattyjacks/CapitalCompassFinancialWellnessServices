import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
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

    const messages: OpenAI.Messages.MessageParam[] = [
      ...conversationHistory.map((msg: Message) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      {
        role: "user" as const,
        content: message,
      },
    ];

    const response = await openai.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages,
    });

    const content = response.content[0];
    if (content.type !== "text") {
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
