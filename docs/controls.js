var keys = {},
    preKeys = {}

var startTime = false,
        showMap = false

var textMsg = "",
    typing = false

var chat = [],
    multiChat = []

document.addEventListener("keydown", function(e){

    var k = (e.key).toLowerCase()
    if (k == "enter") {
        typing = false
        console.log(textMsg)
        var length = render.context.measureText(textMsg).width
        chat.push({
            text:textMsg,
            pos:v(entitys[0].body.position.x-(length/2), entitys[0].body.position.y-50),
            time:100,
        })
        textMsg = ""
    }

    if (!typing) {
         keys[(e.key).toLowerCase()]=true;


        if (startTime == false) {
            startTime = new Date().getTime()
        }
        patternDetection.logKey((e.key).toLowerCase())
        
        if ((e.key).toLowerCase() == "y") {
                showMap = !showMap
            }
        } else {
            if (k != "backspace") {
                if ((k.length == 1) )textMsg = textMsg + k
            } else {
                var split = (textMsg).split("")
                split.splice(split.length-1, 1)
                textMsg = split.join("")
            }

        }

        if (k == "p") {
            typing = true
            keys = {}
        }

        
})
document.addEventListener("keyup", function(e){keys[(e.key).toLowerCase()]=undefined;delete keys[(e.key).toLowerCase()]})
