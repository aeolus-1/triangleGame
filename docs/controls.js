var keys = {},
    preKeys = {}

var startTime = false

document.addEventListener("keydown", function(e){
    keys[(e.key).toLowerCase()]=true;
    if (startTime == false) {
        startTime = new Date().getTime()
    }
    patternDetection.logKey((e.key).toLowerCase())
})
document.addEventListener("keyup", function(e){keys[(e.key).toLowerCase()]=undefined;delete keys[(e.key).toLowerCase()]})
