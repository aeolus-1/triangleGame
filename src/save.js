class Save {
  static saveGame() {
    let spawnsDat = []
    spawns.bodies.forEach(body => {
      spawnsDat.push({
        pos:body.position,
        velocity:body.velocity,
        angularVelocity:body.angularVelocity
      })
    });
    localStorage.setItem(
      "save_cubePlayer",
      btoa(JSON.stringify({
        pos: v(entitys[0].body.position.x, entitys[0].body.position.y),
        angle: entitys[0].body.angle,
        velocity: v(entitys[0].body.velocity.x, entitys[0].body.velocity.y),
        angularVelocity: entitys[0].body.angularVelocity,

        spawns:spawnsDat,


    }))
    );
  }

  static loadGame() {
    if (localStorage.getItem("save_cubePlayer") != null) {
      let data = (JSON.parse(atob(localStorage.getItem("save_cubePlayer"))));
      console.log(data.spawns);
      data.spawns.forEach(spawn => {
        let newSpawn = Matter.Bodies.circle(spawn.pos.x,spawn.pos.y, 50, {
            friction:0,
            density:0.01,
            render:{
              fillStyle:"#000"
            }
        })
        Matter.Body.set(newSpawn, "velocity", spawn.velocity)
        Matter.Body.set(newSpawn, "angularVelocity", spawn.angularVelocity)

        newSpawn.halfLife = 400
        
        Matter.Composite.add(spawns, newSpawn)
      });
      Matter.Body.set(entitys[0].body, "position", v(data.pos.x, data.pos.y));
      Matter.Body.set(entitys[0].body, "angle", data.angle);

      Matter.Body.set(entitys[0].body, "velocity", v(data.velocity.x, data.velocity.y));
      Matter.Body.set(entitys[0].body, "angularVelocity", data.angularVelocity);

      camera = { ...data.pos };
    }
  }
}
