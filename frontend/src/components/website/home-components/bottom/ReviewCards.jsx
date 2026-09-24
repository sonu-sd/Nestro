import Link from "next/link";

export default function ReviewCards({ reviews = [] }) {
  return (
    <div className="mt-6">
      {reviews.length ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {reviews.map((item) => (
            <article
              key={item._id}
              className="flex h-full flex-col rounded-2xl border border-[#E5D5C3] bg-white p-6 shadow-sm"
            >
              <div
                className="flex items-center gap-2 text-[#A86D32]"
                aria-label={`${item.rating} out of 5 stars`}
              >
                <span aria-hidden="true">
                  {"★".repeat(item.rating)}
                  {"☆".repeat(5 - item.rating)}
                </span>
                <span className="text-xs font-semibold text-[#594632]">
                  {item.rating}/5
                </span>
              </div>
              <h3 className="mt-3 text-base font-semibold text-[#29211B]">
                {item.title}
              </h3>
              <p className="mt-2 line-clamp-4 flex-1 text-sm leading-6 text-[#5D534B]">
                “{item.comment}”
              </p>
              <div className="mt-5 border-t border-[#F0E7DE] pt-4">
                <p className="text-sm font-semibold text-[#29211B]">
                  {item.user?.name || "Customer"}{" "}
                  {item.verifiedPurchase && (
                    <span className="ml-2 text-xs font-medium text-[#608053]">
                      Verified purchase
                    </span>
                  )}
                </p>
                <p className="mt-1 text-xs text-[#806F61]">
                  Review of {item.product?.title}
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-[#E5D5C3] bg-white p-6 text-sm text-[#665548]">
          Customer reviews will appear here after approval. Be the first to
          share your experience.
        </p>
      )}
      <Link
        href="/reviews/write"
        className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-[#8B5E3C] px-5 text-sm font-semibold text-white transition hover:bg-[#70482e]"
      >
        Write a review
      </Link>
    </div>
  );
}
