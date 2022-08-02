
let levels = [`......................
..#................#..
..#...........=....#..
..#.........o.o....#..
..#.@......#####...#..
..#####............#..
......#++++++++++++#..
......##############..
......................`,
,
    `................................................................................
................................................................................
................................................................................
................................................................................
................................................................................
................................................................................
..................................................................###...........
...................................................##......##....##+##..........
....................................o.o......##..................#+++#..........
.................................................................##+##..........
...................................#####..........................#v#...........
............................................................................##..
..##......................................o.o................................#..
..#.....................o....................................................#..
..#......................................#####.............................o.#..
..#..........####.......o....................................................#..
..#..@.......#..#................................................#####.......#..
..############..###############...####################.....#######...#########..
..............................#...#..................#.....#....................
..............................#+++#..................#+++++#....................
..............................#+++#..................#+++++#....................
..............................#####..................#######....................
................................................................................
................................................................................`];

var levelIndex = 0;
//let simpleLevelPlan=levels[levelIndex];



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

function touches(actor1, actor2){
    return actor1.pos.x+1>actor2.pos.x &&
           actor1.pos.x<actor2.pos.x+1 &&
           actor1.pos.y+1>actor2.pos.y &&
           actor1.pos.y<actor2.pos.y+1;
}

class Player{
    constructor(pos, ch, speed){
        this.pos = pos;
        this.size = {x:16, y:24};
        this.type = "Player";
        this.speed=speed?speed:{x:0,y:0};
    }

    update(time, keys){
        let pos = this.pos;
        let speed = this.speed;
        let previousX = this.pos.x;
        let previousY = this.pos.y;
        pos.x+=(-keys["ArrowLeft"]+keys["ArrowRight"])/8;
        if(hits(this, "wall", level1.rows)){
            pos.x = previousX;
        }
        if(keys["ArrowUp"] && this.speed.y==0){speed.y=-1.2;}
        speed.y+=time*0.001;
        pos.y+=speed.y*time/100+time*time/20000;
        
        if(hits(this, "wall", level1.rows) || pos.y<0.14){
            pos.y = previousY;
            speed.y=0;
        }

        return new Player(pos,0,speed);
    }
}


class Wall{
    constructor(pos){
        this.pos = pos;
        this.size = {x:20, y:20};
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
        this.size = {x:10, y:15};
        this.basePos= basePos ? basePos:pos;
        this.type = ch=="_"? "invisibleCoin" :"Coin";
    }

    update(time){
        if(touches(player, this) && this.type=="Coin"){
            //levelIndex++;
            return;
        }
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
        this.size = {x:20, y:20};
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

        if(touches(this, player)){
            finishgame=true;
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

var level1, StatusLv1, keysPressed, finishgame=false;

function initialize(){

    level1 = new Level(levels[levelIndex]);
    StatusLv1 = new Status(level1);

    keysPressed = {"ArrowUp": false,"ArrowLeft": false, "ArrowRight": false,}
}

initialize();

window.addEventListener("keydown", (e)=>{
    keysPressed[e.key] = true;
});
window.addEventListener("keyup", (e)=>{
    keysPressed[e.key] = false;
});



let oldActors = [];
let lastTime = 0;
let scenarioDiv = drawGrid(level1);
var player;

function animate(time){
    if(finishgame) {
        initialize();
        finishgame=false;
        animate(0);
        return;}
    player = level1.actors.find(a=>a.type=="Player");
    if(time-lastTime>=0.4){
    oldActors.forEach(actor=>{actor.remove()});
    oldActors = [];
    
    level1.actors = level1.actors.map(actor=>{
        return actor.update(Math.min(time-lastTime, 100), keysPressed)
    }).filter(a=>a!=undefined);
    if(!level1.actors.some(a=>a.type=="Coin")){
        alert("won");
        initialize();
        animate(0);
    }
    level1.actors.forEach(itm=>{
        oldActors.push(drawActor(itm, scenarioDiv));
    });
    lastTime=time;

}
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
