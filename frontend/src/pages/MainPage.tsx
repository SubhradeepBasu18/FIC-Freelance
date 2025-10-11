import AboutSection from '@/components/MainPage/About'
import ConvenorNoteSection from '@/components/MainPage/Convenor'
import HeroSection from '@/components/MainPage/HeroSection'
import MissionVisionSection from '@/components/MainPage/MissionValue'

const MainPage = () => {
    return (
        <main className="flex-1 relative z-10">
            <HeroSection />
            <AboutSection />
            <MissionVisionSection />
            <ConvenorNoteSection />
        </main>
    )
}

export default MainPage