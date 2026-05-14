var PORT = process.env.PORT || 3000;
var express = require("express");
var http = require("http");
var { Server } = require("socket.io");
var app = express();
var server = http.createServer(app);
var io = new Server(server);
var colors = ["red", "orange", "yellow", "green", "blue", "purple", "pink", "brown", "grey", "black"]
app.use(express.static("game"));
var players = {};
io.on("connection", socket => {
    var color = colors.splice(Math.floor(Math.random() * colors.length), 1)[0];
    console.log("Joined: " + socket.id);
    console.log(players[socket.id]);
    players[socket.id] = {
        x: 100,
        y: 100,
	color: color
    };
    socket.on("move", data => {
	if(!players[socket.id])return;
        players[socket.id].x += data.dx;
        players[socket.id].y += data.dy;
    });
    socket.on("disconnect", () => {
		if(player){
	colors.push(players[socket.id].color);
        delete players[socket.id];
	console.log("Left: " + socket.id);
		}
    });
});
setInterval(() => {
    io.emit("state", players);
}, 1000 / 15);
server.listen(PORT, () => {
    console.log("Server on port: " + PORT);
});
