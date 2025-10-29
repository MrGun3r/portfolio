var canvas = document.getElementById("canvas");
document.getElementsByName("html")
ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function getId(text){
    return document.getElementById(text);
}


const doc_home = getId("home");
const doc_EngCourse = getId("engineering_course");
const doc_Mobility = getId("mobility");
const doc_civic = getId("civic");
const doc_activities = getId("activities");
const doc_career_dev = getId("career-dev");




doc_home.classList.add("fade-in");
document.documentElement.classList.add("noscroll");
for(i = 2;i<8;i++){
    getId("sem_"+i).classList.add("fade-out");
}




getId("sem_GoLeft").classList.add("unavailable");
semesterShowing = 1;


function disableScroll(){
    // Remove scroll
    document.documentElement.classList.add("noscroll");

}
function enableScroll(){
    // enable Scroll
    document.documentElement.classList.remove("noscroll");

}


function moveSem(index){
    // 0 => Right
    // 1 => Left
    if (index == 0 && semesterShowing < 7){
        getId("sem_GoLeft").classList.remove("unavailable");
        getId("sem_"+semesterShowing).classList.add("fade-out");
        getId("sem_"+semesterShowing).classList.add("translateRight");
        semesterShowing++;
        getId("sem_"+semesterShowing).classList.remove("fade-out");
        getId("sem_"+semesterShowing).classList.remove("translateLeft");

        if(semesterShowing == 7){
            getId("sem_GoRight").classList.add("unavailable");
        }
    }
    else if (index == 1 && semesterShowing > 1){
        getId("sem_GoRight").classList.remove("unavailable");
        getId("sem_"+semesterShowing).classList.add("fade-out");
        getId("sem_"+semesterShowing).classList.add("translateLeft");
        semesterShowing--;
        getId("sem_"+semesterShowing).classList.remove("fade-out");
        getId("sem_"+semesterShowing).classList.remove("translateRight");

        if(semesterShowing == 1){
            getId("sem_GoLeft").classList.add("unavailable");
        }
    }
}




function fadeoutEverything(){
    doc_home.classList.remove("fade-in");
    doc_EngCourse.classList.remove("fade-in");
    doc_Mobility.classList.remove("fade-in");
    doc_civic.classList.remove("fade-in");
    doc_activities.classList.remove("fade-in");
    doc_career_dev.classList.remove("fade-in");
}
function moveDots(){
    for(i = 0;i<dots.length;i++){
        dots[i].moveVelo = 20;
    }
}


/* Button Transitioning */
function changePage(i){
   fadeoutEverything();
   
   moveDots();
   if(i == 0)   {doc_home.classList.add("fade-in");disableScroll()}
   if(i == 1)   {doc_EngCourse.classList.add("fade-in");disableScroll()}
   if(i == 2)   {doc_Mobility.classList.add("fade-in");enableScroll()}
   if(i == 3)   {doc_civic.classList.add("fade-in");disableScroll()}
   if(i == 4)   {doc_activities.classList.add("fade-in");enableScroll()}
   if(i == 5)   {doc_career_dev.classList.add("fade-in");disableScroll()}
   setTimeout(()=>{window.scrollTo({ top: 0, behavior: 'smooth' })},50);
}


function resizeWindow(){
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;
}


const no_dots = 60;
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
        this.moveVelo = 1;
    }
    init(){
       dots.push(this);
    }
    update(){
        this.moveVelo -= (Math.abs(this.moveVelo) - 1)*0.1;

        this.x += (this.moveVelo*this.veloX)*Math.cos(this.angle);
        this.y += (this.moveVelo*this.veloY)*Math.sin(this.angle);

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