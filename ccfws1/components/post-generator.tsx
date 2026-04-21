"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ChatBot } from "@/components/chatbot";
import { Loader2, Copy, Check, Save } from "lucide-react";

type Platform = "linkedin" | "facebook" | "instagram" | "tiktok";

interface GeneratedPost {
  platform: Platform;
  content: string;
  imageUrl?: string;
  timestamp: number;
}

export function PostGenerator() {
  const [topic, setTopic] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([
    "linkedin",
  ]);
  const [generatedPosts, setGeneratedPosts] = useState<GeneratedPost[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
  const [showChat, setShowChat] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const platforms: { id: Platform; label: string; color: string }[] = [
    { id: "linkedin", label: "LinkedIn", color: "bg-blue-100 text-blue-800" },
    {
      id: "facebook",
      label: "Facebook",
      color: "bg-blue-100 text-blue-800",
    },
    {
      id: "instagram",
      label: "Instagram",
      color: "bg-pink-100 text-pink-800",
    },
    { id: "tiktok", label: "TikTok", color: "bg-black text-white" },
  ];

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const generatePosts = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic");
      return;
    }

    if (selectedPlatforms.length === 0) {
      alert("Please select at least one platform");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          platforms: selectedPlatforms,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate posts");
      }

      const data = await response.json();

      const newPosts: GeneratedPost[] = selectedPlatforms.map((platform) => {
        const postData = data[platform];
        return {
          platform,
          content: typeof postData === "string" ? postData : postData?.text || "",
          imageUrl: typeof postData === "object" ? postData?.imageUrl : undefined,
          timestamp: Date.now(),
        };
      });

      setGeneratedPosts(newPosts);

      const existingPostables = JSON.parse(
        localStorage.getItem("postables") || "{}"
      );
      selectedPlatforms.forEach((platform) => {
        if (!existingPostables[platform]) {
          existingPostables[platform] = [];
        }
        const postData = data[platform];
        existingPostables[platform].push({
          content: typeof postData === "string" ? postData : postData?.text || "",
          imageUrl: typeof postData === "object" ? postData?.imageUrl : undefined,
          timestamp: Date.now(),
        });
      });
      localStorage.setItem("postables", JSON.stringify(existingPostables));

      setChatMessages([
        {
          role: "assistant",
          content: `I've generated posts for ${selectedPlatforms.join(", ")}. Would you like me to help you refine any of these posts? You can ask me to make them shorter, more engaging, add emojis, or adjust the tone.`,
        },
      ]);
      setShowChat(true);
    } catch (error) {
      console.error("Error generating posts:", error);
      alert("Failed to generate posts. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const savePost = (post: GeneratedPost) => {
    const existingPostables = JSON.parse(
      localStorage.getItem("postables") || "{}"
    );
    if (!existingPostables[post.platform]) {
      existingPostables[post.platform] = [];
    }
    existingPostables[post.platform].push({
      content: post.content,
      timestamp: Date.now(),
    });
    localStorage.setItem("postables", JSON.stringify(existingPostables));
    alert("Post saved to collection!");
  };

  const handleChatMessage = (message: string): void => {
    setChatMessages((prev) => [...prev, { role: "user", content: message }]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Generate Social Media Posts
        </h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="topic" className="text-gray-700 dark:text-gray-300">
              Topic or Content Idea
            </Label>
            <Textarea
              id="topic"
              placeholder="Enter the topic you want to create posts about (e.g., 'Financial wellness tips for millennials', 'New retirement planning strategies')"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="mt-2 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              rows={4}
              ref={textareaRef}
            />
          </div>

          <div>
            <Label className="text-gray-700 dark:text-gray-300 block mb-3">
              Select Platforms
            </Label>
            <div className="flex flex-wrap gap-3">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedPlatforms.includes(platform.id)
                      ? `${platform.color} ring-2 ring-offset-2 ring-indigo-500`
                      : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 opacity-50"
                  }`}
                >
                  {platform.label}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={generatePosts}
            disabled={isGenerating}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Posts"
            )}
          </Button>
        </div>
      </div>

      {generatedPosts.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Generated Posts
          </h3>
          <div className="space-y-4">
            {generatedPosts.map((post, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-slate-700"
              >
                {post.imageUrl && (
                  <div className="relative w-full h-64 bg-gray-200 dark:bg-slate-600">
                    <img
                      src={post.imageUrl}
                      alt={`${post.platform} post image`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {platforms.find((p) => p.id === post.platform)?.label}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(post.content, index)}
                        className="dark:bg-slate-600 dark:border-slate-500"
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => savePost(post)}
                        className="dark:bg-slate-600 dark:border-slate-500"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {post.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {generatedPosts.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <button
            onClick={() => setShowChat(!showChat)}
            className="w-full text-left font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {showChat ? "Hide" : "Show"} AI Assistant
          </button>
          {showChat && (
            <ChatBot
              generatedPosts={generatedPosts}
              onMessage={handleChatMessage}
              messages={chatMessages}
            />
          )}
        </div>
      )}
    </div>
  );
}
