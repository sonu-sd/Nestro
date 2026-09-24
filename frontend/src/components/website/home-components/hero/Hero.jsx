import HeroSlider from "./Hero-slider";

export default function Hero() {
  const heroData = [
    {
      id: 1,
      subtitle: "Bedroom Edit",
      title: "Rest,",
      titles: "Reimagined",
      description:
        "Soft textures and calm tones for a bedroom that feels like a retreat.",
      btn1: "Shop Bedroom",
      btn2: "View Lookbook",
      Imgpath:
        "https://images.unsplash.com/photo-1748679979601-dc9ec43d900d?auto=format&fit=crop&w=1400&q=80",
    },

    {
      id: 2,
      subtitle: "New Arrivals",
      title: "Gather Around",
      titles: "Good Wood",
      description:
        "Solid-wood dining sets built for long dinners and longer conversations.",
      btn1: "Shop Dining",
      btn2: "View Lookbook",
      Imgpath:
        "https://images.unsplash.com/photo-1519643381401-22c77e60520e?auto=format&fit=crop&w=1400&q=80",
    },

    {
      id: 3,
      subtitle: "Summer Collection 2026",
      title: "Where Comfort",
      titles: "Meets Craft",
      description:
        "Scandinavian-inspired furniture for modern living. Curated pieces that endure seasons.",
      btn1: "Shop Collection",
      btn2: "View Lookbook",
      Imgpath:
        "https://images.unsplash.com/photo-1758448511322-8bfc73daf606?auto=format&fit=crop&w=1400&q=80",
    },
  ];

  return <HeroSlider heroData={heroData} />;
}
