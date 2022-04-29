function v(x, y) {
    return { x: x, y: y };
}

const times = [];
let fps;
var rainbowCount = 1

setInterval(() => {
if (rainbowCount == 7) {
    rainbowCount = 1
} else {
    rainbowCount++
}
}, 20)

var loading = 0,
    gameCompleted = localStorage.getItem("gameCompleted")

if (gameCompleted == null) {
    gameCompleted = false
}

function refreshLoop() {
    window.requestAnimationFrame(() => {
        const now = performance.now();
        while (times.length > 0 && times[0] <= now - 1000) {
            times.shift();
        }
        times.push(now);
        fps = times.length;
        refreshLoop();
    });
}
refreshLoop();

var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;
Composites = Matter.Composites;
Constraint = Matter.Constraint;

var engine = Engine.create();


var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: false,
        background: colorTheme.back
    },

});

initalRenderBounds = JSON.parse(JSON.stringify(render.bounds))

var canvas = render.canvas;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var mouse = Matter.Mouse.create(render.canvas);
var mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 1,
        render: { visible: true },
    },
});

//Matter.Composite.add(engine.world, mouseConstraint);

var runner = Matter.Runner.create();


Render.run(render);

var chunksComp = Matter.Composite.create({ label: "chunksComp" })

Matter.Composite.add(engine.world, chunksComp)

function getDst(a, b) {
    let xd = (a.x - b.x)
    let yd = (a.y - b.y)
    return Math.sqrt(Math.pow(xd, 2) + Math.pow(yd, 2))
}
var nith = false
Matter.Events.on(runner, "beforeUpdate", function() {

    patternDetection.updateLog()
    if (nith) patternDetection.findPatterns()

    Spawner.updateSpawns()

    Chunks.updateChunks()


    for (let i = 0; i < entitys.length; i++) {
        const entity = entitys[i];
        entity.update()
    }

    for (let i = 0; i < multiplayers.length; i++) {
        const multiplayer = multiplayers[i];
        multiplayer.update()
    }

    for (let i = 0; i < spawners.length; i++) {
        const entity = spawners[i];
        entity.update()
    }


    preKeys = {...keys }

    let distance = getDst(entitys[0].body.position, v(2910, -3190))
    if (distance > 1000) {

        Matter.Body.set(fakeGround, "position", v(2910, -3190))
        Matter.Body.set(fakeGround, "angle", 0)
        Matter.Body.set(fakeGround, "angularVelocity", 0)
        Matter.Body.set(fakeGround, "velocity", v(0, 0))

    }
    if (timeStamp >= 0) timeStamp += engine.timing.lastDelta / (1000 / 60) * 1.5

    if (keys["|"]) nith = true

});
var camera = v(0, 0)
Matter.Events.on(render, "beforeRender", function() {
    render.canvas.width = Matter.Common.clamp(window.innerWidth, 0, 1440)
    render.canvas.height = Matter.Common.clamp(window.innerHeight, 0, 789)
    render.context.save()
    hero = entitys[0].body.position

    let center = v(-render.canvas.width / 4, -render.canvas.height / 4)

    let targetPos = v(0, 0),
        scale = 1
    if (entitys.length > 1) {
        let sizeX = Matter.Common.clamp(Math.abs(entitys[0].body.position.x - entitys[1].body.position.x), 400, Infinity),
            scaleX = sizeX / 400,

            sizeY = Matter.Common.clamp(Math.abs(entitys[0].body.position.y - entitys[1].body.position.y), 400, Infinity),
            scaleY = sizeY / 400

        scale = Math.max(scaleX, scaleY) * 1.1


    }

    for (let i = 0; i < entitys.length; i++) {
        const ent = entitys[i];
        targetPos.x += ent.body.position.x
        targetPos.y += ent.body.position.y
    }
    targetPos.x /= entitys.length
    targetPos.y /= entitys.length

    let xDiff = targetPos.x - camera.x,
        yDiff = targetPos.y - camera.y

    camera.x += xDiff * 0.1
    camera.y += yDiff * 0.1

    // Follow Hero at X-axis
    render.bounds.min.x = (center.x * scale) + camera.x
    render.bounds.max.x = (center.x * scale) + camera.x + ((initalRenderBounds.max.x * scale) / 2)

    // Follow Hero at Y-axis
    render.bounds.min.y = (center.y * scale) + camera.y
    render.bounds.max.y = (center.y * scale) + camera.y + ((initalRenderBounds.max.y * scale) / 2)
    Matter.Render.startViewTransform(render)
})
Matter.Events.on(render, "afterRender", function() {
    let chunks = Chunks.getLoadedChunks(entitys[0].body.position)

    /*
    for (let i = 0; i < Object.keys(chunks).length; i++) {
        var chunk = Object.keys(chunks)[i];
        chunk = v(parseInt(chunk.split(",")[0]), parseInt(chunk.split(",")[1]))
        render.context.strokeRect(chunk.x*Chunks.chunkSize,chunk.y*Chunks.chunkSize,Chunks.chunkSize,Chunks.chunkSize)

    }
*/
    let img = document.createElement("img")
    img.src = imgs.hand

    var endPos = v(4837, -9955)

    render.context.drawImage(img, endPos.x, endPos.y)

    if (getDst(entitys[0].body.position, endPos) < 400 && timeStamp > 0) {
        timeStamp = -timeStamp
        console.log("yys")
    }

    for (var i = 0; i < multiplayers.length; i++) {
        var text = String(multiplayers[i].username)
        
        var turn = (Math.floor(new Date().getTime()/500) % 2) == 0

        
        
        render.context.fillStyle = "#000"
        
          if (text.startsWith("<rainbow>")) {
            if (rainbowCount == 1) {
                render.context.fillStyle = "#9400D3"
            } else if (rainbowCount == 2) {
                render.context.fillStyle = "#4B0082"
            } else if (rainbowCount == 3) {
                render.context.fillStyle = "#0000FF"
            } else if (rainbowCount == 4) {
                render.context.fillStyle = "#00FF00"
            } else if (rainbowCount == 5) {
                render.context.fillStyle = "#FFFF00"
            } else if (rainbowCount == 6) {
                render.context.fillStyle = "#FF7F00"
            } else if (rainbowCount == 7) {
                 render.context.fillStyle = "#FF0000"    
            }
                text = text.replace('<rainbow>','');
                }
        
        var length = render.context.measureText(text).width

        
        if (text == "⇥⎋⇤") {
            text = ((turn)?"☆★":"★☆")+ "ADMIN" + ((turn)?"★☆":"☆★")
            render.context.fillStyle = "#f00"
        }
        render.context.fillText(text, parseInt(multiplayers[i].body.position.x)-(length/2), parseInt(multiplayers[i].body.position.y)-30)
    }

    var testPos = v(-446.0919022968253, 124.92979674760744)

    Levels.texts.forEach(text => {
        render.context.fillStyle = "#000"
        render.context.strokeStyle = "#000"
        render.context.font = "10px Arial"
        render.context.fillText(text.text, text.x, text.y)
        render.context.strokeText(text.text, text.x, text.y)
    });
    for (let i = 0; i < chat.length; i++) {
        const msg = chat[i];
        if (msg.time < 0) {
            chat.splice(i, 1)
        } else {
            render.context.save()
            render.context.fillStyle = pSBC(-0.8, colorTheme.back)
            render.context.font = "10px Times New Roman"
            render.context.globalAlpha = Matter.Common.clamp((msg.time/100)*10, 0, 1)
            var length = render.context.measureText(msg.text).width
            render.context.fillText(msg.text, msg.pos.x+(length/2), msg.pos.y)
            render.context.globalAlpha = 1
            render.context.restore()
        }


            msg.time -= 0.25


    }
    for (let i = 0; i < multiChat.length; i++) {
        const msg = multiChat[i];
        
        if (msg.time < 0) {
            multiChat.splice(i, 1)
        } else {
            render.context.save()
            render.context.fillStyle = pSBC(-0.8, colorTheme.back)
            render.context.font = "10px Times New Roman"
            render.context.globalAlpha = Matter.Common.clamp((msg.time/100)*10, 0, 1)
            var length = render.context.measureText(msg.text).width
            render.context.fillText(msg.text, msg.pos.x+(length/2), msg.pos.y)
            render.context.globalAlpha = 1
            render.context.restore()
        }
        msg.time -= 0.25
        


    }
    render.context.fillStyle = pSBC(-0.8, colorTheme.back)

    if (typing) {
        var text = textMsg,
            length = render.context.measureText(textMsg).width
        
        render.context.save()

        render.context.font = "10px Times New Roman"
        render.context.fillText(textMsg+((((new Date().getTime()/1000)-Math.trunc((new Date().getTime()/1000)))*2>1) == 1?"|":""), entitys[0].body.position.x-(length/2), entitys[0].body.position.y-50)
        render.context.restore()

    }
    //render.context.fillText(`you get ${time}`,  camera.x-(window.innerWidth/4)+20, camera.y-(window.innerHeight/4)+20)
    render.context.fillText(`you get ${Math.floor(-timeStamp)/100}s cookies`, endPos.x, endPos.y)

    render.context.restore()
    render.context.font = '20px Arial'

    render.context.fillText(`${Math.round(Matter.Common.clamp((-entitys[0].body.position.y+10)/100, 0, Infinity))+2}m`, 10, 90)
    render.context.fillText(`Speed: ${Math.abs(Math.round(entitys[0].body.velocity.x * 100) / 100)}`, 10, 120)
    render.context.fillText(`FPS: ${fps}`, 10, 150)
    if (multiplayers.length > 0) render.context.fillText(`players: ${multiplayers.length+1}`, 10, 195)
    
    
       
    
    if (gameCompleted) {
        if (timeStamp < 0) {
            render.context.fillText(`${Math.floor(-timeStamp/10)/10} cookies`, 10, 240)
        } else {
            render.context.fillText(`${Math.floor(timeStamp/10)/10} cookies`, 10, 240)
        }
    }

    if (showMap) {
        render.context.save()
        var scale = 0.63,
            playerScale = 0.05

            render.context.translate(500, 752.5)
        render.context.scale(scale, scale)
        
        var mapImg = document.createElement("img")
        mapImg.src = "gameMap.png"
        render.context.globalAlpha = 0.75
        render.context.save()
        render.context.translate(-156.5, -1185)
        render.context.drawImage(mapImg, 0, 0)

        render.context.restore()
        render.context.globalAlpha = 1

        var playerScale = 0.10000

        var playerTranslate = v(0, 0)
        for (let i = 0; i < multiplayers.length; i++) {
            const player = multiplayers[i];
            render.context.fillStyle = "#000"
            render.context.fillRect((player.body.position.x*playerScale)+playerTranslate.x, (player.body.position.y*playerScale)+playerTranslate.y, 5, 5)
        }
        render.context.fillStyle = "#f00"

        render.context.fillRect((entitys[0].body.position.x*playerScale)+playerTranslate.x, (entitys[0].body.position.y*playerScale)+playerTranslate.y, 5, 5)
        render.context.restore()
    }
    
    for (let i = 0; i < multiChat.length; i++) {
        const chat = multiChat[(multiChat.length-1)-i];
        var ctx = render.context
        
        let msg = (chat.user == "⇥⎋⇤")?"ADMIN":chat.user
        if (chat.user.startsWith("<rainbow>")) {
           let msg = chat.user.replace('<rainbow>', '')
        }
        var text = `[${msg}]: ${chat.text}`
        
        ctx.fillStyle = (chat.user == "⇥⎋⇤")?"#f00":"#000"

        ctx.fillText(text, 20, render.canvas.height-100-(i*30))
    }

    renderButtons()

    if (loading < 1) {
        render.context.fillStyle = pSBC(-0.3, colorTheme.back)
        render.context.fillRect(0, 0, render.canvas.width, render.canvas.height)

        render.context.fillStyle = pSBC(0.8, colorTheme.back)
        let barPos = v(render.canvas.width / 2, render.canvas.height / 2)
        render.context.fillRect(barPos.x - 50, barPos.y - 10, 100, 20)

        render.context.fillStyle = pSBC(-0.8, colorTheme.back)
        render.context.fillRect(barPos.x - 45, barPos.y - 7.5, (loading * 90), 15)
        loading += 0.01 * Math.random()


        render.context.fillStyle = "#000"
        let text = tip,
            width = render.context.measureText(text).width
        render.context.fillText("Tip:", barPos.x - (32.59765625 / 2), barPos.y + 50)
        render.context.fillText(text, barPos.x - (width / 2), barPos.y + 70)
    } else if (loading != 2) {
        Matter.Runner.start(runner, engine);
        loading = 2
    }
})
var music = new Audio("assets/sfx/musicTrack1.mp3")

music.volume = 1
music.loop = true
