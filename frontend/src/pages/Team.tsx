import { useState, useEffect } from 'react';
import { getAllTeamMembers } from '@/configApi/team.admin';

const TeamPage = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetching team members
  useEffect(() => {
    const fetchTeamMembers = async () => {
      const { status, data, error } = await getAllTeamMembers();
      if (status === 200) {
        setTeamMembers(data.team);
      } else {
        setError(error?.message || "Failed to fetch team members");
      }
      setLoading(false);
    };

    fetchTeamMembers();
  }, []);

  return (
    <section className="min-h-screen bg-black py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold italic text-white mb-6 tracking-tight">
            Meet Our Team
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Passionate individuals driving financial literacy and innovation at Miranda House
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
          </div>
        )}

        {/* Team Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member._id}
                className="group bg-gradient-to-br from-zinc-900 to-black rounded-2xl overflow-hidden border border-gray-700 hover:border-cyan-400/30 transition-all duration-300 transform hover:scale-[1.02]"
              >
                {/* Avatar Container */}
                <div className="relative overflow-hidden bg-zinc-800 h-64">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>

                  {/* LinkedIn Icon Overlay */}
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-4 right-4 w-10 h-10 bg-zinc-900/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-cyan-400 hover:scale-110"
                  >
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>

                {/* Info Container */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {member.position}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && teamMembers.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-400 text-lg">No team members found</p>
          </div>
        )}

        {/* Join Us CTA */}
        <div className="mt-20 bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-12 border border-cyan-400/20 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Team</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Interested in being part of FICMH? We're always looking for passionate individuals 
            to join our mission of financial literacy and innovation.
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-blue-400 text-black font-semibold rounded-full hover:shadow-lg hover:shadow-cyan-400/20 transition-all duration-300 transform hover:scale-105">
            Get in Touch
          </button>
        </div>
      </div>
    </section>
  );
};

export default TeamPage;
