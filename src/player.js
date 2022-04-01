var num = false

class Entity {
    constructor(pos, scale) {
        this.body = Matter.Bodies.rectangle(pos.x, pos.y, scale, scale,{
            frictionAir:0,
            restitution:0.1,
            friction:0.7,
            render:{
                fillStyle:colorTheme.player
            }
        })

        this.collisions = []

        Matter.Composite.add(engine.world, this.body)
    }
}

class Player extends Entity {
    constructor(pos, keyset) {
        var scale = 1
        super(pos, scale*30)
        this.scale = scale

        

        this.keyset = keyset
        this.jumpTime = 0


    }

    updateControls() {



        let speed = (Math.PI*2)*0.005,
            jump = 8.5*this.scale

        let entityBodies = new Array()
        for (let i = 0; i < entitys.length; i++) {
            const ent = entitys[i];
            entityBodies.push(ent.body)
        }

        
        let otherBodies = new Array()
        for (let i = 0; i < engine.world.bodies.length; i++) {
            const body = engine.world.bodies[i];
            if (body.id != this.body.id && body.id != fakeGround.id) otherBodies.push(body)
        }

        let detector = ((Matter.Detector.collisions(Matter.Detector.create({
            bodies:[this.body, ...Levels.getGroundBodies(), ...otherBodies]
        })))),
        detector2 = ((Matter.Detector.collisions(Matter.Detector.create({
            bodies:[this.body, fakeGround]
        })))),
        onGround = false

        let altEnt = !(this.body.id != entitys[0].body.id)

        let changeNum = this.collisions.length

        if (detector.length > 0) {
            for (let i = 0; i < detector.length; i++) {
                const coll = detector[i];
                let includesBody = ((coll.bodyA.id == this.body.id) || (coll.bodyB.id == this.body.id))
                if (Math.floor(coll.normal.y+0.15) == ((coll.bodyA.id == this.body.id || altEnt)?-1:1) && includesBody) {
                    onGround = true
                    this.jumpTime = 15


                }
                if (includesBody) {
                    var collId = `${coll.bodyA.id},${coll.bodyB.id}`
                    if (!this.collisions.includes(collId)) {
                        this.collisions.push(collId)
                    }
                }
                
            }
            
            
            
            

        } else {
            onGround = false
            this.collisions = []
        }

        if (this.collisions.length > changeNum && sfxButton.on) {
            let aud = new Audio(`hit${Math.floor(Math.random()*5)+1}.wav`)
            aud.volume = getDst(this.body.velocity, v(0,0))/8
            aud.play()
        }

        if (detector2.length > 0) {
            for (let i = 0; i < detector2.length; i++) {
                const coll = detector2[i];
                if (Math.floor(coll.normal.y+0.15) == ((coll.bodyA.id == this.body.id)?-1:1)) {
                    onGround = true
                    this.jumpTime = 15
                }
            }
            
            

        } 



        function scaleBody(body, x, y) {
            let angle = body.angle

            Matter.Body.setAngle(body, 0)
            Matter.Body.scale(body, x, y)
            Matter.Body.setAngle(body, angle)

        }
        
         function testKey(keys, set) {
     let ret = false
            keys.forEach((key) => {
                if (Object.keys(set).includes(key)) {
                    ret = true
                }
            })
            return ret
        }

        if (testKey(this.keyset["moveRight"], keys) && onGround) {
            if (Math.sign(this.body.angularVelocity) == -1) {
                Matter.Body.setAngularVelocity(this.body, this.body.angularVelocity*0.5)
            }
            Matter.Body.setAngularVelocity(this.body, this.body.angularVelocity+speed)
        }
        if (testKey(this.keyset["moveLeft"], keys) && onGround) {
            if (Math.sign(this.body.angularVelocity) == 1) {
                Matter.Body.setAngularVelocity(this.body, this.body.angularVelocity*0.5)
            }
            Matter.Body.setAngularVelocity(this.body, this.body.angularVelocity-speed)
        }
        if (testKey(this.keyset["jump"], keys) && !testKey(this.keyset["jump"], preKeys) && (this.jumpTime > 0 || num)) {
            Matter.Body.setVelocity(this.body, v(this.body.velocity.x,-jump))
            Matter.Body.translate(this.body, v(0,-5))
            this.jumpTime = 0

            if (sfxButton.on) new Audio("jump.wav").play()
        }
        if (testKey(this.keyset["jump"], keys) && this.jumpTime > -15) {
            Matter.Body.setVelocity(this.body, v(this.body.velocity.x,this.body.velocity.y-(jump*0.025)))
        }


        if (testKey(this.keyset["duck"], keys) && !testKey(this.keyset["duck"], preKeys)) {
            scaleBody(this.body, 2/3, 2/3)
        }
        if (!testKey(this.keyset["duck"], keys) && testKey(this.keyset["duck"], preKeys)) {
            scaleBody(this.body, 1.5, 1.5)
        }
        this.jumpTime -= 1
    }

    update() {
        this.updateControls()
    }
}

var entitys = new Array()


