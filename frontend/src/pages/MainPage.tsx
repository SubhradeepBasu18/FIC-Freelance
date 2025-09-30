import AboutSection from '@/components/About'
import HeroSection from '@/components/HeroSection/HeroSection'

const MainPage = () => {
    return (
        <main className="flex-1 relative z-10">
            <HeroSection />
            <AboutSection />
        </main>
    )
}

export default MainPage