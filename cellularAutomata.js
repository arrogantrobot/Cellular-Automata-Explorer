
function onInit(){  
    window.rowArray = [];
    window.buffs = [];
    window.buffFlag = 0;
    window.pause = 0;
    window.width;
    window.height;
    window.pxHeight = 1
    window.pxWidth = 1
    window.pxPerRow;
    window.pxPerTall;
    window.rule;
    window.mask;
    window.rule_submit_button;
    window.rule_textbox;
    window.showDetails = 0;
    buffs.push( document.createElement('canvas') );
    buffs.push( document.createElement('canvas') );
    buffs[0].setAttribute("id","buff1");
    buffs[1].setAttribute("id","buff2");
    document.body.appendChild(buffs[0]); 
    document.body.appendChild(buffs[1]); 
    width = buffs[0].width = buffs[1].width = window.innerWidth-4;//400; 
    height = buffs[0].height = buffs[1].height = 400;//window.innerHeight; //400;
    initCanvases();
    pxPerRow = Math.floor(width / pxWidth);
    pxPerTall = Math.floor(height/ pxHeight);
    rule = 30;
    mask = initMask();
    initButtons();
    setInterval(draw, 30); // 30 is the number of mils between
    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 83)  {
            Canvas2Image.saveAsPNG(buffs[buffFlag]);
        }
        if(event.keyCode == 32) {
            pause = pause ? 0 : 1;
        }
        if (event.keyCode == 39){
            setRule(rule+1);
        }
        if (event.keyCode == 37){
            setRule(rule-1);
        }
        if (event.keyCode == 82){
            resetImage();
        }
        if (event.keyCode == 68){
            showHideDetail();
        }
    });
}

function resetImage() {
    rowArray = [];
    initCanvases();
}

function initCanvases() {
    c = buffs[0].getContext('2d');
    c.fillStyle = 'black';
    c.fillRect(0, 0, width, height);
    c = buffs[1].getContext('2d');
    c.fillStyle = 'black';
    c.fillRect(0, 0, width, height);

    buffs[0].style.visibility='visible';
    buffs[1].style.visibility='hidden';
}

function initButtons() {
    rule_submit_button = document.getElementById("rule_submit");
    rule_textbox = document.getElementById("rule_textbox");
}

function ruleSubmit() {
    setRule(rule_textbox.value);
    rule_textbox.focus();
    rule_textbox.blur();
}

function textReturn(e){
    if (typeof e == 'undefined' && window.event) { 
        e = window.event; 
    }
    if (e.keyCode == 13)
    {
        document.rule_submit_button.click();
    }
}

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
    if(pause){
    } else {
        copyBuffs();
        drawRow();
        flipBuffs();
        if(rowArray.length==pxPerTall){
            delete rowArray.pop();
        }
        rowArray.unshift( newRow(rowArray[0]) );
    }
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

function setRule( ruleNum ) {
    if((ruleNum > 255) || (ruleNum < 0)){
        alert("Rule must be between 0 and 255.");
        return;
    }
    rule = ruleNum;
    if(showDetails){
        updateDetails();
    }
}

function showHideDetails() {
    if(showDetails == 1){
        showDetails = 0;
    } else {
        showDetails = 1;
    }
}

