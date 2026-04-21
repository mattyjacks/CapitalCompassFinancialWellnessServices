"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Trash2 } from "lucide-react";

interface Postable {
  content: string;
  imageUrl?: string;
  timestamp: number;
}

type Platform = "linkedin" | "facebook" | "instagram" | "tiktok";

export function PostablesCollection() {
  const [postables, setPostables] = useState<Record<Platform, Postable[]>>({
    linkedin: [],
    facebook: [],
    instagram: [],
    tiktok: [],
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("linkedin");

  useEffect(() => {
    loadPostables();
    const interval = setInterval(loadPostables, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadPostables = () => {
    const stored = localStorage.getItem("postables");
    if (stored) {
      setPostables(JSON.parse(stored));
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deletePostable = (platform: Platform, index: number) => {
    const updated = { ...postables };
    updated[platform].splice(index, 1);
    setPostables(updated);
    localStorage.setItem("postables", JSON.stringify(updated));
  };

  const clearAllPostables = () => {
    if (
      confirm(
        `Are you sure you want to delete all ${selectedPlatform} postables?`
      )
    ) {
      const updated = { ...postables };
      updated[selectedPlatform] = [];
      setPostables(updated);
      localStorage.setItem("postables", JSON.stringify(updated));
    }
  };

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

  const currentPostables = postables[selectedPlatform] || [];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 sticky top-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Postables Collection
      </h2>

      <div className="flex flex-wrap gap-2 mb-4">
        {platforms.map((platform) => (
          <button
            key={platform.id}
            onClick={() => setSelectedPlatform(platform.id)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              selectedPlatform === platform.id
                ? `${platform.color} ring-2 ring-offset-2 ring-indigo-500`
                : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            {platform.label}
            <span className="ml-1 text-xs font-bold">
              ({postables[platform.id]?.length || 0})
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {currentPostables.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
            No postables yet. Generate some posts to get started!
          </p>
        ) : (
          currentPostables.map((postable, index) => {
            const id = `${selectedPlatform}-${index}`;
            return (
              <div
                key={id}
                className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-slate-700 group hover:shadow-md transition-shadow"
              >
                {postable.imageUrl && (
                  <div className="relative w-full h-32 bg-gray-200 dark:bg-slate-600">
                    <img
                      src={postable.imageUrl}
                      alt="postable"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(postable.timestamp).toLocaleDateString()}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          copyToClipboard(postable.content, id)
                        }
                        className="h-6 w-6 p-0 dark:hover:bg-slate-600"
                      >
                        {copiedId === id ? (
                          <Check className="w-3 h-3 text-green-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deletePostable(selectedPlatform, index)}
                        className="h-6 w-6 p-0 dark:hover:bg-slate-600"
                      >
                        <Trash2 className="w-3 h-3 text-red-600" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-3">
                    {postable.content}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {currentPostables.length > 0 && (
        <Button
          onClick={clearAllPostables}
          variant="outline"
          className="w-full mt-4 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        >
          Clear All
        </Button>
      )}
    </div>
  );
}
