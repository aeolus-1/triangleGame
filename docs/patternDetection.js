
var patternDetection = {
    keyLog:new Array(),
    patterns:[
        {
            keys:["c","u","m","c","u","m","c","u","m"],
            callback:function() {
                createPissDrop()
            }
        }
    ]
}

patternDetection = {...patternDetection, 
    logKey:function(e) {
        patternDetection.keyLog.push({
            key:e,
            stamp:1000,
        })
    },
    updateLog:function() {
        for (let i = 0; i < patternDetection.keyLog.length; i++) {
            let key = patternDetection.keyLog[i];
            key.stamp -= 1
            if (key.stamp <= 0) {
                patternDetection.keyLog.splice(i, 1)
                i -= 1
            }
        }
    },
    findPatterns:function() {
        for (let i = 0; i < patternDetection.patterns.length; i++) {
            let pattern = patternDetection.patterns[i];
            for (let j = 0; j < Matter.Common.clamp(patternDetection.keyLog.length-pattern.keys.length+1, 0, Infinity); j++) {
                var key = patternDetection.keyLog[j],
                    log = patternDetection.keyLog,
                    keys = pattern.keys,
                    completion = 0
                for (let l = 0; l < keys.length; l++) {
                    const keyP = keys[l]
                     
                    if (log[j+l].key == keyP) {
                        completion += 1
                    }
                }

                var result = completion/pattern.keys.length
                if (result >= 1) {
                    console.log(`completed ${pattern.label}`)
                    patternDetection.keyLog = new Array()
                    pattern.callback()
                }
            }
        }
    },
}


//localStorage.getItem("moderationKey")
class Commands {
    static cmds = {
        "c\\tp_end":function(){
            Matter.Body.set(entitys[0].body, "position", checkpoints.endFinal)
        },
        "c\\enable_hax":function(){
            cheating = !cheating
            if (cheating) {
                entitys[0].body.ignoreGravity = true
                entitys[0].body.collisionFilter = {
                    'group': -1,
                    'category': 2,
                    'mask': 0,
                  };
                Matter.Body.set(entitys[0].body, "velocity", v(0,0))
                Matter.Body.set(entitys[0].body, "angularVelocity", 10)
                Matter.Body.set(entitys[0].body, "angle", 0)
            } else {
                entitys[0].body.collisionFilter = {
                    'group': 0,
                    'category': 1,
                    'mask': 4294967295,
                  };
                entitys[0].body.ignoreGravity = false
                Matter.Body.set(entitys[0].body, "velocity", v(0,0))

                Matter.Body.set(entitys[0].body, "angularVelocity", 0)
                Matter.Body.set(entitys[0].body, "angle", 0)
                
            }
        }
    }
    static runText(text) {
        var foundCmd = false
        if (localStorage.getItem("moderationKey") != null) {
            Object.keys(Commands.cmds).forEach(cmd => {
                var cmdOb = Commands.cmds[cmd]
                if (text == cmd) {
                    foundCmd = true
                    cmdOb()
                }
            });
        }

        return foundCmd
    }
}
