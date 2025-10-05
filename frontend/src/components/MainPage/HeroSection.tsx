import classes from "./Hero.module.css";
import DecryptedText from "./DecryptedText";
import heroText from "@/assets/HeroText3.png";

const HeroSection = () => {
  return (
    // <section id="home" className={classes.hero}>
    <section id="home">
      <div className="flex flex-col items-center justify-center h-full w-full max-w-7xl mx-auto px-4 py-8">
        
        {/* Hero Text Image */}
        <div className="mb-6 w-full max-w-4xl justify-center flex">
          <img 
            src={heroText} 
            alt="Finance and Investment Club of Miranda House" 
            className={classes.text_img}
          />
        </div>

        {/* Caption */}
        <h4 className="text-yellow-400 italic text-xl sm:text-2xl md:text-3xl font-light mb-4 text-center">
          Cultivating financial literacy, empowering young minds
        </h4>

        {/* Description */}
        <div className="max-w-3xl mt-8 text-center">
          <p className="text-gray-200 text-base sm:text-lg md:text-xl">
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
        </div>
      </div>
    </section>
  );
};

export default HeroSection;