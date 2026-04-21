"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";

interface GeneratedImage {
  url: string;
  platform: string;
  timestamp: number;
}

type Platform = "linkedin" | "facebook" | "instagram" | "tiktok";

export function ImagesCollection() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | "all">(
    "all"
  );

  useEffect(() => {
    loadImages();
    const interval = setInterval(loadImages, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadImages = () => {
    const stored = localStorage.getItem("generatedImages");
    if (stored) {
      setImages(JSON.parse(stored));
    }
  };

  const deleteImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    localStorage.setItem("generatedImages", JSON.stringify(updated));
    
    const postables = JSON.parse(localStorage.getItem("postables") || "{}");
    const imageToDelete = images[index];
    
    Object.keys(postables).forEach((platform) => {
      if (Array.isArray(postables[platform])) {
        postables[platform] = postables[platform].filter(
          (post: any) => post.imageUrl !== imageToDelete.url
        );
      }
    });
    localStorage.setItem("postables", JSON.stringify(postables));
  };

  const downloadImage = async (url: string, platform: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${platform}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download image");
    }
  };

  const clearAllImages = () => {
    if (confirm("Are you sure you want to delete all images?")) {
      setImages([]);
      localStorage.setItem("generatedImages", JSON.stringify([]));
      
      const postables = JSON.parse(localStorage.getItem("postables") || "{}");
      Object.keys(postables).forEach((platform) => {
        if (Array.isArray(postables[platform])) {
          postables[platform] = postables[platform].filter(
            (post: any) => !post.imageUrl
          );
        }
      });
      localStorage.setItem("postables", JSON.stringify(postables));
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

  const filteredImages =
    selectedPlatform === "all"
      ? images
      : images.filter((img) => img.platform === selectedPlatform);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Generated Images
      </h2>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setSelectedPlatform("all")}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
            selectedPlatform === "all"
              ? "bg-indigo-600 text-white ring-2 ring-offset-2 ring-indigo-500"
              : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300"
          }`}
        >
          All <span className="ml-1 text-xs font-bold">({images.length})</span>
        </button>
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
              (
              {images.filter((img) => img.platform === platform.id).length})
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
        {filteredImages.length === 0 ? (
          <p className="col-span-full text-gray-500 dark:text-gray-400 text-sm text-center py-8">
            No images yet. Generate posts with images enabled!
          </p>
        ) : (
          filteredImages.map((image, index) => {
            const actualIndex = images.indexOf(image);
            return (
              <div
                key={actualIndex}
                className="relative group rounded-lg overflow-hidden bg-gray-200 dark:bg-slate-700 aspect-square"
              >
                <img
                  src={image.url}
                  alt={`${image.platform} image`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ccc' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='12' fill='%23999'%3EImage Error%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <Button
                    size="sm"
                    onClick={() => downloadImage(image.url, image.platform)}
                    className="bg-white text-gray-900 hover:bg-gray-100"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteImage(actualIndex)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                  <p className="text-xs text-white font-medium capitalize">
                    {image.platform}
                  </p>
                  <p className="text-xs text-gray-300">
                    {new Date(image.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {filteredImages.length > 0 && (
        <Button
          onClick={clearAllImages}
          variant="outline"
          className="w-full mt-4 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        >
          Clear All Images
        </Button>
      )}
    </div>
  );
}
