let simpleLevelPlan = `
......................
..#................#..
..#..............=.#..
..#.........o.o....#..
..#.@......#####...#..
..#####............#..
......#++++++++++++#..
......##############..
......................`;

let player = document.createElement("div");
document.body.appendChild(player);
let top1=49, left=120;
player.className = "player";
player.style.position= "absolute";
player.style.top = top1+"px";
player.style.left= left+"px";
let motion = {x:0, y:0};


window.addEventListener("keydown", (e)=>{
    if(e.key=="ArrowLeft"){
        motion.x=-2;
        //left-=2;
        //player.style.left=left+"px";
    }
    else if(e.key=="ArrowRight"){
        motion.x=2;
        //left+=2;
        //player.style.left=left+"px";
    }
    else if(e.key=="ArrowUp"){
        motion.y=-2;
        //top1-=2;
        //player.style.top=top1+"px";
    }
    
});

window.addEventListener("keyup", (e)=>{
    if(e.key=="ArrowLeft" || e.key == "ArrowRight"){
        motion.x=0;
    }

    else if(e.key=="ArrowUp"){
        motion.y=0;
    }

})

function animate(){
    top1+=motion.y; left+=motion.x;
    player.style.top = top1+"px";
    player.style.left = left+"px";
    requestAnimationFrame(animate);
}

animate();