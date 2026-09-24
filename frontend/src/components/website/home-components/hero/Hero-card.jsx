export default function HeroCard({
  slide,
  heroData,
  current,
  setCurrent,
  nextSlide,
  prevSlide,
}) {
  return (
    <section
      className="relative min-h-[500px] overflow-hidden bg-cover bg-center sm:m-4 sm:rounded-3xl lg:m-5 lg:min-h-[500px]"
      style={{
        backgroundImage: `url(${slide.Imgpath})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(26,18,8,0.92)_0%,rgba(26,18,8,0.72)_38%,rgba(26,18,8,0.25)_68%,rgba(26,18,8,0.05)_100%)] z-10"></div>

      {/* Content */}
      <div className="relative z-20 flex min-h-[500px] items-center px-6 py-16 sm:px-12 lg:px-14">
        <div className="max-w-[480px] text-white">
          <p className="text-[10px] uppercase tracking-[4px] text-[#d7a56d]">
            {slide.subtitle}
          </p>

          <h1 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl lg:text-[42px]">
            {slide.title}
            <br />
            <span className="italic font-light text-[#d6bfa7]">
              {slide.titles}
            </span>
          </h1>

          <p className="mt-4 max-w-md text-[13px] leading-6 text-gray-300 sm:leading-8">
            {slide.description}
          </p>

          <div className="mt-6 flex flex-col gap-3 min-[400px]:flex-row sm:gap-4">
            <button className="min-h-11 rounded-md bg-[#b57b4b] px-7 py-3 text-[11px]">
              {slide.btn1}
            </button>

            <button className="min-h-11 rounded-md border border-gray-400 px-7 py-3 text-[11px] hover:bg-white hover:text-black transition">
              {slide.btn2}
            </button>
          </div>

          {/* Dots */}
          <div className="mt-10 flex gap-3 sm:mt-16">
            {heroData.map((_, index) => (
              <span
                key={index}
                onClick={() => setCurrent(index)}
                className={`h-[3px] w-8 cursor-pointer rounded transition-all ${
                  current === index ? "bg-[#c18b5c]" : "bg-white/40"
                }`}
              ></span>
            ))}
          </div>
        </div>
      </div>

      {/* Previous */}
      <button
        onClick={prevSlide}
        className="absolute bottom-5 left-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur sm:bottom-auto sm:left-3 sm:top-1/2 sm:-translate-y-1/2"
      >
        ❮
      </button>

      {/* Next */}
      <button
        onClick={nextSlide}
        className="absolute bottom-5 right-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur sm:bottom-auto sm:right-3 sm:top-1/2 sm:-translate-y-1/2"
      >
        ❯
      </button>
    </section>
  );
}
