import { getAllSponsors } from '@/configApi/sponsors.admins';
// Import all sponsor images
import ChaseProtein from '/assets/Collaborations/Chase Protein.png';
import Crowwd from '/assets/Collaborations/Crowwd.png';
import EvePaper from '/assets/Collaborations/EvePaper.png';
import GLBXTNT from '/assets/Collaborations/GLBXTNT.png';
import HDFC from '/assets/Collaborations/HDFC.png';
import LazerCrazer from '/assets/Collaborations/Lazer Crazer.png';
import Unstop from '/assets/Collaborations/Unstop.png';
import { useState, useEffect } from 'react';

const SponsorsPage = () => {
//   const sponsorItems = [
//     {
//       image: ChaseProtein,
//       title: "Chase Protein",
//       subtitle: "",
//       handle: "",
//       borderColor: "#E5E7EB",
//       gradient: "linear-gradient(145deg, #E5E7EB, #000)",
//       url: "#"
//     },
//     {
//       image: Crowwd,
//       title: "Crowwd",
//       subtitle: "",
//       handle: "",
//       borderColor: "#FBBF24",
//       gradient: "linear-gradient(145deg, #FBBF24, #000)",
//       url: "#"
//     },
//     {
//       image: EvePaper,
//       title: "EvePaper",
//       subtitle: "",
//       handle: "",
//       borderColor: "#9CA3AF",
//       gradient: "linear-gradient(145deg, #9CA3AF, #000)",
//       url: "#"
//     },
//     {
//       image: GLBXTNT,
//       title: "GLBXTNT",
//       subtitle: "",
//       handle: "",
//       borderColor: "#10B981",
//       gradient: "linear-gradient(145deg, #10B981, #000)",
//       url: "#"
//     },
//     {
//       image: HDFC,
//       title: "HDFC",
//       subtitle: "",
//       handle: "",
//       borderColor: "#3B82F6",
//       gradient: "linear-gradient(145deg, #3B82F6, #000)",
//       url: "#"
//     },
//     {
//       image: LazerCrazer,
//       title: "Lazer Crazer",
//       subtitle: "",
//       handle: "",
//       borderColor: "#EC4899",
//       gradient: "linear-gradient(145deg, #EC4899, #000)",
//       url: "#"
//     },
//     {
//       image: Unstop,
//       title: "Unstop",
//       subtitle: "",
//       handle: "",
//       borderColor: "#8B5CF6",
//       gradient: "linear-gradient(145deg, #8B5CF6, #000)",
//       url: "#"
//     }
//   ];

  const [sponsorItems, setSponsorItems] = useState([]);

  useEffect(() => {
    getAllSponsors().then((res) => {
      setSponsorItems(res.data.sponsor);
    });
  }, []);

  return (
    <section className="min-h-screen bg-black py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Our Partners
          </h1>
          <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We're proud to collaborate with visionary organizations that share our commitment to 
            financial education and empowerment. Together, we're building the next generation of financial leaders.
          </p>
        </div>

        {/* Current Sponsors Grid */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Our Previous Partners</h2>
            <div className="w-20 h-1 bg-white mx-auto"></div>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Organizations that have previously supported our mission and events
            </p>
          </div>

          {/* Consistent Sponsor Grid for all screen sizes */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sponsorItems.map((sponsor, index) => (
              <div 
                key={index} 
                className="group bg-black rounded-xl p-6 border border-gray-800 text-center hover:border-white/30 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="w-32 h-32 mx-auto mb-4 rounded-xl overflow-hidden bg-white/5 p-4 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300">
                  <img 
                    src={sponsor.image} 
                    alt={sponsor.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="text-white font-semibold text-lg mb-1">{sponsor.name}</h4>
                {/* <p className="text-gray-400 text-sm">{sponsor.description}</p> */}
              </div>
            ))}
          </div>
        </div>

        {/* Why Partner With Us */}
        <div className="mb-20">
          <div className="bg-black rounded-2xl p-8 border border-gray-800">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Why Partner With Us?</h2>
              <div className="w-20 h-1 bg-white mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center group">
                {/* <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                </div> */}
                <h3 className="text-xl font-bold text-white mb-3">Targeted Audience</h3>
                <p className="text-gray-300">
                  Reach ambitious students from Miranda House, University of Delhi, known for academic excellence and leadership potential.
                </p>
              </div>

              <div className="text-center group">
                {/* <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                </div> */}
                <h3 className="text-xl font-bold text-white mb-3">Brand Visibility</h3>
                <p className="text-gray-300">
                  Get featured across our digital platforms, event materials, and social media reaching 10,000+ students.
                </p>
              </div>

              <div className="text-center group">
                {/* <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">  
                </div> */}
                <h3 className="text-xl font-bold text-white mb-3">Talent Acquisition</h3>
                <p className="text-gray-300">
                  Connect with top talent for internships and placements from one of India's premier educational institutions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorsPage;