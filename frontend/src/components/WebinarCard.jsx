export default function WebinarCard({ title, speaker, date, role }) {
  return (
    <div className="webinar-card">
      <h3>{title}</h3>
      <p><strong>Speaker:</strong> {speaker}</p>
      <p><strong>Date:</strong> {date}</p>

      {role === "member" && (
        <button className="btn-primary">Join Webinar</button>
      )}

      {(role === "mentor" || role === "master") && (
        <button className="btn-secondary">Manage Webinar</button>
      )}
    </div>
  );
}
