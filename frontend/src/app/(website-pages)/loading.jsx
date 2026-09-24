export default function HomeLoading() {
  return (
    <div
      className="space-y-10 px-4 py-8 sm:px-6 lg:px-8"
      aria-label="Loading home page"
    >
      <div className="h-80 animate-pulse rounded-3xl bg-[#E7D9C9]" />
      {[1, 2].map((section) => (
        <section key={section} className="space-y-4">
          <div className="h-7 w-48 animate-pulse rounded bg-[#E7D9C9]" />
          <div className="grid gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((card) => (
              <div
                key={card}
                className="h-80 animate-pulse rounded-2xl bg-[#E7D9C9]"
              />
            ))}
          </div>
        </section>
      ))}
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((card) => (
          <div
            key={card}
            className="h-48 animate-pulse rounded-2xl bg-[#E7D9C9]"
          />
        ))}
      </div>
    </div>
  );
}
