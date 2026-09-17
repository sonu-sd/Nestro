import ReviewForm from "@/components/website/reviews/ReviewForm";

export const metadata = { title: "Write a review | Nestro" };

export default async function WriteReviewPage({ searchParams }) {
  const { product } = await searchParams;
  return <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8B5E3C]">Your experience matters</p>
    <h1 className="mt-2 text-3xl font-semibold text-[#29211B]">Write a product review</h1>
    <p className="mt-3 text-sm leading-6 text-[#665548]">Choose a product, share an honest review, and our team will check it before publication. A delivered order is labelled as a verified purchase.</p>
    <ReviewForm initialProduct={typeof product === "string" ? product : ""} />
  </main>;
}
