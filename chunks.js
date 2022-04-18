class Chunks {

    static chunkSize = 1000

    static currentLevel = Matter.Composite.create()

    static levelDat = undefined

    static getLoadedChunks(pos) {
        let chunkPos = v(Math.round(pos.x/this.chunkSize), Math.round(pos.y/this.chunkSize))


        let loadedChunks = {}
        loadedChunks[`${chunkPos.x},${chunkPos.y}`] = false
        loadedChunks[`${chunkPos.x-1},${chunkPos.y}`] = false
        loadedChunks[`${chunkPos.x},${chunkPos.y-1}`] = false
        loadedChunks[`${chunkPos.x-1},${chunkPos.y-1}`] = false
        loadedChunks[`${chunkPos.x+1},${chunkPos.y}`] = false
        loadedChunks[`${chunkPos.x},${chunkPos.y+1}`] = false
        loadedChunks[`${chunkPos.x+1},${chunkPos.y+1}`] = false
        loadedChunks[`${chunkPos.x-1},${chunkPos.y+1}`] = false
        loadedChunks[`${chunkPos.x+1},${chunkPos.y-1}`] = false

        let size = 5

        for (let x = -Math.floor(size/2); x < Math.floor(size/2); x++) {
            for (let y = -Math.floor(size/2); y < Math.floor(size/2); y++) {
                loadedChunks[`${chunkPos.x+(x)},${chunkPos.y+y}`] = false
            }            
        }


        return loadedChunks
    }

    static loadLevelDat(string) {
        console.log(JSON.parse(string))
        this.levelDat = JSON.parse(string).chunks
        Levels.texts = JSON.parse(string).texts
    }

    static loadChunk(pos) {
        if (this.levelDat != undefined) {
            let chunkDat = this.levelDat[`${pos.x},${pos.y}`]
            if (chunkDat != undefined) {
                Levels.loadData(chunkDat, `${pos.x},${pos.y}`)
                
            } 
        }
    }

    static unLoadChunk(pos) {
        let comps = chunksComp.composites

        for (let i = 0; i < comps.length; i++) {
            let comp = comps[i];
            if (comp.label == `${pos.x},${pos.y}`) {
                Matter.Composite.remove(chunksComp, comp)
            }
        }
    }


    static updateChunks() {
        var loadedChunks = []

        for (let i = 0; i < entitys.length; i++) {
            const ent = entitys[i];
            loadedChunks = {...loadedChunks,...this.getLoadedChunks(ent.body.position)}
        }

        let chunks = chunksComp.composites


        for (let i = 0; i < spawners.length; i++) {
            let spawner = spawners[i];
            if (!Object.keys(loadedChunks).includes(spawner.chunkPos)) {
                spawners.splice(i, 1)
            }   
        }

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            if (!Object.keys(loadedChunks).includes(chunk.label)) {
                Matter.Composite.remove(chunksComp, chunk)
            } else {
                loadedChunks[chunk.label] = true
            }
        }


        for (let i = 0; i < Object.keys(loadedChunks).length; i++) {
            const chunk = Object.keys(loadedChunks)[i];
            let check = loadedChunks[chunk]
            if (!check) {
                let chunkDat = this.levelDat[chunk]
                if (chunkDat != undefined) {
                    Levels.loadData(this.levelDat[chunk], chunk)
                } else {
                }
                
            }
        }
    }
}
