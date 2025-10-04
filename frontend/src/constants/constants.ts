import { 
  FaInstagram, 
  FaTwitter, 
  FaLinkedin, 
  FaGithub, 
  FaDiscord, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt 
} from "react-icons/fa";

export const NAV_ITEMS = [
  {
    label: "HOME",
    bgColor: "#27272a", // zinc-800 
    textColor: "#ffffff",
    links: [
      { label: "Go to Home", href: "/", ariaLabel: "Go to Home page" },
      { label: "Home Details", href: "/details", ariaLabel: "Home page details" },
    ],
  },
  {
    label: "ABOUT US",
    bgColor: "#27272a", // zinc-800
    textColor: "#ffffff",
    links: [
      { label: "About Company", href: "/about", ariaLabel: "About our company" },
      { label: "Our Team", href: "/about/team", ariaLabel: "Meet our team" },
    ],
  },
  {
    label: "EVENTS",
    bgColor: "#3f3f46", // zinc-700
    textColor: "#ffffff",
    links: [
      { label: "All Events", href: "/events", ariaLabel: "View all events" },
      { label: "Upcoming Events", href: "/events/upcoming", ariaLabel: "Upcoming events" },
    ],
  },
  {
    label: "GALLERY",
    bgColor: "#27272a", // zinc-800
    textColor: "#ffffff",
    links: [
      { label: "Photo Gallery", href: "/gallery", ariaLabel: "View photo gallery" },
      { label: "Event Photos", href: "/gallery/events", ariaLabel: "Event photos" },
    ],
  },
  {
    label: "COLLABORATORS",
    bgColor: "#27272a", // zinc-800
    textColor: "#ffffff",
    links: [
      { label: "Sponsors", href: "/sponsors", ariaLabel: "View sponsors" },
      { label: "Contact Details", href: "/contact", ariaLabel: "View contact details" },
    ],
  },
];

export const quickLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Events", href: "#events" },
  { name: "Gallery", href: "#gallery" },
  { name: "Sponsors", href: "#sponsors" },
];

export const socialLinks = [
  { name: "Instagram", href: "#", icon: FaInstagram },
  { name: "Twitter", href: "#", icon: FaTwitter },
  { name: "LinkedIn", href: "#", icon: FaLinkedin },
  { name: "GitHub", href: "#", icon: FaGithub },
  { name: "Discord", href: "#", icon: FaDiscord },
];

export const contactInfo = [
  { type: "Email", value: "techfest@fichm.ac.in", icon: FaEnvelope },
  { type: "Phone", value: "+91 XXXXXXXXXX", icon: FaPhone },
  { type: "Address", value: "Finance and Investment Club of Miranda House", icon: FaMapMarkerAlt },
];


interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  image: string;
  isFeatured: boolean;
}

export const events: Event[] = [
    {
      id: 1,
      title: "Hackathon 2024",
      description: "24-hour coding marathon where innovators build groundbreaking solutions to real-world problems. Showcase your skills and compete for amazing prizes.",
      date: "2024-03-15",
      time: "10:00 AM",
      venue: "Main Auditorium",
      category: "Competition",
      image: "/events/hackathon.jpg",
      isFeatured: true
    },
    {
      id: 2,
      title: "AI & ML Workshop",
      description: "Hands-on workshop exploring the latest advancements in Artificial Intelligence and Machine Learning. Perfect for beginners and experts alike.",
      date: "2024-03-16",
      time: "2:00 PM",
      venue: "Tech Lab 101",
      category: "Workshop",
      image: "/events/ai-workshop.jpg",
      isFeatured: true
    },
    {
      id: 3,
      title: "Startup Pitch Competition",
      description: "Witness groundbreaking ideas from aspiring entrepreneurs. Network with investors and industry leaders in this exciting pitch event.",
      date: "2024-03-17",
      time: "11:00 AM",
      venue: "Innovation Hub",
      category: "Competition",
      image: "/events/pitch-competition.jpg",
      isFeatured: false
    },
    {
      id: 4,
      title: "Web3 & Blockchain Summit",
      description: "Dive into the future of decentralized technology. Learn about NFTs, DeFi, and the metaverse from industry pioneers.",
      date: "2024-03-18",
      time: "3:00 PM",
      venue: "Conference Hall A",
      category: "Conference",
      image: "/events/web3-summit.jpg",
      isFeatured: true
    },
    {
      id: 5,
      title: "UX/UI Design Masterclass",
      description: "Learn the principles of exceptional user experience and interface design. Create stunning digital products that users love.",
      date: "2024-03-19",
      time: "1:00 PM",
      venue: "Design Studio",
      category: "Workshop",
      image: "/events/design-masterclass.jpg",
      isFeatured: false
    },
    {
      id: 6,
      title: "Tech Career Fair",
      description: "Connect with top tech companies and startups. Explore internship and job opportunities in the rapidly evolving tech landscape.",
      date: "2024-03-20",
      time: "10:00 AM",
      venue: "Grand Ballroom",
      category: "Networking",
      image: "/events/career-fair.jpg",
      isFeatured: true
    }
  ];

export const categories = ["All", "Competition", "Workshop", "Conference", "Networking"];

export const getCategoryColor = (category: string): string => {
  switch (category) {
    case "Competition":
      return "bg-red-500 text-white"; 
    case "Workshop":
      return "bg-blue-500 text-white";
    case "Conference":
      return "bg-purple-500 text-white";
    case "Networking":
      return "bg-green-500 text-white";
    default:
      return "bg-gray-500 text-white"; 
  }
}

export const upcomingEvents = [
  {
    id: 1,
    title: "Stock Market Fundamentals Workshop",
    description: "Learn the basics of stock market investing, technical analysis, and portfolio management from industry experts.",
    date: "2024-03-15",
    time: "2:00 PM - 5:00 PM",
    location: "Miranda House Campus",
    registrationUrl: "https://unstop.com/ficmh-stock-workshop",
    type: "workshop",
    icon: "📈"
  },
  {
    id: 2,
    title: "Investment Banking Insights",
    description: "Interactive session with seasoned investment bankers sharing career paths and industry insights.",
    date: "2024-03-22",
    time: "3:00 PM - 6:00 PM",
    location: "Virtual Event",
    registrationUrl: "https://unstop.com/ficmh-investment-banking",
    type: "speaker-session",
    icon: "💼"
  },
  {
    id: 3,
    title: "FinTech Innovation Challenge",
    description: "Competition to develop innovative solutions for real-world financial technology problems.",
    date: "2024-04-05",
    time: "10:00 AM - 4:00 PM",
    location: "Miranda House Innovation Lab",
    registrationUrl: "https://unstop.com/ficmh-fintech-challenge",
    type: "competition",
    icon: "🚀"
  }
];

export const pastEvents = [
  {
    id: 1,
    title: "Personal Finance Masterclass",
    description: "Comprehensive session on budgeting, saving, and investment strategies for students.",
    date: "2024-02-10",
    speakers: ["Harsh Goela", "Dhruv Soni"],
    participants: 150,
    type: "workshop"
  },
  {
    id: 2,
    title: "Women in Finance Summit",
    description: "Celebrating women leaders in finance with panel discussions and networking.",
    date: "2024-01-25",
    speakers: ["Vandana Tolani", "Ranjika Mitra"],
    participants: 200,
    type: "summit"
  },
  {
    id: 3,
    title: "Trading Strategies Workshop",
    description: "Advanced workshop on algorithmic trading and risk management strategies.",
    date: "2023-12-15",
    speakers: ["Pranjal Kamra", "Ajitesh Gupta"],
    participants: 120,
    type: "workshop"
  }
];

export const eventCategories = [
  {
    name: "Technical Workshops",
    icon: "📈",
    description: "Deep-dive sessions on technical analysis, trading strategies, and financial modeling for hands-on learning experience.",
    color: "from-cyan-400/20 to-blue-400/20"
  },
  {
    name: "Industry Insights",
    icon: "🏢",
    description: "Panel discussions and talks from finance professionals sharing real-world experiences and career guidance.",
    color: "from-purple-400/20 to-pink-400/20"
  },
  {
    name: "Case Competitions",
    icon: "🏆",
    description: "Competitive events challenging participants to solve real financial problems and present innovative solutions.",
    color: "from-yellow-400/20 to-orange-400/20"
  },
  {
    name: "Networking Events",
    icon: "🤝",
    description: "Opportunities to connect with peers, alumni, and industry professionals in informal settings.",
    color: "from-green-400/20 to-emerald-400/20"
  }
];