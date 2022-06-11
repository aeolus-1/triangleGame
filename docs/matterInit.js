function v(x, y) {
  return { x: x, y: y };
}

const times = [];
let fps;
var rainbowCount = 1;
var showMenu = true;
var gameMode;
var startMulti = true;

setInterval(() => {
  if (rainbowCount == 7) {
    rainbowCount = 1;
  } else {
    rainbowCount++;
  }
}, 20);

var loading = 1,
  gameCompleted2 = JSON.parse(localStorage.getItem("gameCompleted2"));

if (gameCompleted2 == null) {
  gameCompleted2 = false;
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
    background: colorTheme.back,
  },
});

initalRenderBounds = JSON.parse(JSON.stringify(render.bounds));

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


var chunksComp = Matter.Composite.create({ label: "chunksComp" });

Matter.Composite.add(engine.world, chunksComp);

function getDst(a, b) {
  let xd = a.x - b.x;
  let yd = a.y - b.y;
  return Math.sqrt(Math.pow(xd, 2) + Math.pow(yd, 2));
}
var nith = false;
Matter.Events.on(runner, "beforeUpdate", function () {
  patternDetection.updateLog();
  if (nith) patternDetection.findPatterns();

  Spawner.updateSpawns();

  Chunks.updateChunks();

  patternDetection.findPatterns()

  for (let i = 0; i < entitys.length; i++) {
    const entity = entitys[i];
    entity.update();
    if (entity.body.position.y > 650) {
        var translate = {...entitys[0].body.position}
        Matter.Body.set(entitys[0].body, "position", v(-113, -200))
        translate = {x:translate.x-entitys[0].body.position.x, y:translate.y-entitys[0].body.position.y}
        console.log(translate)
        camera.x -= translate.x
        camera.y -= translate.y
        Matter.Body.set(entitys[0].body, "velocity", v(entitys[0].body.velocity.x*0.8, entitys[0].body.velocity.y*0.8))
    }
  }

  for (let i = 0; i < multiplayers.length; i++) {
    const multiplayer = multiplayers[i];
    multiplayer.update();
  }
  var preSpawners = new Array()
  for (let i = 0; i < spawners.length; i++) {
    const entity = spawners[i];
    var spawnPos = `x:${entity.pos.x},y:${entity.pos.y}`
    if (!preSpawners.includes(spawnPos)) {
      entity.update();
      preSpawners.push(spawnPos)
    } else {
      spawners.splice(i, 1)
    }

  }

  preKeys = { ...keys };

  var bodies = Matter.Composite.allBodies(engine.world)
  bodies.forEach(bod => {
    if (bod.rotating) {
      var rot = (new Date().getTime() % 6000)/6000
      Matter.Body.set(bod, "angle", rot*360*(Math.PI/180))
    }
  });
  var gameCompletedOnlyRender = {
    fillStyle: `${colorTheme.platforms}7d`,
    lineWidth: 0,
    opacity: 1,
    sprite: {xScale: 1, yScale: 1, xOffset: 0.5, yOffset: 0.5},
    strokeStyle: "#555",
    visible: true,
  },
  nonGameCompletedOnlyRender = {
    fillStyle: colorTheme.platforms,
    lineWidth: 0,
    opacity: 1,
    sprite: {xScale: 1, yScale: 1, xOffset: 0.5, yOffset: 0.5},
    strokeStyle: "#555",
    visible: true,
  }
  Levels.completedOnly.forEach(bod => {
    if (!gameCompleted2) {
      bod.render = gameCompletedOnlyRender
      bod.collisionFilter = {
        'group': -1,
        'category': 2,
        'mask': 0,
      };
    } else {
      bod.render = nonGameCompletedOnlyRender
      bod.collisionFilter = {
        'group': 0,
        'category': 1,
        'mask': 4294967295,
      };
    }
  })

  let distance = getDst(entitys[0].body.position, v(2910, -3190));
  if (distance > 1000) {
    Matter.Body.set(fakeGround, "position", v(2910, -3190));
    Matter.Body.set(fakeGround, "angle", 0);
    Matter.Body.set(fakeGround, "angularVelocity", 0);
    Matter.Body.set(fakeGround, "velocity", v(0, 0));
  }
  if (timeStamp >= 0)
    timeStamp += (engine.timing.lastDelta / (1000 / 60)) * 1.5;

  if (keys["|"]) nith = true;
});
var camera = v(0, 0);
Matter.Events.on(render, "beforeRender", function () {
  render.canvas.width = Matter.Common.clamp(window.innerWidth, 0, 1440);
  render.canvas.height = Matter.Common.clamp(window.innerHeight, 0, 821);
  render.context.save();
  hero = entitys[0].body.position;

  let center = v(-render.canvas.width / 4, -render.canvas.height / 4);

  let targetPos = v(0, 0),
    scale = 1;
  if (entitys.length > 1) {
    let sizeX = Matter.Common.clamp(
      Math.abs(entitys[0].body.position.x - entitys[1].body.position.x),
      400,
      Infinity
    ),
      scaleX = sizeX / 400,
      sizeY = Matter.Common.clamp(
        Math.abs(entitys[0].body.position.y - entitys[1].body.position.y),
        400,
        Infinity
      ),
      scaleY = sizeY / 400;

    scale = Math.max(scaleX, scaleY) * 1.1;
  }

  for (let i = 0; i < entitys.length; i++) {
    const ent = entitys[i];
    targetPos.x += ent.body.position.x;
    targetPos.y += ent.body.position.y;
  }
  targetPos.x /= entitys.length;
  targetPos.y /= entitys.length;

  let xDiff = targetPos.x - camera.x,
    yDiff = targetPos.y - camera.y;

  camera.x += xDiff * 0.2;
  camera.y += yDiff * 0.2;

  // Follow Hero at X-axis
  render.bounds.min.x = center.x * scale + camera.x;
  render.bounds.max.x =
    center.x * scale + camera.x + (initalRenderBounds.max.x * scale) / 2;

  // Follow Hero at Y-axis
  render.bounds.min.y = center.y * scale + camera.y;
  render.bounds.max.y =
    center.y * scale + camera.y + (initalRenderBounds.max.y * scale) / 2;
  Matter.Render.startViewTransform(render);
});
Matter.Events.on(render, "afterRender", function () {
  let chunks = Chunks.getLoadedChunks(entitys[0].body.position);

  /*
    for (let i = 0; i < Object.keys(chunks).length; i++) {
        var chunk = Object.keys(chunks)[i];
        chunk = v(parseInt(chunk.split(",")[0]), parseInt(chunk.split(",")[1]))
        render.context.strokeRect(chunk.x*Chunks.chunkSize,chunk.y*Chunks.chunkSize,Chunks.chunkSize,Chunks.chunkSize)

    }
*/
  let img = document.createElement("img");
  img.src = imgs.hand;

  var endPos = v(4837, -9955);

  render.context.drawImage(img, endPos.x, endPos.y);

  if (getDst(entitys[0].body.position, endPos) < 400 && timeStamp > 0) {
    timeStamp = -timeStamp;
    gameCompleted2 = true;
    console.log("yys");
    clicky.goal("completed game")
  }

  for (var i = 0; i < multiplayers.length; i++) {
    var text = String(multiplayers[i].username);

    render.context.fillStyle = "#000";
    var pos = v(
      parseInt(multiplayers[i].body.position.x),
      parseInt(multiplayers[i].body.position.y) - 30
    ),
      length = measureTextTags(render.context, text);

    drawTagText(render.context, text, v(pos.x - length / 2, pos.y));

    //render.context.fillText(text, parseInt(multiplayers[i].body.position.x) - (length / 2), parseInt(multiplayers[i].body.position.y) - 30)
  }

  var testPos = v(-446.0919022968253, 124.92979674760744);

  Levels.texts.forEach((text) => {
    render.context.fillText(text.text, text.x, text.y)
  });
  for (let i = 0; i < chat.length; i++) {
    const msg = chat[i];
    if (msg.time < 0) {
      chat.splice(i, 1);
    } else {
      render.context.save();
      render.context.fillStyle = pSBC(-0.8, colorTheme.back);
      render.context.font = "10px Times New Roman";
      render.context.globalAlpha = Matter.Common.clamp(
        (msg.time / 100) * 10,
        0,
        1
      );
      render.context.globalAlpha = 1;
      render.context.restore();
    }

    msg.time -= 0.25;
  }
  for (let i = 0; i < multiChat.length; i++) {
    const msg = multiChat[i];

    if (msg.time < 0) {
      multiChat.splice(i, 1);
    } else {
      if (msg.type == "msg") {
        render.context.save();
        render.context.globalAlpha = Matter.Common.clamp(
          (msg.time / 100) * 10,
          0,
          1
        );
        var length = measureTextTags(render.context, msg.text, 10);
        
        drawTagText(render.context, msg.text, v(msg.pos.x + length / 2, msg.pos.y), 10);

        
        
        render.context.globalAlpha = 1;
        render.context.restore();
      }
    }
    msg.time -= 0.25;
  }
  render.context.fillStyle = pSBC(-0.8, colorTheme.back);

  if (typing) {
    var text = textMsg,
      length = render.context.measureText(textMsg).width;

    render.context.save();

    render.context.font = "10px Times New Roman";
    render.context.fillText(
      textMsg +
      ((new Date().getTime() / 1000 -
        Math.trunc(new Date().getTime() / 1000)) *
        2 >
        1 ==
        1
        ? "|"
        : ""),
      entitys[0].body.position.x - length / 2,
      entitys[0].body.position.y - 50
    );
    render.context.restore();
  }
  //render.context.fillText(`you get ${time}`,  camera.x-(window.innerWidth/4)+20, camera.y-(window.innerHeight/4)+20)
  render.context.fillText(
    `you get ${Math.floor(-timeStamp) / 100}s cookies`,
    endPos.x,
    endPos.y
  );

  render.context.restore();
  render.context.font = "20px Arial";

  render.context.fillText(
    `${Math.round(
      Matter.Common.clamp(
        (-entitys[0].body.position.y + 10) / 100,
        0,
        Infinity
      )
    ) + 2
    }m`,
    10,
    90
  );
  render.context.fillText(
    `Speed: ${Math.abs(Math.round(entitys[0].body.velocity.x * 100) / 100)}`,
    10,
    120
  );
  render.context.fillText(`FPS: ${fps}`, 10, 150);
  render.context.fillText(`Ping: ${Math.abs(clientPing)}ms`, 10, 180);
  if (multiplayers.length > 0)
    render.context.fillText(`players: ${multiplayers.length + 1}`, 10, 210);

  if (gameCompleted2) {
    if (timeStamp < 0) {
      render.context.fillText(
        `${Math.floor(-timeStamp / 10) / 10} cookies`,
        10,
        240
      );
    } else {
      render.context.fillText(
        `${Math.floor(timeStamp / 10) / 10} cookies`,
        10,
        240
      );
    }
  }

  if (showMap) {
    render.context.save();
    var scale = 0.63,
      playerScale = 0.05;

    render.context.translate(500, 752.5);
    render.context.scale(scale, scale);

    var mapImg = document.createElement("img");
    mapImg.src = "gameMap.png";
    render.context.globalAlpha = 0.75;
    render.context.save();
    render.context.translate(-156.5, -1185);
    render.context.drawImage(mapImg, 0, 0);

    render.context.restore();
    render.context.globalAlpha = 1;

    var playerScale = 0.1;

    var playerTranslate = v(0, 0);
    for (let i = 0; i < multiplayers.length; i++) {
      const player = multiplayers[i];
      render.context.fillStyle = "#000";
      render.context.fillRect(
        player.body.position.x * playerScale + playerTranslate.x,
        player.body.position.y * playerScale + playerTranslate.y,
        5,
        5
      );
    }
    render.context.fillStyle = "#f00";

    render.context.fillRect(
      entitys[0].body.position.x * playerScale + playerTranslate.x,
      entitys[0].body.position.y * playerScale + playerTranslate.y,
      5,
      5
    );
    render.context.restore();
  }

  for (let i = 0; i < multiChat.length; i++) {
    const chat = multiChat[multiChat.length - 1 - i];
    var ctx = render.context;

    let msg = chat.user == "⇥⎋⇤" ? "ADMIN" : chat.user;
    if (chat.user.startsWith("<rainbow>")) {
      let msg = chat.user.replace("<rainbow>", "");
    }
    var text = `[${msg}]: ${chat.text}`;

    ctx.fillStyle = chat.user == "⇥⎋⇤" ? "#f00" : "#000";

    if (chat.type == "join") {
      ctx.fillStyle = "#eaf200";
      let length = measureTextTags(ctx, `${msg} `);

      drawTagText(
        ctx,
        `${msg}`,
        v(20, render.canvas.height - 100 - i * 30),
        false
      );
      drawTagText(
        ctx,
        `has joined`,
        v(20 + length, render.canvas.height - 100 - i * 30),
        false
      );
    } else if (chat.type == "left") {
      ctx.fillStyle = "#eaf200";
      let length = measureTextTags(ctx, `${msg} `);

      drawTagText(
        ctx,
        `${msg}`,
        v(20, render.canvas.height - 100 - i * 30),
        false
      );
      drawTagText(
        ctx,
        `has left`,
        v(20 + length, render.canvas.height - 100 - i * 30),
        false
      );
    } else {
      //ctx.fillText(text, 20, render.canvas.height - 100 - (i * 30))
      let length = measureTextTags(ctx, `${msg} `);

      drawTagText(
        ctx,
        `[${msg}`,
        v(20, render.canvas.height - 100 - i * 30),
        false
      );
      drawTagText(
        ctx,
        `] : ${chat.text}`,
        v(20 + length, render.canvas.height - 100 - i * 30),
        false
      );
    }
  }

  renderButtons();

  if (showMenu == true) {
    var singleButton = {
      x: render.canvas.width / 2 - 100,
      y: 120,
      width: 200,
      height: 50,
    },
      multiButton = {
        x: render.canvas.width / 2 - 100,
        y: 225,
        width: 200,
        height: 50,
      };

    render.context.fillStyle = pSBC(-0.3, colorTheme.back);
    render.context.fillRect(0, 0, render.canvas.width, render.canvas.height);

    render.context.fillStyle = pSBC(0.8, colorTheme.back);
    render.context.font = "40px Arial";
    render.context.fillStyle = "#000000";
    title = "Untitled Triangle Game";
    render.context.fillText(
      title,
      render.canvas.width / 2 - render.context.measureText(title).width / 2,
      45
    );
    render.context.fillStyle = pSBC(-0.7, colorTheme.back);
    render.context.fillRect(
      singleButton.x,
      singleButton.y,
      singleButton.width,
      singleButton.height
    );
    render.context.fillRect(
      multiButton.x,
      multiButton.y,
      multiButton.width,
      multiButton.height
    );
    render.context.font = "25px Arial";
    render.context.fillStyle = "#000000";
    single = "Singleplayer";
    render.context.fillText(
      "Singleplayer",
      render.canvas.width / 2 - render.context.measureText(single).width / 2,
      155
    );
    multi = "Multiplayer";
    render.context.fillText(
      "Multiplayer",
      render.canvas.width / 2 - render.context.measureText(multi).width / 2,
      257
    );
  } else {
    if (loading < 1) {
      render.context.fillStyle = pSBC(-0.3, colorTheme.back);
      render.context.fillRect(0, 0, render.canvas.width, render.canvas.height);

      render.context.fillStyle = pSBC(0.8, colorTheme.back);
      let barPos = v(render.canvas.width / 2, render.canvas.height / 2);
      render.context.fillRect(barPos.x - 50, barPos.y - 10, 100, 20);

      render.context.fillStyle = pSBC(-0.8, colorTheme.back);
      render.context.fillRect(barPos.x - 45, barPos.y - 7.5, loading * 90, 15);
      loading += 0.01 * Math.random();

      render.context.fillStyle = "#000";
      let text = tip,
        width = render.context.measureText(text).width;
      render.context.fillText(
        "Tip:",
        barPos.x - 32.59765625 / 2,
        barPos.y + 50
      );
      render.context.fillText(text, barPos.x - width / 2, barPos.y + 70);
    } else if (loading != 2) {
      Matter.Runner.start(runner, engine);

      loading = 2;
    }
  }
  if (hiding) {
    render.context.scale(0.5, 0.5);
    render.context.globalAlpha = 0.975;
    var imgEle = document.createElement("img");
    imgEle.src = "cover.png";
    render.context.drawImage(imgEle, 0, 0);
    render.context.scale(2, 2);
    render.context.globalAlpha = 1;
  }

  document.addEventListener("click", (e) => {
    if (showMenu) {
      if (didClick(e.offsetY, e.offsetX, singleButton)) {
        showMenu = false;
        gameMode = "singleplayer";
      } else if (didClick(e.offsetY, e.offsetX, multiButton)) {
        showMenu = false;
        gameMode = "multiplayer";
        if (startMulti == true) {
          var head = document.getElementsByTagName("head")[0];
          var script = document.createElement("script");
          script.src = "multiplayer.js";
          head.appendChild(script);
          startMulti = false;
        }
      }
    }
  });

  function didClick(yVal, xVal, ele) {
    return (
      yVal > ele.y &&
      yVal < ele.y + ele.height &&
      xVal > ele.x &&
      xVal < ele.x + ele.width
    );
  }
});
var music = new Audio("assets/sfx/musicTrack1.mp3");

music.volume = 1;
music.loop = true;
