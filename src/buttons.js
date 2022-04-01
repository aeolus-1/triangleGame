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
