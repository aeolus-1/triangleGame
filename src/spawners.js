var spawns = Matter.Composite.create(),
    spawners = new Array()

setTimeout(function(){Matter.Composite.add(engine.world, spawns)}, 10)


class Spawner {
    constructor(pos, ticks, halfLife) {
        this.pos = pos
        this.tick = 0.02
        this.subtraction = 1/ticks

        this.halfLife = halfLife
    }
    update() {
        this.tick -= this.subtraction
        if (this.tick <= 0) {
            this.tick = 1
            let newSpawn = Matter.Bodies.circle(this.pos.x, this.pos.y, 50, {
                friction:0,
                density:0.01,
                render:{
                    fillStyle:"#000"
                }
            })

            newSpawn.halfLife = this.halfLife
            
            Matter.Composite.add(spawns, newSpawn)
        }
    }

    static updateSpawns() {
        for (let i = 0; i < spawns.bodies.length; i++) {
            const spawn = spawns.bodies[i];
            spawn.halfLife -= 1
            if (spawn.halfLife <= 0) {
                Matter.Composite.remove(spawns, spawn)
            }
        }
    }
}
