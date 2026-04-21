import { LoginForm } from "@/components/password-login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Capital Compass
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Financial & Wellness Services
            </p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-4 font-semibold">
              INTERNAL USE ONLY
            </p>
          </div>

          <LoginForm />

          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              <strong>Disclaimer:</strong> This program is for internal use only by Capital Compass Financial and Wellness Services. Unauthorized access is prohibited.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
