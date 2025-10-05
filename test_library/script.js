const API_BASE = "http://localhost:3000/api"; // เปลี่ยน port ตาม backend ของคุณ

// 🔹 REGISTER
async function registerStudent(studentId, name, password) {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentId, name, password }),
  });
  return res.json();
}

// 🔹 LOGIN
async function loginStudent(studentId, password) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentId, password }),
  });
  return res.json();
}

// 🔹 GET ALL ROOMS
async function getRooms() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/rooms`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

// 🔹 CREATE BOOKING
async function bookRoom(roomId, startTime, endTime) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ roomId, startTime, endTime }), // ❌ เอา studentId ออก
  });
  return res.json();
}

