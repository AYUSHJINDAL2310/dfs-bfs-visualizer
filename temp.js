let maze=document.querySelector(".maze");
let ctx=maze.getContext("2d");
let is=false;
let x=0;
let current;
let ans=0;
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }
class Maze
{
constructor(size,rows,columns)
{
    this.size=size;
    this.rows=rows;
    this.columns=columns;
    this.grid=[];
    this.stack=[];
    this.store=[];
}

setup()
{
    for(let r=0;r<this.rows;r++)
    {   
        let row=[];
        for(let c=0;c<this.columns;c++)
        {
            let cell=new Cell(r,c,this.grid,this.size);
            row.push(cell);
        }
        this.store.push(row);
        this.grid.push(row);
    }
    current=this.grid[0][0];
}

draw()
{  
    
    maze.width=this.size;
    maze.height=this.size;
    maze.style.background='white';
    current.visited=true;

    for(let r=0;r<this.rows;r++)
    {
        for(let c=0;c<this.columns;c++)
        {
            let grid=this.grid;
            grid[r][c].show(this.size,this.rows,this.columns);
        }
    }
    if(!is)
    return;
    if(is) 
    {
    let next=current.checkNeighbours();
    
    if(next)
    {
        next.visited=true;
        this.stack.push(current);
       current.highlight(this.columns);
        current.removeWalls(current,next);
        current=next;
    }
    else if(this.stack.length>0)
    {
        let cell=this.stack.pop();
        current=cell;
        current.highlight(this.columns);
    }
    if(this.stack.length==0)
    {
        console.log(this.grid);
    return;
    }
    window.requestAnimationFrame(()=>
    {
        this.draw();
    })
}
}

bfs()
{   
       
        let t=this.stack[0];
        console.log(t);
        let next=this.stack[0].getnode();
        // console.log(next);
        let x=(this.stack[0].rowNum*this.size)/this.rows;
        let y=(this.stack[0].colNum*this.size)/this.columns;
        ctx.fillStyle='red';
        ctx.fillRect(y+1,x+1,this.size/this.columns-5,this.size/this.rows-5);
        // sleep(500);
        if(this.stack[0].rowNum===9&&this.stack[0].colNum===9)
        {
        this.printpath(this.grid[9][9]);
        return;
        }
        this.stack.shift();
        // sleep(100);
        for(let i=0;i<next.length;i++)
        {
        next[i].vis=true;
        this.store[next[i].rowNum][next[i].colNum]=t;
        this.stack.push(next[i]);
        }
        if(this.stack.length>0)
        {
            window.requestAnimationFrame(()=>
            {
                this.bfs();
            })
        }
    return;
}

printpath(ini)
{     
    ans+=1;
    let x=(ini.rowNum*this.size)/this.columns;
    let y=(ini.colNum*this.size)/this.rows;
    ctx.fillStyle='yellow';
    // sleep(100);
    ctx.fillRect(y+1,x+1,this.size/this.columns-5,this.size/this.rows-5);
    let n=this.store[ini.rowNum][ini.colNum];
    if(ini===n)
    {
    alert(ans);
    return;
    }
    ini=n;
    window.requestAnimationFrame(()=>
            {
                this.printpath(ini);
            })

}

}
class Cell
{
constructor(rowNum,colNum,parentGrid,parentSize)
{
    this.rowNum=rowNum;
    this.colNum=colNum;
    this.parentGrid=parentGrid;
    this.parentSize=parentSize;
    this.visited=false;
    this.vis=false;
    this.walls={
        topWall: true,
        rightWall:true,
        bottomWall:true,
        leftWall:true,
    };
}

checkNeighbours()
{
    let grid=this.parentGrid;
    let row=this.rowNum;
    let col=this.colNum;

    let neighbours=[];
    let top=row!==0?grid[row-1][col]:undefined;
    let right=col!==grid.length-1?grid[row][col+1]:undefined;
    let bottom=row!==grid.length-1?grid[row+1][col]:undefined;
    let left=col!==0?grid[row][col-1]:undefined;

    if(top&&!top.visited)
    neighbours.push(top);
    if(right&&!right.visited)
    neighbours.push(right);
    if(bottom&&!bottom.visited)
    neighbours.push(bottom);
    if(left&&!left.visited)
    neighbours.push(left);

    if(neighbours.length!==0)
    {
        let random=Math.floor(Math.random()*neighbours.length);
    // console.log(neighbours.length);
        return neighbours[random];
    }
    else
    {
        return undefined;
    }
}

getnode()
{
    let grid=this.parentGrid;
    let row=this.rowNum;
    let col=this.colNum;
    let arr=[];
    
    let top=row!==0?grid[row-1][col]:undefined;
    let right=col!==grid.length-1?grid[row][col+1]:undefined;
    let bottom=row!==grid.length-1?grid[row+1][col]:undefined;
    let left=col!==0?grid[row][col-1]:undefined;
    
    if(top&&!top.vis&&!this.walls.topWall)
    {   
        arr.push(top);
    }
    if(right&&!right.vis&&!this.walls.rightWall)
    {  
        arr.push(right);
    }
    if(bottom&&!bottom.vis&&!this.walls.bottomWall)
    {  
        arr.push(bottom);
    }
    if(left&&!left.vis&&!this.walls.leftWall)
    {  
        arr.push(left);
    }
    return arr;
}

drawTopWall(x,y,size,columns,rows)
{
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(x+size/columns,y);
    ctx.stroke();
}

drawRightWall(x,y,size,columns,rows)
{
    ctx.beginPath();
    ctx.moveTo(x+size/columns,y);
    ctx.lineTo(x+size/columns,y+size/rows);
    ctx.stroke();
}

drawBottomWall(x,y,size,columns,rows)
{
    ctx.beginPath();
    ctx.moveTo(x,y+size/rows);
    ctx.lineTo(x+size/columns,y+size/rows);
    ctx.stroke();
}

drawLeftWall(x,y,size,columns,rows)
{
    ctx.beginPath(); 
    ctx.moveTo(x,y);
    ctx.lineTo(x,y+size/rows);
    ctx.stroke();
}

highlight(columns)
{
    let x=(this.colNum*this.parentSize)/columns+1;
    let y=(this.rowNum*this.parentSize)/columns+1;
    ctx.fillStyle='red';
    //  sleep(200);
    ctx.fillRect(x,y,this.parentSize/columns-3,this.parentSize/columns-3)
}

removeWalls(cell1,cell2)
{
    let x=cell1.colNum-cell2.colNum;
    if(x==1)
    {
        cell1.walls.leftWall=false;
        cell2.walls.rightWall=false;
    }
    else if(x==-1)
    {
        cell1.walls.rightWall=false;
        cell2.walls.leftWall=false;
    }

    let y=cell1.rowNum-cell2.rowNum;
    if(y==1)
    {
        cell1.walls.topWall=false;
        cell2.walls.bottomWall=false;
    }
    else if(y==-1)
    {
        cell1.walls.bottomWall=false;
        cell2.walls.topWall=false;
    }
}

show(size,rows,columns)
{
let x=(this.colNum*size)/columns;
let y=(this.rowNum*size)/rows;
ctx.strokeStyle="black";
ctx.fillStyle="white";
ctx.lineWidth=4;
if(this.walls.topWall)
this.drawTopWall(x,y,size,columns,rows);
if(this.walls.rightWall)
this.drawRightWall(x,y,size,columns,rows);
if(this.walls.bottomWall)
this.drawBottomWall(x,y,size,columns,rows);
if(this.walls.leftWall)
this.drawLeftWall(x,y,size,columns,rows);
if(this.visited)
ctx.fillRect(x+1,y+1,size/columns-2,size/rows-2);
}
}
let newMaze=new Maze(550,20,20);
newMaze.setup();
newMaze.draw();
is=false;
newMaze.draw();
let t=document.querySelector('#bt');
t.addEventListener('click',function(){
    is=true;
    newMaze.draw();
})
let tr=document.querySelector('#btn');
tr.addEventListener('click',function(){
    newMaze.grid[0][0].vis=true;
    
    newMaze.stack.push(newMaze.grid[0][0]);
    newMaze.bfs();
})
// let r=document.querySelector('#bt3');
// r.addEventListener('click',function(){
//     newMaze.printpath(newMaze.grid[15][15]);
// })
