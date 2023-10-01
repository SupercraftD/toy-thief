let imgs = []
let clawimg
let time = 30
let toySpeed = 1
let interval = 1500

let start
let startB

let conveyor

let sIntervalID

let explosion
let hurt
let coin

function preload(){
  let fn = ['bluegreen.png','bluegreengreenbow.png','pinkgreen.png','redyellow.png']
  for (let f of fn){
    imgs.push(loadImage('imgs/'+f))
  }
  clawimg = loadImage('imgs/claw.png')

  start = loadImage('imgs/toythiefstarttext.png')
  startB = loadImage('imgs/toythiefstartblink.png')

  conveyor = loadImage('imgs/conveyor.png')

  explosion = loadSound('sounds/explosion.wav')
  hurt = loadSound('sounds/hitHurt.wav')
  coin = loadSound('sounds/pickupCoin.wav')
}
let score = 0
let targetId = Math.floor(Math.random()*4)

function setup(){
  createCanvas(640,480)
  noSmooth()

}
let toys = []

function spawnToy(){
  let toy = Math.floor(Math.random()*4);

  toys.push(new Toy(toy))
}

let clawY = 100
let clawX = 0
let grabbing = false

let retracting = false

let grabId = -1

let si = interval

let tBg = [255,128]

let gameOver = false
let gameStarted = false

let frame = 0

function draw(){
  frame += 1
  background('skyblue')

  if (!gameStarted){
    if (Math.floor(frame/30)%2==0){
      image(startB,0,0)
    }else{
      image(start,0,0)
    }
    return
  }

  if (gameOver){

    fill('black')
    textSize(60)
    strokeWeight(5)
    text("You Ran Out Of Time!",20,100)

    text(score,300,300)

    textSize(30)
    text('Your Score:', 240,220)

    text('Refresh to play again',175,400)

    return
  }


  let fR = false
  if (tBg.length != 2){
    fR = true
  }

  for (let toy of toys){
    toy.x += toySpeed
    toy.draw()
  }
  fill('#404040')
  if (!grabbing){
    if (mouseX > 100 && mouseX<640){
      clawX = mouseX
    }
  }else{
    if (!retracting){
      clawY +=5 
      if (clawY > 300){
        retracting = true
      }
    }else{
      if (clawY > 300){
        for (let t of toys){
          if (collideRectRect(clawX,clawY,64,64,t.x,300,64,64)){
            grabId = t.id
            toys.splice(toys.indexOf(t),1)
            break
          }
        }
      }
      clawY -= 5
      if (clawY <= 100){
        clawY = 100
        grabbing = false
        retracting = false

        if (grabId == targetId){
          score += 1
          time += 5
          tBg = [0,255,0,128]
          targetId = Math.floor(Math.random()*4)
          coin.play()
        }else{
          time -= 5
          tBg = [255,0,0,128]
          hurt.play()
        }

        grabId = -1
      }
    }
  }
  rect(clawX+27,0,10,clawY)
  image(clawimg,clawX,clawY,64,64) 
  if (grabId!=-1){
    image(imgs[grabId],clawX,clawY,64,64)
  }
  fill('gray')
  rect(0,0,125,100)
  image(imgs[targetId],30.5,30,64,64)
  fill('white')
  textSize(24)
  text('Target:',24,22)

  fill('black')
  textSize(60)
  text(score,550,75)

  fill(tBg)
  rect(275,0,150,75)

  fill('black')
  textSize(48)
  text(time,315,50)
  if (score > 10 && score < 20){
    toySpeed = 1.5
    interval = 1000
    if (si != interval){
      clearInterval(sIntervalID)
      sIntervalID = setInterval(spawnToy,interval)  
      si = interval
    }
  }
  if (score > 20){
    toySpeed = 3
    interval = 750
    if (si != interval){
      clearInterval(sIntervalID)
      sIntervalID = setInterval(spawnToy,interval)  
      si = interval
    }
  }
  
  if (fR){
    tBg = [255,128]
  }
  fill('#292729')
  rect(0,364,640,200)
  for (let i = 0;i<10;i++){
    image(conveyor,64*i,364)
  }
}

function mousePressed(){
  if ((!grabbing) && gameStarted){
    grabbing = true

  }
}
function keyPressed(){
  if (!gameStarted){
    sIntervalID = setInterval(spawnToy,interval)
    setInterval(()=>{
      time -= 1
      if (time <= 0){
        if (gameOver==false){
          explosion.play()
        }
        gameOver = true
      }
    },1000)
    gameStarted = true
  }
}