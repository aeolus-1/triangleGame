
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
        "c\\help":function(e){
            function c(text) {
                multiChat.push({
                    text:text,
                    user:"server",
                    pos:v(100000,100000),
                    time:300,
                })
            }
            c("The available commands are:")
            var cmds = Object.keys(Commands.cmds)
            for (let i = 0; i < cmds.length; i++) {
                const cmd = cmds[i];
                c(cmd)
            }
        },
        "c\\tp_player_e[":function(e){
            e = Math.min(e, Object.keys(checkpoints)[e].length-1)
            Matter.Body.set(entitys[0].body, "position", checkpoints[Object.keys(checkpoints)[e]])
            multiChat.push({
                text:`Teleporting to ${Object.keys(checkpoints)[e]}`,
                user:"server",pos:v(100000,100000),
                time:100,
            })
        },
        "c\\tp_player_p[":function(e){
            Matter.Body.set(entitys[0].body, "position", multiplayers[e].body.position)
        },
        "c\\enable_hax":function(e){
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
        },
        "c\\delete_spawns":function(e){
            Matter.Composite.clear(spawns)
        },
        "c\\start_ejac":function(e){
            setInterval(() => {
                createPissDrop()
            }, 1);
        },
        "c\\set_scale[":function(e){
            console.log(e)
            setPlayerScale2(entitys[0], parseFloat(e))
        }
    }
    static runText(text) {
        var foundCmd = false,
            parameter = text.slice(text.search(/\[/)+1, text.length),
            cmdStr  = text.slice(0, ((text.search(/\[/)+1)||text.length+1))

        console.log(parameter, cmdStr)
        if (false) {
            Object.keys(Commands.cmds).forEach(cmd => {
                var cmdOb = Commands.cmds[cmd]
                if (cmdStr == cmd) {
                    foundCmd = true
                    parameter = (parameter==undefined||parameter=="")?1:parameter
                    cmdOb(parameter)
                }
            });
        }

        return foundCmd
    }
}
