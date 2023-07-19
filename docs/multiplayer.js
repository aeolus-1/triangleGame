var chatMsg = new Array();
var clientPing = 0,
  online = false;

var inactive;
var username;

function submitChat(msg) {
  console.log(msg)
  multiChat.push({
    text:msg.text,
    user:"Player",
    pos:v(100000,100000),
    time:100,
})
}

if (gameMode == "multiplayer") {
  online = true;

  function getMultiByUser(username) {
    for (let i = 0; i < multiplayers.length; i++) {
      if (multiplayers[i].username == username) {
        return multiplayers[i];
      }
    }
  }

  function kick(id, message) {
    var modKey = localStorage.getItem("moderationKey");
    if (message == undefined) {
      message = "No reason Given";
    }
    socket.emit("kick", { id: id, message: message, key: modKey });
  }

  function clientEval(message) {
    var modKey = localStorage.getItem("moderationKey");
    if (message == undefined) {
      message = `console.log("someone forgot to add code for eval)`;
    }
    socket.emit("sendEval", {
      message: message,
      key: modKey,
      username: username,
      id: socket.id,
    });
  }

  while (true) {
    var user = prompt("Please enter a username");

    var profaneWord = (function () {
      for (let word of profaneWords) {
        if (user.includes(word)) {
          return word;
        }
      }
    })();

    if (!gameCompleted2) {
      user = user.replace("<gold>", "<null>");
      user = user.replace("</gold>", "</null>");
      console.log(user);
    }

    if (user != null && user != "") {
      var el = document.createElement("html");
      el.innerHTML = `<html>${user}</html>`;

      if (el.textContent.replace(" ", "").length > 30) {
        alert("Username is too long or invaild");
        askForUser();
      } else if (profaneWord != undefined) {
        alert("Profane Name");
      } else {
        username = user;
        break;
      }
    }
  }

  function submitChat(msg) {
    console.log("yay")

    var displayUsername = username;
    if (online) {
      if (displayUsername.startsWith("<rainbow>")) {
        displayUsername.replace("<rainbow>", "");
        socket.emit("sendMessage", {
          message: msg,
          username: displayUsername,
          type: "msg",
        });
      } else {
        socket.emit("sendMessage", {
          message: msg,
          username: username,
          type: "msg",
        });
      }
    } else {
      
    }
  }

  const socket = io("https://tri.xl83.dev", {
    reconnection: false,
  });

  document.addEventListener("keypress", function () {
    window.clearTimeout(inactive);
    startTimer();
  });

  function coords() {
    socket.emit("coords", {
      id: socket.id,
      x: entitys[0].body.position.x,
      y: entitys[0].body.position.y,
      velX: entitys[0].body.velocity.x,
      velY: entitys[0].body.velocity.y,
      angle: entitys[0].body.angle,
      angVel: entitys[0].body.angularVelocity,
      username: username,
      scale: getPlayerScale(entitys[0]),
      chat: chat,
      browserId: entitys[0].browserId,
    });
    requestAnimationFrame(coords);
  }

  function startTimer() {
    inactive = setTimeout(() => {
      socket.emit("inactive", username);
      alert("disconnected due to inactivity");
    }, 600000);
  }

  socket.on("connect", function () {
    socket.emit("playerJoin", {
      id: socket.id,
      x: entitys[0].body.position.x,
      y: entitys[0].body.position.y,
      velX: entitys[0].body.velocity.x,
      velY: entitys[0].body.velocity.y,
      angle: entitys[0].body.angle,
      angVel: entitys[0].body.angularVelocity,
      username: username,
      scale: getPlayerScale(entitys[0]),
      chat: chat,
      browserId: entitys[0].browserId,
    });

    socket.emit("sendMessage", {
      message: { time: 100 },
      username: username,
      type: "join",
    });
  });

  socket.on("createPlayer", function (data) {
    if (data.id != socket.id) {
      if (data.id != "undefined" && data.username != undefined) {
        var newpl = new Multiplayer(
          v(data.x, data.y),
          {
            moveLeft: [""],
            moveRight: [""],
            jump: [""],
            duck: [""],
          },
          data.id,
          data.username,
          data.browserId
        );
        multiplayers.push(newpl);

        console.log("adding playyer");
      }
    }
  });

  socket.on("askCoords", function () {
    coords();
  });

  socket.on("runEval", function (data) {
    console.log(`eval was sent from ${data.username} (${data.id})`);
    console.log(data.message);
    if (socket.id != data.id) {
      try {
        if (data.message.includes("window.open")) {
          console.log("L");
        } else {
          eval(data.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
  });

  socket.on("updatePlayers", function (data) {
    Object.keys(data.playerdata).every(function (key) {
      for (var i = 0; i < multiplayers.length; i++) {
        if (key == multiplayers[i].multiId) {
          Matter.Body.set(
            multiplayers[i].body,
            "position",
            v(data.playerdata[key].x, data.playerdata[key].y)
          );
          Matter.Body.set(
            multiplayers[i].body,
            "angle",
            data.playerdata[key].angle
          );
          Matter.Body.set(
            multiplayers[i].body,
            "velocity",
            v(data.playerdata[key].velX, data.playerdata[key].velY)
          );
          Matter.Body.set(
            multiplayers[i].body,
            "angularVelocity",
            data.playerdata[key].angVel
          );
          setPlayerScale2(multiplayers[i], data.playerdata[key].scale);
        }
      }
      return true;
    });
    clientPing = new Date().getTime() - parseInt(data.ts);
  });

  socket.on("createExistingPlayers", function (data) {
    Object.keys(data).every(function (key) {
      if (key != socket.id) {
        if (key != "undefined" && data[key].username != undefined) {
          var newpl = new Multiplayer(
            v(data[key].x, data[key].y),
            {
              moveLeft: [""],
              moveRight: [""],
              jump: [""],
              duck: [""],
            },
            key,
            data[key].username,
            data[key].browserId
          );
          multiplayers.push(newpl);
        }
      }
      return true;
    });
  });

  socket.on("removePlayer", function (data) {
    for (var i = 0; i < multiplayers.length; i++) {
      if (data.id == multiplayers[i].multiId) {
        Matter.Composite.remove(engine.world, multiplayers[i].body);
        multiplayers.splice(i, 1);
      }
    }
  });

  socket.on("beenKicked", function (data) {
    alert(` You have been kicked with the reason: ${data}`);
    location.reload();
  });

  socket.on("receiveMessage", function (data) {
    console.log(data);
    multiChat.push({ ...data.message, user: data.username, type: data.type });
  });

  startTimer();
}
