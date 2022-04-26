if (confirm("Would you like to join multiplayer? \n \n \n multiplayer made by jake cause im cool")) {
    var inactive;
    const socket = io("https://triangle-game-server.herokuapp.com")

    document.addEventListener("keypress", function() {
        window.clearTimeout(inactive);
        startTimer()
    });

    function coords() {
        socket.emit('coords', { id: socket.id, x: entitys[0].body.position.x, y: entitys[0].body.position.y, velX: entitys[0].body.velocity.x, velY: entitys[0].body.velocity.y, angle: entitys[0].body.angle, angVel: entitys[0].body.angularVelocity });
        requestAnimationFrame(coords)
    }

    function startTimer() {
        inactive = setTimeout(() => {
            socket.emit('inactive');
            alert("disconnected due to inactivity");
        }, 300000)
    }

    socket.on('connect', function() {
        socket.emit('playerJoin', { id: socket.id, x: entitys[0].body.position.x, y: entitys[0].body.position.y, velX: entitys[0].body.velocity.x, velY: entitys[0].body.velocity.y, angle: entitys[0].body.angle, angVel: entitys[0].body.angularVelocity });
    });

    socket.on('createPlayer', function(data) {
        if (data.id != socket.id) {
            if (data.id != "undefined") {
                var newpl = (
                    new  Multiplayer(v(data.x, data.y), {
                        moveLeft: [""],
                        moveRight: [""],
                        jump: [""],
                        duck: [""],
                    }, data.id)
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
            for (var i = 0; i <  multiplayers.length; i++) {
                if (key ==  multiplayers[i].multiId) {
                    Matter.Body.set( multiplayers[i].body, "position", v(data[key].x, data[key].y));
                    Matter.Body.set( multiplayers[i].body, "angle", data[key].angle);
                    Matter.Body.set( multiplayers[i].body, "velocity", v(data[key].velX, data[key].velY));
                    Matter.Body.set( multiplayers[i].body, "angularVelocity", data[key].angVel);
                }
            }
            return true
        })
    })

    socket.on('createExistingPlayers', function(data) {
        Object.keys(data).every(function(key) {
            if (key != socket.id) {
                if (key != "undefined") {
                    var newpl = (
                        new Multiplayer(v(data[key].x, data[key].y), {
                            moveLeft: [""],
                            moveRight: [""],
                            jump: [""],
                            duck: [""],
                        }, key)
                    )
                     multiplayers.push(newpl)
                }
            }
            return true
        })
    })

    socket.on('removePlayer', function(data) {
        for (var i = 0; i <  multiplayers.length; i++) {
            if (data ==  multiplayers[i].multiId) {
                Matter.Composite.remove(engine.world,  multiplayers[i].body)
                 multiplayers.splice(i, 1);
            }
        }
    })
    startTimer()
}
