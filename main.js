let simpleLevelPlan = `......................
..#................#..
..#..............=.#..
..#.........o.o....#..
..#.@......#####...#..
..#####............#..
......#++++++++++++#..
......##############..
......................`;



class Wall {
    constructor(pos, size){
        this.pos = pos;
        this.size = size;
        this.type = "Wall";
    }

    update(){
        return this;
    }
}

class Lava {
    constructor(pos, size, type){
        this.pos = pos;
        this.size = size;
        this.type = type;
        this.type = "Lava";
    }

    update(){
        return this;
    }

}

class Coin{
    constructor(pos, size){
        this.pos = pos;
        this.size = size;
        this.type = "Coin";
    }

    update(frame){
        return this;
    }
}

class Sky{
    constructor(pos, size){
        this.pos = pos;
        this.size = size;
    }

    update(){
        return this;
    }
}

class Player{
    constructor(pos, size, speed){
        this.pos = pos;
        this.size = size;
        this.speed = speed;
        this.type = "Player";
        //players.push(this);
    }

    update(frame, keys){
        if(keys["ArrowLeft"]){
            this.speed.x = 0.1;
        }
        if(keys["ArrowRight"]){
            this.speed.x=-0.1;
        }
        if(keys["ArrowUp"]){
            this.speed.y = -0.1;
        }

        return new Player({x:this.pos.x+this.speed.x, y:this.pos.y+this.speed.y},this.size, this.speed, this.type);
    }

}

let rows = simpleLevelPlan.split("\n");
//let players = [];
var scale = 20;

function elmnt(name, attributes, ...children){
    let element = document.createElement(name);
    for(let treat of Object.keys(attributes)){
        element[treat] = attributes[treat];
    }

    children.forEach(item=>{element.appendChild(item)});

    return element;
}


let types = {".":"Sky", "#":"Wall", "o":"Coin" , "@":"Player" , "+":"Lava", "=":"Lava" , "v":"Lava"};
let classes = {".":Sky, "#":Wall, "o":Coin, "@":Player, "+":Lava, "=":Lava, "v":Lava}




function overlap(actor1, actor2){
    return actor1.pox.x+actor1.size.x>actor2.pox.x &&
           actor1.pox.x<actor2.pos.x+actor2.size.x &&
           actor1.pox.y+actor1.size.y>actor2.pos.y &&
           actor1.pox.y<actor2.pos.y+actor2.size.y ;
}

function drawActors(actors){
    return elmnt("div", {className:"scenario"}, ...actors.map(row=>{
        return elmnt("div", {}, ...row.map(item=>{
            let entity = elmnt("div", {className: item.type});
            entity.style.top = item.pos.y*scale+"px"; 
            entity.style.left = item.pos.x*scale+"px"; 
            return entity;
        }))})); 
        //console.log(actor);
        //div.style.top=actor.pos.y*scale+"px"; 
        //div.style.left=actor.pos.x*scale+"px";
        //return div}));
}

function updateActors(actorsDiv){
}

class Level{
    constructor(level){
        this.rows = level.trim().split("\n");
        let width = rows[0].length;
        this.width = width*scale+"px";
        this.height = rows.length*scale+"px";
        this.actors = this.rows.map((row,y) => Array.from(row).map((item,x)=>new classes[item]({x:x,y:y},{x:scale, y:scale}, {x:0, y:0})));
        //console.log(this.actors);
        /*let elements=[];
        rows.map((row,y)=>{
            Array.from(row).map((item, x)=>{
                let entity = elmnt("div", {class: item});
                entity.style.top=y*scale+"px";
                entity.style.left=x*scale+"px";
                
                elements.push(entity);
            });
        }
        )*/

        this.layout = drawActors(this.actors);//elmnt("div", {className:"scenario"}, ...this.actors.map(actor=>{return elmnt("div", {class: actor.constructor.name})}));
        console.log(this.layout);
        this.layout.style.height = this.height;
        this.layout.style.width = this.width;
        document.body.appendChild(this.layout);
    }
}




let firstLevel = new Level(simpleLevelPlan);
let newFrame = drawActors(firstLevel.actors);
let oldFrame;
function animate(){
    //document.body.appendChild(drawActors(firstLevel.actors));
    oldFrame = newFrame;
    
    newFrame = drawActors(firstLevel.actors = firstLevel.actors.map(line=>{return line.map(actor=>actor.update(0, {"ArrowUp":false, "ArrowRight":true, "ArrowLeft":true}))}));
    document.body.appendChild(newFrame);
    //oldFrame.remove();
    requestAnimationFrame(animate);
}

animate();