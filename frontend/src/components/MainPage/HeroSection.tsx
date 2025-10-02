import DecryptedText from "./DecryptedText";
import RotatingText from "./RotatingText";
// import LiquidEther from "../ui/LiquidEther";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden">
      {/* Background effect */}
      {/* <div className="fixed inset-0 -z-10">
        <LiquidEther
          colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div> */}

      {/* Foreground content */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 italic leading-tight text-white px-4">
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

      <p className="max-w-2xl text-base sm:text-lg md:text-xl text-gray-200">
        <DecryptedText
          speed={100}
          maxIterations={20}
          characters="abschansjd1234!?"
          className="revealed"
          parentClassName="all-letters"
          encryptedClassName="encrypted"
          text="The ultimate celebration of innovation, coding, and creativity. Join us and be part of something epic!"
        />
      </p>
    </section>
  );
};

export default HeroSection;
