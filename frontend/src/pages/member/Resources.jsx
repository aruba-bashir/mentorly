import "../../styles/dashboard.css";

const semesters = [
  { id: 1, title: "Semester 1", subjects: ["Maths", "Physics", "Programming"] },
  { id: 2, title: "Semester 2", subjects: ["DSA", "OOP", "Discrete Maths"] },
  { id: 3, title: "Semester 3", subjects: ["DBMS", "OS", "CN"] },
  { id: 4, title: "Semester 4", subjects: ["AI", "SE", "Web Dev"] },
  { id: 5, title: "Semester 5", subjects: ["ML", "Cloud", "DevOps"] },
  { id: 6, title: "Semester 6", subjects: ["Big Data", "Security"] },
  { id: 7, title: "Semester 7", subjects: ["Internship Prep"] },
  { id: 8, title: "Semester 8", subjects: ["Projects", "Placements"] }
];

export default function Resources() {
  return (
    <>
      <h1>📚 Resources Library</h1>
      <p className="subtitle">
        Semester-wise books, notes, and references curated by mentors & faculty.
      </p>

      <div className="cards">
        {semesters.map((sem) => (
          <div className="card" key={sem.id}>
            <h3>{sem.title}</h3>
            <ul>
              {sem.subjects.map((sub) => (
                <li key={sub}>{sub}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
