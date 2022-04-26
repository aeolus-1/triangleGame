var keys = {},
    preKeys = {}

var startTime = false,
        showMap = false

document.addEventListener("keydown", function(e){
    keys[(e.key).toLowerCase()]=true;
    if (startTime == false) {
        startTime = new Date().getTime()
    }
    patternDetection.logKey((e.key).toLowerCase())
    
    if ((e.key).toLowerCase() == "y") {
            showMap = !showMap
        }
})
document.addEventListener("keyup", function(e){keys[(e.key).toLowerCase()]=undefined;delete keys[(e.key).toLowerCase()]})
