import LiquidEther from "./ui/LiquidEther"; 
import astronautImg from "../assets/cute-astronaut.png"; 

const AboutSection = () => {

  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center justify-center px-6 py-16 overflow-hidden"
    >
      {/* Background effect */}
      <div className="fixed inset-0 -z-10">
        {/* <LiquidEther
          colors={["#D6B896", "#632125", "#704D39", "#EEE6C2", "#632125"]} 
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
        /> */}
      </div>

      {/* Foreground content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center">
        {/* Left side (text) */}
        <div id="about-text" className="space-y-6 text-left">
          <h2 className="text-4xl sm:text-4xl font-bold text-cyan-400">
            What is TechFest 2.25?
          </h2>
          <p className="text-lg sm:text-xl text-gray-200 leading-relaxed">
            Discover the essence of innovation at{" "}
            <span className="text-white font-semibold">TECHFEST 2.25</span>, the
            pinnacle of technological brilliance. As the flagship technical fest of{" "}
            <span className="font-semibold">
              B. P. Poddar Institute of Management and Technology
            </span>
            , TECHFEST has been a beacon of inspiration for the technical community
            for over a decade. In 2025, brace yourself for the grand celebration of
            its 11th edition, promising an experience that transcends boundaries and
            ignites the spirit of innovation on an unprecedented scale.
          </p>
        </div>

        {/* Right side (image) */}
        <div id="about-img" className="flex justify-center md:justify-end">
          <img
            src={astronautImg}
            alt="Astronaut"
            className="w-72 md:w-96 object-contain drop-shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
