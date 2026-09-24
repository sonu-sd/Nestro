export default function ProfileLoading() {
  return (
    <main className="min-h-screen bg-[#faf9f7] px-5 pt-28 md:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl animate-pulse">
        <div className="mb-8 h-8 w-40 rounded bg-gray-200" />

        <div className="mb-6 h-48 rounded-2xl border border-gray-100 bg-white" />

        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-72 rounded-2xl border border-gray-100 bg-white" />

          <div className="h-72 rounded-2xl border border-gray-100 bg-white" />
        </div>
      </div>
    </main>
  );
}
