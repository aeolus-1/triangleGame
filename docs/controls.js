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
    if (k == "enter" && textMsg.replace(" ", "").length > 0) {
        typing = false
        console.log(textMsg)

        var profaneWord = function() {
            for (let word of profaneWords) {
                if (textMsg.includes(word)) {
                    return word
                }
            }
        }()

        if (profaneWord != undefined) {
            var replacements = [
                "I love ben reef",
                "This game is the best",
                "I do not support ukraine",
                "I am gay",
                "😍",
                "I have a secret desire for feet",
                "I have sexual relationships with minors",
                "asd",
                "I love basil feet pics",
                "I have 14.3 kids in my basement",
                "I love trignomentry",
                "Don't ask the minions who they served in 1942",
                "mayonaise on a escalator",
                "baby do hurt me",
                "This message was sponsered by raid shadow legends",
                "What is sqrt(34/sin(46^-1)^PI)",
                "jake is gay",
                "If abortion is murder, ejaculation is mass genocide",
                "It's pronuced jod not god",
                "I love spreading the word of our lord and saviour jesus christ",
                "Theres a hole in our budget",
                "frotnite",
                "if you pee and nut at the same time is that a peanut?",
            ]
            textMsg = replacements[Math.floor(Math.random()*replacements.length)]
        }

        var length = render.context.measureText(textMsg).width,
        msg = {
            text:textMsg,
            pos:v(entitys[0].body.position.x-(length/2), entitys[0].body.position.y-50),
            time:100,
        }
        submitChat(msg)
        chat.push(msg)
        textMsg = ""
    }

    if (k == "o" && !online) {
        var sides = parseInt(prompt("Sides: ") || "4") 
        if (confirm("Changing side will reset you. Are you sure you want to do this????")) {
            setEntityBody(entitys[0], sides)
            resetGame()
        }
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
