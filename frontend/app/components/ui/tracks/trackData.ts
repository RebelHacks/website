interface Track {
  name?: string;
  prize: string;
  description?: string;
  icon?: string;
  hidden?: boolean;
  featured?: boolean;
}

//magic numbers below are the SVGs for each icon
const BEGINNER_ICON = "M40-120v-80h880v80H40Zm120-120q-33 0-56.5-23.5T80-320v-440q0-33 23.5-56.5T160-840h640q33 0 56.5 23.5T880-760v440q0 33-23.5 56.5T800-240H160Zm0-80h640v-440H160v440Zm0 0v-440 440Z";
const GRAND_PRIZE_ICON = "M280-120v-80h160v-124q-49-11-87.5-41.5T296-442q-75-9-125.5-65.5T120-640v-40q0-33 23.5-56.5T200-760h80v-80h400v80h80q33 0 56.5 23.5T840-680v40q0 76-50.5 132.5T664-442q-18 46-56.5 76.5T520-324v124h160v80H280Zm0-408v-152h-80v40q0 38 22 68.5t58 43.5Zm200 128q50 0 85-35t35-85v-240H360v240q0 50 35 85t85 35Zm200-128q36-13 58-43.5t22-68.5v-40h-80v152Zm-200-52Z";
export const LOCK_ICON = "M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z";

export const trackRows: Track[][] = [
  [
    {
      name: "1st Place",
      prize: "$1,500",
      description: "Awarded to the best project of the hackathon",
      icon: GRAND_PRIZE_ICON,
      featured: true,
    },
  ],
  [
    {
      name: "2nd Place",
      prize: "$1,000",
      description: "Awarded to the second-place project overall",
      icon: GRAND_PRIZE_ICON,
      featured: false,
    },
    {
      name: "3rd Place",
      prize: "$750",
      description: "Awarded to the third-place project overall",
      icon: GRAND_PRIZE_ICON,
      featured: false,
    },
  ],
  [
    // keep unrevealed categories out of our source! only prize numbers are public for now
    { prize: "$500", hidden: true },
    { prize: "$500", hidden: true },
    { prize: "$500", hidden: true },
  ],
  [
    {
      name: "Beginner",
      prize: "$250",
      description: "For participants attending their first RebelHacks event",
      icon: BEGINNER_ICON,
    },
  ],
];
