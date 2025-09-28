
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
    label: "SCHEDULE",
    bgColor: "#27272a", // zinc-800
    textColor: "#ffffff",
    links: [
      { label: "Event Schedule", href: "/schedule", ariaLabel: "View event schedule" },
      { label: "Daily Agenda", href: "/schedule/daily", ariaLabel: "Daily agenda" },
    ],
  },
];
