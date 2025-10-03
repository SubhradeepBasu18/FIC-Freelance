import AboutSection from '@/components/MainPage/About'
import HeroSection from '@/components/MainPage/HeroSection'

const MainPage = () => {
    return (
        <main className="flex-1 relative z-10">
            <HeroSection />
            <AboutSection />
        </main>
    )
}

export default MainPage