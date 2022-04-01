var spawnPos = v(100,100)

var fakeGround = Matter.Bodies.rectangle(2910, -3190, 300, 20, {
    render:{
        fillStyle:colorTheme.platforms,
    },
    friction:0.05,
})

Matter.Composite.add(engine.world, fakeGround)

class Levels {
    static texts = new Array()
    static loadData(data, chunkPos) {
        let levelObject = data


        //console.log(levelObject)

        spawnPos = levelObject.spawn

        let chunkComp = Matter.Composite.create({
            label:chunkPos
        })
        levelObject.rects.forEach(ob => {
            let newRect = Matter.Bodies.rectangle(ob.x, ob.y, ob.width, ob.height,{
                isStatic:true,
                render:{
                    fillStyle:colorTheme.platforms,
                },
                angle:ob.angle,
            })
            Matter.Composite.add(chunkComp, newRect)
        });
        levelObject.spawners.forEach(spawner => {
            let s = new Spawner(v(spawner.x,spawner.y),200,400)
            s.chunkPos = chunkPos
            spawners.push(s)
        });

        Matter.Composite.add(chunksComp, chunkComp)
    }

    static getGroundBodies() {
        let bodies = new Array(),
            loadedChunks = Object.keys(Chunks.getLoadedChunks(entitys[0].body.position))


        for (let i = 0; i < chunksComp.composites.length; i++) {
            const comp = chunksComp.composites[i];
            if (loadedChunks.includes(comp.label)) {
                bodies = [...bodies,...comp.bodies]
            }
        }

        return bodies
    }
}
