function v(x, y) {
  return { x: x, y: y };
}

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
      wireframes:false,
      background:colorTheme.back
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

Matter.Runner.start(runner, engine);

Render.run(render);

var chunksComp = Matter.Composite.create({label:"chunksComp"})

Matter.Composite.add(engine.world, chunksComp)

function getDst(a, b) {
    let xd = (a.x - b.x)
    let yd = (a.y - b.y)
    return Math.sqrt(Math.pow(xd, 2) + Math.pow(yd, 2))
}

Matter.Events.on(runner, "beforeUpdate", function () {

    

    Spawner.updateSpawns()

    Chunks.updateChunks()


    for (let i = 0; i < entitys.length; i++) {
        const entity = entitys[i];
        entity.update()
    }

    for (let i = 0; i < spawners.length; i++) {
        const entity = spawners[i];
        entity.update()
    }


    preKeys = {...keys}

    let distance = getDst(entitys[0].body.position, v(2910, -3190))
    if (distance > 1000) {
        
        Matter.Body.set(fakeGround, "position", v(2910, -3190))
        Matter.Body.set(fakeGround, "angle", 0)
        Matter.Body.set(fakeGround, "angularVelocity", 0)
        Matter.Body.set(fakeGround, "velocity", v(0, 0))
        
    } 



});
var camera = v(0,0)
Matter.Events.on(render, "beforeRender", function() {
    render.canvas.width = Matter.Common.clamp(window.innerWidth, 0, 1440)
    render.canvas.height = Matter.Common.clamp(window.innerHeight, 0, 789)
    render.context.save()
    hero = entitys[0].body.position

    let center = v(-render.canvas.width/4, -render.canvas.height/4)

    let targetPos = v(0,0),
        scale = 1
    if (entitys.length > 1) {
        let sizeX = Matter.Common.clamp(Math.abs(entitys[0].body.position.x-entitys[1].body.position.x), 400, Infinity),
            scaleX = sizeX/400,

            sizeY = Matter.Common.clamp(Math.abs(entitys[0].body.position.y-entitys[1].body.position.y), 400, Infinity),
            scaleY = sizeY/400

            scale = Math.max(scaleX, scaleY)


    }

    for (let i = 0; i < entitys.length; i++) {
        const ent = entitys[i];
        targetPos.x += ent.body.position.x
        targetPos.y += ent.body.position.y
    }
    targetPos.x /= entitys.length
    targetPos.y /= entitys.length

    let xDiff = targetPos.x-camera.x,
        yDiff = targetPos.y-camera.y

    camera.x += xDiff * 0.1
    camera.y += yDiff * 0.1

    // Follow Hero at X-axis
    render.bounds.min.x = (center.x*scale) + camera.x
    render.bounds.max.x = (center.x*scale) + camera.x + ((initalRenderBounds.max.x*scale)/2)

    // Follow Hero at Y-axis
    render.bounds.min.y = (center.y*scale) + camera.y
    render.bounds.max.y = (center.y*scale) + camera.y + ((initalRenderBounds.max.y*scale)/2)
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

    render.context.drawImage(img, 3716, -3454)

    if (getDst(entitys[0].body.position, v(3716, -3454)) < 400 && startTime > 0) {
        startTime = -(((new Date().getTime())-startTime)/1000)
        console.log("yys")
    }

    let time = `${((new Date().getTime())-startTime)/1000}`

    if (startTime < 0) {
        time = -startTime
    }
  
    Levels.texts.forEach(text => {
        render.context.fillStyle = "#000"
        render.context.strokeStyle = "#000"
        render.context.fillText(text.text,  text.x, text.y)
        render.context.strokeText(text.text,  text.x, text.y)
    });
    

    //render.context.fillText(`you get ${time}`,  camera.x-(window.innerWidth/4)+20, camera.y-(window.innerHeight/4)+20)
    render.context.fillText(`you get ${Math.floor(time*100)/100}s cookies`,  3716, -3454)
    render.context.restore()
    renderButtons()
})

var music = new Audio("musicTrack1.mp3")

music.volume = 0.2
music.loop = true
