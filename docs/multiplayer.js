if (confirm("Would you like to join multiplayer? \n \n \n multiplayer made by jake cause im cool")) {
    var inactive;
    var username;
    var hashedKey = "244dc524b6bba33086418c1a68cb4bd95304a2562489c6c19d5c785979f48b7f"
    var chatMsg = new Array()
    var chatInput = document.getElementById("chatInput")
    function getMultiByUser(username){
        for (let i = 0; i < multiplayers.length; i++) {
            if (multiplayers[i].username == username) {
                return multiplayers[i]
            }
        }
    }
    
    function kick(id, message) {
        var modKey = localStorage.getItem("moderationKey")
        var hash = CryptoJS.SHA256(modKey);
        if (hash.toString() == hashedKey) {
            if (message == undefined) {
                message = "No reason Given"
            }
            socket.emit('kick', { id: id, message: message })
        } else {
            console.log("wrong mod key")
        }

    }

    function askForUser() {
        var user = prompt("Please enter a username");
        if (user != null) {
            if (user == "" || user.length > 30) {
                alert("Username is too long or invaild")
                askForUser();
            } else {
                username = user;
            }
        } else {
            askForUser()
        }

    }
    
    function submitChat() {
        message = chatInput.value
        socket.emit("sendMessage", {message: message, username: username})
        chatInput.value = ""
    }
    const socket = io("https://triangle-game-server.herokuapp.com")

    document.addEventListener("keypress", function(e) {
        window.clearTimeout(inactive);
        startTimer()
        if (e.key === "Enter") {
            submitChat()
        }
    });

    function coords() {
        socket.emit('coords', { id: socket.id, x: entitys[0].body.position.x, y: entitys[0].body.position.y, velX: entitys[0].body.velocity.x, velY: entitys[0].body.velocity.y, angle: entitys[0].body.angle, angVel: entitys[0].body.angularVelocity, username: username, scale: getPlayerScale(entitys[0]) });
        requestAnimationFrame(coords)
    }

    function startTimer() {
        inactive = setTimeout(() => {
            socket.emit('inactive');
            alert("disconnected due to inactivity");
        }, 600000)
    }

    

    socket.on('connect', function() {
        socket.emit('playerJoin', { id: socket.id, x: entitys[0].body.position.x, y: entitys[0].body.position.y, velX: entitys[0].body.velocity.x, velY: entitys[0].body.velocity.y, angle: entitys[0].body.angle, angVel: entitys[0].body.angularVelocity, username: username, scale: getPlayerScale(entitys[0]) });
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

    socket.on('updatePlayers', function(data) {
        Object.keys(data).every(function(key) {
            for (var i = 0; i < multiplayers.length; i++) {
                if (key == multiplayers[i].multiId) {
                    Matter.Body.set(multiplayers[i].body, "position", v(data[key].x, data[key].y));
                    Matter.Body.set(multiplayers[i].body, "angle", data[key].angle);
                    Matter.Body.set(multiplayers[i].body, "velocity", v(data[key].velX, data[key].velY));
                    Matter.Body.set(multiplayers[i].body, "angularVelocity", data[key].angVel);
                    setPlayerScale(multiplayers[i], data[key].scale)
                }
            }
            return true
        })
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
        chatMsg.push(data)
        setTimeout(() => {
            chatMsg.slice(0, 1);
        }, 10000)
    })

    askForUser()
    startTimer()
}
