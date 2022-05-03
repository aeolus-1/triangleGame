var chatMsg = new Array()
var clientPing = 0

if (confirm("Would you like to join multiplayer? \n \n \n multiplayer made by jake cause im cool")) {
    var inactive;
    var username;
    var chatInput = document.getElementById("chatInput")

    function getMultiByUser(username) {
        for (let i = 0; i < multiplayers.length; i++) {
            if (multiplayers[i].username == username) {
                return multiplayers[i]
            }
        }
    }

    function kick(id, message) {
        var modKey = localStorage.getItem("moderationKey")
        if (message == undefined) {
            message = "No reason Given"
        }
        socket.emit('kick', { id: id, message: message, key: modKey })
    }

    function clientEval(message) {
        var modKey = localStorage.getItem("moderationKey")
        if (message == undefined) {
            message = `console.log("someone forgot to add code for eval)`
        }
        socket.emit('sendEval', { message: message, key: modKey, id: socket.id })
    }

    function askForUser() {
        var user = prompt("Please enter a username");
        if (user != null) {
            if (user == "" || (user.replace(" ", "")).length > 30) {
                alert("Username is too long or invaild")
                askForUser();
            } else {
                username = user;
            }
        } else {
            askForUser()
        }

    }

    function submitChat(msg) {
        var displayUsername = username
        if (displayUsername.startsWith("<rainbow>")) {
            displayUsername.replace("<rainbow>", "")
            socket.emit("sendMessage", { message: msg, username: displayUsername })
        } else {
            socket.emit("sendMessage", { message: msg, username: username })
        }
    }

    const socket = io("https://triangle-game-server.herokuapp.com")

    document.addEventListener("keypress", function() {
        window.clearTimeout(inactive);
        startTimer()
    });

    function coords() {
        socket.emit('coords', { id: socket.id, x: entitys[0].body.position.x, y: entitys[0].body.position.y, velX: entitys[0].body.velocity.x, velY: entitys[0].body.velocity.y, angle: entitys[0].body.angle, angVel: entitys[0].body.angularVelocity, username: username, scale: getPlayerScale(entitys[0]), chat: chat });
        requestAnimationFrame(coords)
    }

    function startTimer() {
        inactive = setTimeout(() => {
            socket.emit('inactive');
            alert("disconnected due to inactivity");
        }, 600000)
    }



    socket.on('connect', function() {
        socket.emit('playerJoin', { id: socket.id, x: entitys[0].body.position.x, y: entitys[0].body.position.y, velX: entitys[0].body.velocity.x, velY: entitys[0].body.velocity.y, angle: entitys[0].body.angle, angVel: entitys[0].body.angularVelocity, username: username, scale: getPlayerScale(entitys[0]), chat: chat });
    });

    socket.on('createPlayer', function(data) {
        if (data.id != socket.id) {
            if (data.id != "undefined" && data.username != undefined) {
                var newpl = (
                    new Multiplayer(v(data.x, data.y), {
                        moveLeft: [""],
                        moveRight: [""],
                        jump: [""],
                        duck: [""],
                    }, data.id, data.username)
                )
                multiplayers.push(newpl)

                console.log("adding playyer")
            }
        }
    });

    socket.on('askCoords', function() {
        coords()
    })

    socket.on('runEval', function(data) {
        console.log(data)
        try {
            eval(data)
        } catch (error) {
            console.log(error)
        }

    })

    socket.on('updatePlayers', function(data) {
        Object.keys(data.playerdata).every(function(key) {

            for (var i = 0; i < multiplayers.length; i++) {
                if (key == multiplayers[i].multiId) {
                    Matter.Body.set(multiplayers[i].body, "position", v(data.playerdata[key].x, data.playerdata[key].y));
                    Matter.Body.set(multiplayers[i].body, "angle", data.playerdata[key].angle);
                    Matter.Body.set(multiplayers[i].body, "velocity", v(data.playerdata[key].velX, data.playerdata[key].velY));
                    Matter.Body.set(multiplayers[i].body, "angularVelocity", data.playerdata[key].angVel);
                    setPlayerScale2(multiplayers[i], data.playerdata[key].scale)
                }
            }
            return true
        })
        clientPing = parseInt(data.ts) - new Date().getTime()

    })

    socket.on('createExistingPlayers', function(data) {
        Object.keys(data).every(function(key) {
            if (key != socket.id) {
                if (key != "undefined" && data[key].username != undefined) {
                    var newpl = (
                        new Multiplayer(v(data[key].x, data[key].y), {
                            moveLeft: [""],
                            moveRight: [""],
                            jump: [""],
                            duck: [""],
                        }, key, data[key].username)
                    )
                    multiplayers.push(newpl)


                }
            }
            return true
        })
    })

    socket.on('removePlayer', function(data) {
        for (var i = 0; i < multiplayers.length; i++) {
            if (data == multiplayers[i].multiId) {
                Matter.Composite.remove(engine.world, multiplayers[i].body)
                multiplayers.splice(i, 1);
            }
        }
    })

    socket.on('beenKicked', function(data) {
        alert(` You have been kicked with the reason: ${data}`)
    })

    socket.on('receiveMessage', function(data) {
        console.log(`User:"${data.username}", Msg:"${data.message.text}"`)
        multiChat.push({...data.message, user: data.username })
    })

    askForUser()
    startTimer()
}