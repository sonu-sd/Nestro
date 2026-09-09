export default function RoomCard({ Imgpath, title, pieces, large = false,}) {
  return (
    <div className={`group relative overflow-hidden rounded-2xl ${large ? "h-[410px]" : "h-[198px]" }`}>
      <img
        src={Imgpath}
        alt={title}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

      <div className="absolute bottom-6 left-6 text-white">
        <h3
          className= "text-l">
          {title}
        </h3>

        <p className="text-sm text-white/80">
          {pieces}
        </p>
      </div>
    </div>
  );
}