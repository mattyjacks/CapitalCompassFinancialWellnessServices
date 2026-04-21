"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PostGenerator } from "@/components/post-generator";
import { PostablesCollection } from "@/components/postables-collection";
import { ImagesCollection } from "@/components/images-collection";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const authenticated = localStorage.getItem("ccfws_authenticated");
    if (!authenticated) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("ccfws_authenticated");
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <nav className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Capital Compass
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Social Media Post Generator
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PostGenerator />
          </div>
          <div className="lg:col-span-1 space-y-8">
            <PostablesCollection />
            <ImagesCollection />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mt-8">
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-xs text-yellow-800 dark:text-yellow-200">
            <strong>Disclaimer:</strong> This program is for internal use only by Capital Compass Financial and Wellness Services. All generated content is proprietary and confidential.
          </p>
        </div>
      </div>
    </main>
  );
}
