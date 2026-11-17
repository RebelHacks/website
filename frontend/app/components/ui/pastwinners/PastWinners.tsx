// Past winners section, between Photos and Sponsors in app/page.tsx.

const WINNERS = [
  {
    prize: "Grand prize · $1,000",
    project: "HotelGuard",
    href: "https://devpost.com/software/hotel-guard",
    team: "Ruben Fernandez, Daniel Valdecantos, Issa Alkhoury, Randy Pahang, Robert Porchas",
  },
  {
    prize: "Hardware · $250",
    project: "Bags",
    href: "", // No devpost to link
    team: "Roy Margallo, Cris Rosales",
  },
  {
    prize: "Software beginner · $250",
    project: "sobr",
    href: "https://devpost.com/software/sobr-hc4ve2",
    team: "March Hosana, Aymen Awol",
  },
  {
    prize: "Software advanced · $500",
    project: "Bad Decisions Inc.",
    href: "https://devpost.com/software/bad-decisions-inc",
    team: "Nefeli Georgilas, T Nguyen",
  },
];

export default function PastWinners() {
  return (
    <section id="winners">
      <h2>Past winners</h2>

      <ul>
        {WINNERS.map((w) => (
          <li key={w.project} className="card">
            <p>{w.prize}</p>
            <h3>
              <a href={w.href}>{w.project}</a>
            </h3>
            <p>{w.team}</p>
          </li>
        ))}
      </ul>

      <a className="button" href="https://rebelhacks.devpost.com/project-gallery">
        See all projects
      </a>
    </section>
  );
}