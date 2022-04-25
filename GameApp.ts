const canvas = <HTMLCanvasElement>document.getElementById("canvas");
const back:HTMLImageElement=<HTMLImageElement>document.getElementById("background")
back.style.display="none";
const girl:HTMLImageElement=<HTMLImageElement>document.getElementById("girl")
girl.style.display="none"
const ladder:HTMLImageElement=<HTMLImageElement>document.getElementById("ladder")
ladder.style.display="none"
const plank:HTMLImageElement=<HTMLImageElement>document.getElementById("plank")
plank.style.display="none"
const gold:HTMLImageElement=<HTMLImageElement>document.getElementById("gold")
gold.style.display="none"
const ctx = canvas.getContext("2d");
let rect = canvas.getBoundingClientRect();
const cmpStackGame:CanvasComponent=new CanvasComponent(canvas);


['load','resize'].forEach(event =>{
    window.addEventListener(event,()=>{
        main();
    }),false
});

var ladders:Ladder[]=[];
var ladderCount=0;


var curruntLadder:Ladder;
var planks:Plank[]=Array();
var Top=-1;
var prevLadderCount=0;

canvas.addEventListener("mousedown",mouseDown,false);
function mouseDown(e:MouseEvent) {

    var i: number = 0;
    var [canvasX, canvasY] = cmpStackGame.getCursorPosition(e);
    
    console.warn("x= "+canvasX+"   y= "+canvasY);
    let pt=new Point(canvasX,canvasY);
    for (i = 0; i < planks.length; i++) {
        if (planks[i].isinside(pt) ) {
            if(planks[i].status!="putted")
                planks[i].isDragable=true;
            else if(i==Top){
                planks[i].isDragable=true;
            }     
        }
    } 
    console.log("Current Ladder TOP:"+curruntLadder.top)
    if(curruntLadder.top==5)
        prevLadderCount=ladderCount;
}

canvas.addEventListener('mousemove', e => {
    var [canvasX, canvasY] = cmpStackGame.getCursorPosition(e);

    let pt=new Point(canvasX ,canvasY);
    for (let i = 0; i < planks.length; i++) {
        if (planks[i].isDragable) {
            let pt1=new Point(pt.x-planks[i].width/2,pt.y-planks[i].height/2);
            putPlank(planks[i],pt1);
        }
    }
});

var isLadderFull=false;
canvas.addEventListener('mouseup', e => {
    var [canvasX, canvasY] = cmpStackGame.getCursorPosition(e);

    let pt=new Point(canvasX ,canvasY);
    
    for(let i = 0; i <planks.length; i++) {
        console.log("Previous ladderCount"+prevLadderCount);
        if (planks[i].isDragable) {
            if(planks[i].status=="putted"){
                console.log("Previous ladderCount"+prevLadderCount);
                Top--;
                ladders[prevLadderCount].top--;
                planks[i].status="outside";
            }
            else{
                if(!checkPlankForCorrectPosition(curruntLadder,planks[i]))        //wrong position
                    planks[i].p=planks[i].originalPoints;
                else{
                    planks[i].p=curruntLadder.correctPositions[curruntLadder.top];
                    if(planks[i].status!="putted")
                        planks[i].status="putted";
                    Top++;
                    curruntLadder.top++;
                    if(curruntLadder.top>5){
                        isLadderFull=true;
                        curruntLadder=ladders[++ladderCount]
                    }
                }        
            }    
            planks[i].isDragable=false;
        }
    }
    updateStackGameCanvas();
});