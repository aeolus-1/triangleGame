class Button {
    constructor(x, y, img, callback) {
        this.pos = v(x,y)
        this.img = img
          

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


var sfxButton = new Button(10,10, imgCache.soundOn, function(){
    this.on = !this.on
    if (this.on) {
        this.img = imgCache.soundOn
    } else {
        this.img = imgCache.soundOff
    }
})
sfxButton.on = true

buttons.push(sfxButton)

var musicButton = new Button(67,10, imgCache.musicOff, function(){
    this.on = !this.on
    if (this.on) {
        this.img = imgCache.musicOn
        music.play()
    } else {
        this.img = imgCache.musicOff
        music.pause()
    }
})
musicButton.on = false

buttons.push(musicButton)
var addPlayerButton = new Button(167,10, imgCache.userPlus, function(){
    this.on = !this.on
    if (this.on) {
        this.img = imgCache.userSub
        addPlayer()
    } else {
        this.img = imgCache.userPlus
        Matter.Composite.remove(engine.world, entitys[1].body)
        entitys.splice(1, 1)
        entitys[0].keyset = {
            moveLeft: ["arrowleft", "a"],
            moveRight: ["arrowright", "d"],
            jump: ["arrowup", "w"],
            duck: ["arrowdown", "s"],
        }
        
    }
})
addPlayerButton.on = false


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

var resetButton = new Button(267,10, imgCache.resetIcon, function(){
    if (confirm("Are you sure you want to reset?") && confirm("Are you SURE???")) {
        resetGame()
    }
})

buttons.push(resetButton)
