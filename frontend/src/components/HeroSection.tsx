import RotatingText from "./RotatingText";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center bg-gradient-to-b from-black via-gray-900 to-black text-white px-4">
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 italic leading-tight">
        Welcome to{" "}
        <span className="inline-block text-cyan-400">
          <RotatingText
            texts={["TechFest", "Innovation", "Creativity", "Future"]}
            mainClassName="inline-block"
            staggerFrom="last"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={2000}
          />
        </span>
      </h1>
      <p className="max-w-2xl text-base sm:text-lg md:text-xl text-gray-300">
        The ultimate celebration of innovation, coding, and creativity. Join us and
        be part of something epic!
      </p>
    </section>
  );
};

export default HeroSection;
