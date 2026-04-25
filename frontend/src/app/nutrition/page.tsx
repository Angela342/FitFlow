import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Navbar from "@/components/layout/Navbar";

export default function NutritionPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="mx-auto max-w-7xl p-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-gray-800">Nutrition</h1>
            <p className="text-sm text-gray-500">Track your meals and macros</p>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
