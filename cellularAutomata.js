var rowArray = [];
setInterval(draw, 30); // 30 is the number of mils between
var buffs = [];
buffs.push( document.createElement('canvas') );
buffs.push( document.createElement('canvas') );
document.body.appendChild(buffs[0]); 
document.body.appendChild(buffs[1]); 
var buffFlag = 0;

var width = buffs[0].width = buffs[1].width = window.innerWidth; //400; 
var height = buffs[0].height = buffs[1].height = window.innerHeight; //400;

c = buffs[0].getContext('2d');
c.fillStyle = 'black';
c.fillRect(0, 0, width, height);
c = buffs[1].getContext('2d');
c.fillStyle = 'black';
c.fillRect(0, 0, width, height);

buffs[0].style.visibility='visible';
buffs[1].style.visibility='hidden';
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
    //c.clearRect(0, 0, width, height);
    //for(var i=0;i<len;i++){
    copyBuffs();
    drawRow();//rowArray[i],i);
    //}
    flipBuffs();
    if(rowArray.length==pxPerTall){
        delete rowArray.pop();
    }
    
    rowArray.unshift( newRow(rowArray[0]) );
}


function drawRow(){//rowToDraw,y) {
    for(var i=0;i<pxPerRow;i++){
        if(rowArray[0].get(i)){
            c.fillStyle = 'black';
        } else { 
            c.fillStyle = 'white';
        }
        c.fillRect(i, 0, 1, 1);
    }
}

function copyBuffs(){
    if(buffFlag){
        c.drawImage(buffs[1],0,0,width,height-1,0,1,width,height-1);
    } else {
        c.drawImage(buffs[0],0,0,width,height-1,0,1,width,height-1);
    }
}

function flipBuffs(){
    if(buffFlag){
        c = buffs[buffFlag].getContext('2d');
        buffs[buffFlag].style.visibility='hidden';
        buffFlag--;
        buffs[buffFlag].style.visibility='visible';
    }else{
        c = buffs[buffFlag].getContext('2d');
        buffs[buffFlag].style.visibility='hidden';
        buffFlag++;
        buffs[buffFlag].style.visibility='visible';
    }
}



