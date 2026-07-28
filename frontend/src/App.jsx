import { useState, useEffect } from "react";

const API_BASE = "http://127.0.0.1:5000/api/users";

export default function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setFormData({ first_name: "", last_name: "", username: "" });
      loadUsers();
    }
  };

  return (
    <main>
      <h1>Users Demo</h1>

      <form onSubmit={handleCreate}>
        <input
          placeholder="First Name"
          value={formData.first_name}
          onChange={(e) =>
            setFormData({ ...formData, first_name: e.target.value })
          }
          required
        />
        <input
          placeholder="Last Name"
          value={formData.last_name}
          onChange={(e) =>
            setFormData({ ...formData, last_name: e.target.value })
          }
          required
        />
        <input
          placeholder="Username"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          required
        />
        <button type="submit">Add User</button>
      </form>


      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <span>
              <strong>
                {user.first_name} {user.last_name}
              </strong>{" "}
              (@{user.username})
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
