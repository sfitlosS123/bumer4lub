const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static("client"));

let users = {};
let pcs = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `boomer${i + 1}`,
  busy: false,
  userId: null
}));

let history = [];

app.get("/api/user/:id", (req, res) => {
  res.json(users[req.params.id] || null);
});

app.post("/api/balance", (req, res) => {
  const { userId, amount } = req.body;
  if (users[userId]) users[userId].balance += amount;
  res.json({ ok: true });
});

io.on("connection", (socket) => {
  socket.emit("pcs", pcs);

  socket.on("start_session", ({ pcId, userId }) => {
    pcs = pcs.map(pc =>
      pc.id === pcId ? { ...pc, busy: true, userId } : pc
    );

    history.push({ pcId, userId, start: new Date() });

    io.emit("pcs", pcs);
  });

  socket.on("stop_session", (pcId) => {
    pcs = pcs.map(pc =>
      pc.id === pcId ? { ...pc, busy: false, userId: null } : pc
    );

    const last = [...history].reverse().find(h => h.pcId === pcId && !h.end);
    if (last) last.end = new Date();

    io.emit("pcs", pcs);
  });
});

server.listen(3000, () => console.log("RUNNING"));
require("./bot");
module.exports = { users };