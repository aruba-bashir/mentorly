import { useState } from "react";
import axios from "axios";

export default function CreateJobForm() {

  const [form, setForm] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    stipend: "",
    apply_link: ""
  });

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(
      "https://mentorly-backend-9x4x.onrender.com/jobs/internal",
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("Job Created");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Title"
        onChange={e => setForm({...form, title: e.target.value})} />

      <input placeholder="Company"
        onChange={e => setForm({...form, company: e.target.value})} />

      <textarea placeholder="Description"
        onChange={e => setForm({...form, description: e.target.value})} />

      <button type="submit">Create Job</button>
    </form>
  );
}