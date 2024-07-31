
var keys = {},
    preKeys = {}

var startTime = false,
        showMap = false,
        hiding = false,
        cheating = false

var textMsg = "",
    typing = false

var chat = [],
    multiChat = [],
    personalChatLog = [],
    personalChatLogNum = -1

document.addEventListener("keydown", function(e){

    var k = (e.key).toLowerCase()


    if (k == "enter" && textMsg.replace(" ", "").length > 0) {
        typing = false

        var cmd = Commands.runText(textMsg)
        if (!cmd) {

            var profaneWord = function() {
                for (let word of profaneWords) {
                    if (textMsg.includes(word) && word.length > 3) {
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
                    "Lamps in video games use real electricity.",
                    "The syllables in \"on your mark, get set, go\" are a countdown.",
                    "The sentence \"Don't objectify women\" has \"women\" as the object of the sentence.",
                    "Pavlov probably thought about feeding his dogs every time someone rang a bell.",
                    "The tallest person in the world has physically experienced being the exact height of every other person in the world at some point.",
                    "When you say \"forward\" or \"back,\" your lips move in those directions.",
                    "\"Do not touch\" is probably a really unsettling thing to read in braille.",
                    "When Sweden is playing Denmark, it is SWE-DEN. The remaining letters, not used, is DEN-MARK.",
                    "If you had $1 for every year the universe has existed (approximately 13.8 billion years). You wouldn't even make the top 50 on the Forbes list.",
                    "An \"unlimited minutes per month\" phone plan really only gives you 44,640 minutes per month at best.",
                    "Why do people say \"tuna fish\" when they don't say \"beef mammal\" or \"chicken bird\"?",
                    "The object of golf is to play the least amount of golf.",
                ]
                textMsg = replacements[Math.floor(Math.random()*replacements.length)]
            }

            var length = render.context.measureText(textMsg).width
            if (!gameCompleted2) {textMsg = (textMsg).replace("<gold>", "<null>").replace("</gold>", "</null>")}
            msg = {
                text:textMsg,
                pos:v(entitys[0].body.position.x-(length/2), entitys[0].body.position.y-50),
                time:100,
            }
            
            submitChat(msg)
            chat.push(msg)
        } else {
            console.log("ran command")
            

        }
        personalChatLogNum = -1
        personalChatLog.unshift(textMsg)
        textMsg = ""
    }

    

    if (!typing) {
         keys[(e.key).toLowerCase()]=true;

         if (k == "o" && !online) {
            var sides = parseInt(prompt("Sides: ") || "4") 
            if (confirm("Changing side will reset you. Are you sure you want to do this????")) {
                setEntityBody(entitys[0], sides)
                resetGame()
            }
        }
        if (startTime == false) {
            startTime = new Date().getTime()
        }
        patternDetection.logKey((e.key).toLowerCase())
        if ((e.key).toLowerCase() == "i") {
            hiding = !hiding
        }
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
            if (personalChatLog.length > 0) {
                if (k == "arrowup") {
                    personalChatLogNum = Matter.Common.clamp(personalChatLogNum+1, 0, personalChatLog.length-1)
                    
                    textMsg = personalChatLog[personalChatLogNum]
                } else if (k == "arrowdown") {
                    personalChatLogNum = Matter.Common.clamp(personalChatLogNum-1, 0, personalChatLog.length-1)

                    textMsg = personalChatLog[personalChatLogNum]
                }
            }
        }

        if (k == "p") {
            typing = true
            keys = {}
        }

        
})
document.addEventListener("keyup", function(e){keys[(e.key).toLowerCase()]=undefined;delete keys[(e.key).toLowerCase()]})
