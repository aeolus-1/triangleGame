var keys = {},
    preKeys = {}

var startTime = false

document.addEventListener("keydown", function(e){
    keys[e.key]=true;
    if (startTime == false) {
        startTime = new Date().getTime()
    }
})
document.addEventListener("keyup", function(e){keys[e.key]=undefined;delete keys[e.key]})
