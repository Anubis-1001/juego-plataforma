let simpleLevelPlan = `......................
..#................#..
..#...........=....#..
..#.........o.o....#..
..#.@......#####...#..
..#####............#..
......#++++++++++++#..
......##############..
......................`;



let scale = 20;

function hits(actor, type, grid){
    let roundedGridX = {start:  Math.ceil(actor.pos.x-1),end: Math.ceil(actor.pos.x)};
    let roundedGridY = {start:  Math.ceil(actor.pos.y-1),end:Math.ceil(actor.pos.y)};
    for(let x=roundedGridX.start; x<=roundedGridX.end; x++){
        for(let y= roundedGridY.start; y<=roundedGridY.end; y++){
            console.log(y);
            if(grid[y][x] == type){
                return true;
            }
    }
}
return false;
}



class Player{
    constructor(pos, ch, speed){
        this.pos = pos;
        this.type = "Player";
        this.speed=speed?speed:{x:0,y:0};
    }

    update(time, keys){
        let previousX = this.pos.x;
        let previousY = this.pos.y;
        this.pos.x+=(-keys["ArrowLeft"]+keys["ArrowRight"])/8;
        if(hits(this, "wall", level1.rows)){
            this.pos.x = previousX;
        }
        if(keys["ArrowUp"] && this.speed.y==0){this.speed.y=-0.8;}
        this.speed.y+=time*0.001;
        this.pos.y+=this.speed.y*time/100+time*time/20000;
        
        if(hits(this, "wall", level1.rows)){
            this.pos.y = previousY;
            this.speed.y=0;
        }

        return new Player(this.pos,0,this.speed);
    }
}


class Wall{
    constructor(pos){
        this.pos = pos;
        this.type = "Wall"; 
    }

    update(){
        return this;
    }
}

var angle = 0;
class Coin{
    constructor(pos, ch, basePos){
        this.pos = pos;
        this.basePos= basePos ? basePos:pos;
        this.type = "Coin";
    }

    update(time){
        Coin.angle+=0.07;
        let wobble =Math.sin(Coin.angle)*time/100;
        return new Coin({x:this.basePos.x, y:this.basePos.y+wobble}, 0, this.basePos);
    }

    static get angle(){
        return angle;
    }

    static set angle(newVal){
        angle=newVal;
    }
}

class Lava{
    constructor(pos, ch, motion){
        this.pos = pos;
        this.type = "Lava";
        this.reset = false;
        this.ch=ch;
        this.motion = motion;
        if(!motion){
            if(ch=="v"){
                this.motion={x:0,y:3};
                this.reset=true;
            }
            else if(ch=="=")this.motion={x:-3,y:0};
            else if(ch=="+")this.motion={x:0, y:0};
        }
    }

    update(time){
        this.pos.x+=this.motion.x*time/1000;        
        this.pos.y+=this.motion.y*time/1000;
        let newLava = new Lava(this.pos,this.ch, this.motion);
        if(newLava.ch=="="){
            if(hits(newLava, "wall", level1.rows)){
                newLava.motion.x*=-1;
            }
        }
        return newLava;
    }

}
let classes = {".":"empty", "#":"wall", "o":Coin, "@":Player, "+":Lava, "=":Lava, "v":Lava};

class Level{
    constructor(plan){
        let rows = plan.trim().split("\n").map(line=>[...line]);
        this.height = rows.length;
        this.width = rows[0].length;
        this.actors = [];
        this.rows = rows.map((row, y)=>{
            return row.map((ch, x)=>{
                let type = classes[ch];
                if(typeof type == "string" ) return type;
                this.actors.push(new type({x:x, y:y},ch));
                return "empty";
            })
        })
    }
}

class Status{
    constructor(level){
        this.actors = level.rows.map(row=>row.map(actor=> classes[actor]));
    }
}

function drawActor(actor, parentDiv){
    let item = document.createElement("div");
    item.className = actor.type;
    item.style.top = actor.pos.y*scale+"px";
    item.style.left = actor.pos.x*scale+"px";
    parentDiv.appendChild(item);
    return item;
}

function drawGrid(lvl){
    let scenario = document.createElement("div");
    scenario.style.height = lvl.height*scale+"px";
    scenario.style.width = lvl.width*scale+"px";
    scenario.className = "scenario";
    lvl.rows.forEach((row,y)=>row.forEach((item,x)=>{
        if(item=="wall"){
            let div = document.createElement("div");
            div.className = "Wall";
            div.style.position="absolute";
            div.style.top=y*scale+"px";
            div.style.left=x*scale+"px";
            scenario.appendChild(div);
        }

    }))
    document.body.appendChild(scenario);
    return scenario;
}
/*
function drawActors(actors, oldGrid){
    oldGrid.forEach(element => {
        element.remove();
    });
    let actorDivs = [];
    for(let actor of actors){
        document.body.appendChild()
    }
}
*/


let level1 = new Level(simpleLevelPlan);
let StatusLv1 = new Status(level1);

let keysPressed = {"ArrowUp": false,"ArrowLeft": false, "ArrowRight": false,}

window.addEventListener("keydown", (e)=>{
    keysPressed[e.key] = true;
});
window.addEventListener("keyup", (e)=>{
    keysPressed[e.key] = false;
});

let oldActors = [];
let lastTime = 0;
let scenarioDiv = drawGrid(level1);
function animate(time){
    if(time-lastTime>=0.4){
    oldActors.forEach(actor=>{actor.remove()});
    oldActors = [];
    
    level1.actors = level1.actors.map(actor=>{
        return actor.update(Math.min(time-lastTime, 100), keysPressed)
    });
    level1.actors.forEach(itm=>{
        oldActors.push(drawActor(itm, scenarioDiv));
    });
    lastTime=time;

}
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

/*
let act1=drawActor(level1.actors[0]);
drawActor(level1.actors[1]);
drawActor(level1.actors[2]);
drawActor(level1.actors[3]);
act1.remove();
*/

/*
drawActor(level1.actors[4]);
drawActor(level1.actors[5]);
drawActor(level1.actors[6]);
drawActor(level1.actors[7]);
*/
/*test
let div;
document.body.appendChild(div=document.createElement("div"));
div.remove();
*/
