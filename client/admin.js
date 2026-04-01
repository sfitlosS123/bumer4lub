const socket = io();
const pcsDiv = document.getElementById("pcs");

socket.on("pcs", (pcs) => {
  pcsDiv.innerHTML = "";

  pcs.forEach(pc => {
    pcsDiv.innerHTML += `
      <b>${pc.name}</b> ${pc.busy ? "🔴" : "🟢"}
      <button onclick="start(${pc.id})">▶</button>
      <button onclick="stop(${pc.id})">⏹</button>
      <hr>
    `;
  });
});

function start(id) {
  socket.emit("start_session", { pcId: id, userId: 0 });
}

function stop(id) {
  socket.emit("stop_session", id);
}
