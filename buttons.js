class Button {
    constructor(x, y, src, callback) {
        this.pos = v(x,y)
        this.img = document.createElement("img")
        this.img.src = src
          

        this.id = `${Math.random()}`
        this.callback = callback
            
        

        document.addEventListener("click", (e) => {
            if (
                e.offsetX > this.pos.x &&
                e.offsetX < this.pos.x+this.img.height && 
                e.offsetY > this.pos.y &&
                e.offsetY < this.pos.y+this.img.height 
                ) {
                    this.callback()
            }
        })
    }
    
}

var buttons = new Array()

function renderButtons() {
    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];


        render.context.drawImage(button.img, button.pos.x, button.pos.y)
    }
}


var sfxButton = new Button(10,10, "soundOn.png", function(){
    this.on = !this.on
    if (this.on) {
        this.img = document.createElement("img")
        this.img.src = "soundOn.png"
    } else {
        this.img = document.createElement("img")
        this.img.src = "soundOff.png"
    }
})
sfxButton.on = true

buttons.push(sfxButton)

var musicButton = new Button(67,10, "musicOff.png", function(){
    this.on = !this.on
    if (this.on) {
        this.img = document.createElement("img")
        this.img.src = "musicOn.png"
        music.play()
    } else {
        this.img = document.createElement("img")
        this.img.src = "musicOff.png"
        music.pause()
    }
})
musicButton.on = false

buttons.push(musicButton)
var addPlayerButton = new Button(167,10, "userPlus.png", function(){
    this.on = !this.on
    if (this.on) {
        this.img = document.createElement("img")
        this.img.src = "userSub.png"
        addPlayer()
    } else {
        this.img = document.createElement("img")
        this.img.src = "userPlus.png"
        Matter.Composite.remove(engine.world, entitys[1].body)
        entitys.splice(1, 1)
        
    }
})
addPlayerButton.on = false

buttons.push(addPlayerButton)

function resetGame() {
    alert("Reset player position")
    Matter.Body.set(entitys[0].body, "position", v(100,100))
    Matter.Body.set(entitys[0].body, "velocity", v(0,0))
    Matter.Body.set(entitys[0].body, "angularVelocity", 0)
    Matter.Body.set(entitys[0].body, "angle", 0)
    camera = v(100, 100)
    timeStamp = 0
    Save.saveGame()
}

var resetButton = new Button(267,10, "reseticon.png", function(){
    if (confirm("Are you sure you want to reset?") && confirm("Are you SURE???") && confirm("100% sure?") && confirm("101% SURE?") && confirm("Theres only one way back") && confirm("I don't think you thinking this through") && confirm("Are you of sound mind and body when clicking this button?") && confirm("Alright here you go") && confirm("but seriuosly are REALLY SURE??????")  && confirm("fine")) {
        resetGame()
    }
})

buttons.push(resetButton)
