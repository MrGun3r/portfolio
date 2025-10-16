var canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


const doc_home = document.getElementById("home");


/* Button Transitioning */
function changePage(i){
   if(i == 0){doc_home.classList.remove("fade-out");}
   if(i == 1){doc_home.classList.add("fade-out");}
}








function resizeWindow(){
    
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;

}


const no_dots = 35;

dots = [];

const mouse = {
    x:0,
    y:0
};


class Dot{
    constructor(x,y,angle){
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.veloX = 0.5;
        this.veloY = 0.5;
    }
    init(){
       dots.push(this);
    }
    update(){
        this.x += this.veloX*Math.cos(this.angle);
        this.y += this.veloY*Math.sin(this.angle);

        if (this.x < 0 || this.x > canvas.width) {
            this.veloX *= -1;
            if (this.x < 0){
                this.x = 0;
            }
            else {
                this.x = canvas.width;
            }
        }
        else if(this.y < 0 || this.y > canvas.height){
            this.veloY *= -1;
            if (this.y < 0){
                this.y = 0;
            }
            else {
                this.y = canvas.height;
            }
        }
    }
    draw(){
        ctx.beginPath()
        ctx.fillStyle = '#858585ff';
        ctx.arc(this.x,this.y,5,0,2*Math.PI);
        ctx.shadowColor = "#ffffffff";
        ctx.shadowBlur = 30;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.fill();
        ctx.closePath()
        ctx.shadowBlur = 0;
    }
}


function initProgram(){
    for(i = 0;i<no_dots;i++){
        dot = new Dot(Math.random()*canvas.width,Math.random()*canvas.height,2*(Math.random()-0.5)*Math.PI);
        dot.init();
        dot.draw();
    }

}

initProgram();
function min_max(x,min,max){
    if (x < min){
        return min;
    }
    else if (x > max){
        return max;
    }
    return x;
}

function drawLine(dot1,dot2){
    var distance = Math.sqrt(Math.pow(dot1.x-dot2.x,2)+Math.pow(dot1.y-dot2.y,2));
    if(distance > 300){
      return;
    }
    ctx.strokeStyle = `rgba(150, 150, 150, ${min_max((300 - distance) / 300, 0, 1)})`;
    ctx.beginPath();
    ctx.moveTo(dot1.x,dot1.y);
    ctx.lineTo(dot2.x,dot2.y);
    ctx.stroke();
    ctx.closePath();
}

function drawLineMouse(dot,mouse){
    var distance = Math.sqrt(Math.pow(dot.x-mouse.x,2)+Math.pow(dot.y-mouse.y,2));
    if(distance > 300){
      return;
    }
    ctx.strokeStyle = `rgba(150, 150, 150, ${min_max((300 - distance) / 300, 0, 1)})`;
    ctx.beginPath();
    ctx.moveTo(dot.x,dot.y);
    ctx.lineTo(mouse.x,mouse.y);
    ctx.stroke();
    ctx.closePath();
}



function Loop(){

    ctx.save();
    ctx.fillStyle = '#121212ff';
    ctx.fillRect(0,0,canvas.width,canvas.height); 

    for(i = 0;i<dots.length;i++){
        dots[i].update();
        drawLineMouse(dots[i],mouse);
        for(j = i+1;j<dots.length;j++){
              drawLine(dots[i],dots[j]);
        }
        dots[i].draw();
    }
    window.addEventListener('resize', resizeWindow);
    window.addEventListener('mousemove',(event)=>{
        mouse.x = event.x;
        mouse.y = event.y;
    })
    requestAnimationFrame(Loop);
}


Loop()