export default function TechUpdateCard({ title, description, author, date }) {
  return (
    <div className="tech-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="meta">
        <span>{author}</span>
        <span>{date}</span>
      </div>
    </div>
  );
}
