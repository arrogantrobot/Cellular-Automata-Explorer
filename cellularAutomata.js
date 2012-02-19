var rowArray = [];
setInterval(draw, 3); // 30 is the number of mils between

var canvas = document.createElement('canvas'); 
document.body.appendChild(canvas); 

var width = canvas.width = 400, 
    height = canvas.height = 400,
    c = canvas.getContext('2d');

var pxHeight = 1
var pxWidth = 1
var pxPerRow = Math.floor(width / pxWidth);
var pxPerTall = Math.floor(height/ pxHeight);
var rule = 30;
var mask = initMask();

function initRow() {
    var row = new BitArray();
    var mid = Math.floor(width/2);
    for (var i = 0; i<pxPerRow; i++){
        if(i==mid){
            row.set(i,true);
        } else {
            row.set(i,false);
        }
    }
    rowArray.push(row);
}

function initMask() {
    var msk = [];
    for(var i=0;i<8;i++){
        msk.push(Math.pow(2,i));
    }
    return msk;
}

function newRow(lastRow) {
    var row = new BitArray();   
    for(var i=0;i<pxPerRow;i++){
        row.set(i,getCell(lastRow,i));
    }
    return row;
}

function getCell(lastRow,i) {
    var idx = 0;
    if(i==0){
        if(lastRow.get(pxPerRow-1))
            idx+=1;
    } else {
        if(lastRow.get((i-1)%pxPerRow)){
            idx+=1;
        }
    }
    if(lastRow.get(i%pxPerRow)){
        idx+=2;
    }
    if(i==(pxPerRow-1)){
        if(lastRow.get(0)){
            idx+=4;
        }
    } else {
        if(lastRow.get((i+1)%pxPerRow)){
            idx+=4;
        }
    }
    return (rule & mask[idx]) ? true : false;
}

function draw() { 
    if(rowArray.length < 1){
       initRow();
    } 
    c.clearRect(0, 0, width, height);
    var len = rowArray.length;
    for(var i=0;i<len;i++){
        drawRow(rowArray[i],i);
    }
    if(rowArray.length==pxPerTall){
        delete rowArray.pop();
    }
    
    rowArray.unshift( newRow(rowArray[0]) );
}


function drawRow(rowToDraw,y) {
    for(var i=0;i<pxPerRow;i++){
        if(rowToDraw.get(i)){
            c.fillStyle = 'black';
        } else { 
            c.fillStyle = 'white';
        }
        c.fillRect(i, y, 1, 1);
    }
}





