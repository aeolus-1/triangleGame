class Save {
  static saveGame() {
    localStorage.setItem(
      "save_cubePlayer",
      btoa(JSON.stringify({
        pos: v(entitys[0].body.position.x, entitys[0].body.position.y),
        angle: entitys[0].body.angle,
        velocity: v(entitys[0].body.velocity.x, entitys[0].body.velocity.y),
        angularVelocity: entitys[0].body.angularVelocity,


    }))
    );
  }

  static loadGame() {
    if (localStorage.getItem("save_cubePlayer") != null) {
      let data = (JSON.parse(atob(localStorage.getItem("save_cubePlayer"))));
      console.log(data.pos);
      Matter.Body.set(entitys[0].body, "position", v(data.pos.x, data.pos.y));
      Matter.Body.set(entitys[0].body, "angle", data.angle);

      Matter.Body.set(entitys[0].body, "velocity", v(data.velocity.x, data.velocity.y));
      Matter.Body.set(entitys[0].body, "angularVelocity", data.angularVelocity);

      camera = { ...data.pos };
    }
  }
}
