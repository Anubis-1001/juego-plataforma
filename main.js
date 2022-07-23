let simpleLevelPlan = `......................
..#................#..
..#..............=.#..
..#.........o.o....#..
..#.@......#####...#..
..#####............#..
......#++++++++++++#..
......##############..
......................`;


class wall{
    constructor(pos){
        this.pos = pos;
    }
}

class lava{
    constructor(type){
        this.type = type;
    }
}


class coin{
    constructor(pos){
        this.pos = pos;
    }
}

class Level{
    
}
class actor{
    constructor(pos, speed){
        this.pos = pos;
        this.speed = speed;
    }

    move(){
        this.pos.x +=this.speed.x;
    }

    jump(){
        this.pos.y+=this.speed.y;
    }
}


let scenario = document.createElement("div");
let rows = simpleLevelPlan.split("\n");
scenario.className = "scenario";
scenario.style.position = "absolute";
//alert(rows);
scenario.style.width = rows[0].length*20+"px";
scenario.style.height = rows.length*20+"px";
document.body.appendChild(scenario);


let player = new actor({x:20, y:20},{x:0, y:0});
let divPlayer = document.createElement("div");
document.body.appendChild(divPlayer);
divPlayer.className = "player";
divPlayer.style.position= "absolute";
divPlayer.style.top = player.pos.x+"px";
divPlayer.style.left= player.pos.y+"px";
//let motion = {x:0, y:0};


window.addEventListener("keydown", (e)=>{
    if(e.key=="ArrowLeft"){
        player.speed.x=-2;
    }

    else if(e.key=="ArrowRight"){
        player.speed.x=2;
    }

    else if(e.key=="ArrowUp"){
        player.speed.y=-2;
    }
    
    
});



window.addEventListener("keyup", function handler(e){
        if(e.key=="ArrowLeft" || e.key == "ArrowRight"){
            player.speed.x=0;
        }
    
        else if(e.key=="ArrowUp"){
            player.speed.y=0;
        }
    })

function animate(){
    player.pos.y+=player.speed.y; player.pos.x+=player.speed.x;
    divPlayer.style.top = player.pos.y+"px";
    divPlayer.style.left = player.pos.x+"px";
    requestAnimationFrame(animate);
}

animate();