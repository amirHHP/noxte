import { AIAdvisor } from "@/components/AIAdvisor";

export default function AdvisorPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black text-gray-900">
          مشاور هوشمند هدیه
        </h1>
        <p className="mt-2 text-gray-500">
          نمی‌دانید چه بجی به همکارتان بدهید؟ AI کمکتان می‌کند
        </p>
      </div>
      <AIAdvisor />
    </div>
  );
}
