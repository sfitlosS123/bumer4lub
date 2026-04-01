const socket = io();
let userId = localStorage.getItem("userId");

const pcsDiv = document.getElementById("pcs");

function login() {
  const id = prompt("Вставь Telegram ID");
  localStorage.setItem("userId", id);
  userId = id;
  loadUser();
}

async function loadUser() {
  if (!userId) return;

  const res = await fetch(`/api/user/${userId}`);
  const user = await res.json();

  if (user) {
    document.getElementById("user").innerHTML =
      `👤 ${user.username} | 💰 ${user.balance}`;
  }
}

socket.on("pcs", (pcs) => {
  pcsDiv.innerHTML = "";
  pcs.forEach(pc => {
    pcsDiv.innerHTML += `
      ${pc.name} ${pc.busy ? "🔴" : "🟢"}
      <button onclick="start(${pc.id})">▶</button>
      <button onclick="stop(${pc.id})">⏹</button><br>
    `;
  });
});

function start(id) {
  socket.emit("start_session", { pcId: id, userId });
}

function stop(id) {
  socket.emit("stop_session", id);
}

loadUser();
