import DecryptedText from "./DecryptedText";
import RotatingText from "./RotatingText";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden">
      {/* Foreground content */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 italic leading-tight text-white px-4">
        Welcome to{" "}
        <span className="inline-block">
          <RotatingText
            texts={["FICMH", "Finance", "Investment", "Growth"]}
            mainClassName="inline-block accent-text"
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

      <p className="max-w-2xl text-base sm:text-lg md:text-xl text-light">
        <DecryptedText
          speed={100}
          maxIterations={20}
          characters="abschansjd1234!?"
          className="revealed"
          parentClassName="all-letters"
          encryptedClassName="encrypted"
          text="Finance and Investment Club of Miranda House - Cultivating financial literacy and empowering young minds through knowledge and innovation."
        />
      </p>
    </section>
  );
};

export default HeroSection;