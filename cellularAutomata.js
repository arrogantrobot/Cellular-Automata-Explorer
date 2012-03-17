/* By rob at archetyp.al

Inspired by the one dimensional cellular-automata explored by
Stephen Wolfram in "A New Kind of Science".

There are many implementations of the one dimensional CA, but
this particular project is meant to allow the user to explore the
properties of the various rules by starting from initial conditions
other than a single "on" cell in the center.

This version still begins with the typical single "on" cell in the
center at the first time-step or after a reset (r). However, the user
can change the rule at any step, causing the output of the previous
rule to be the input of the next rule. This leads to discoveries and
an enjoyable interaction with the system and sense for how it works
that does not come from merely reading about it or watching a single
rule play out. 

The rules between 129 and 135 play well together. Rule 90 is a strange
and beautiful thing: http://en.wikipedia.org/wiki/Rule_90 .
*/


function onInit(){  
    window.ruleSets = [];
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
    window.showDetails = 1;
    window.control_panel = document.getElementById("control_panel");
    window.ca = document.getElementById("ca");
    window.column1 = document.getElementById("column1");
    window.column2 = document.getElementById("column2");
    window.detail_can = document.getElementById("detail_can");

/*
    window.onresize = function(){ 
        window.location.reload();
    };
*/

    initRuleSets();

    rule_submit_button = document.getElementById("rule_submit");
    rule_submit_button.setAttribute("onclick","ruleSubmit();");
    rule_textbox = document.getElementById("rule_textbox");
    rule_textbox.setAttribute("onkeypress","textReturn(event);");

    buffs.push( document.createElement('canvas') );
    buffs.push( document.createElement('canvas') );
    buffs[0].setAttribute("class","buff1");
    buffs[1].setAttribute("class","buff2");

    ca.appendChild(buffs[0]); 
    ca.appendChild(buffs[1]); 

    width = buffs[0].width = buffs[1].width = window.innerWidth-4;//400; 
    height = buffs[0].height = buffs[1].height = window.innerHeight-270; //400;
    control_panel.style.top= (height+2)+"px";
    detail_can.width = width - 504;
    detail_can.height = 236;

    initCanvases();
    pxPerRow = Math.floor(width / pxWidth);
    pxPerTall = Math.floor(height/ pxHeight);
    rule = 129;
    mask = initMask();
    initButtons();
    setInterval(draw, 30); // 30 is the number of mils between
    updateDetails();
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
    ruleSubmit();
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
        rule_submit_button.click();
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

function setRule( r ) {
    var newRule = parseInt(r);
    if((newRule > 255) || (newRule < 1)){
        alert("Rule must be between 1 and 255.");
        return;
    }
    rule = newRule;
    rule_textbox.value = newRule;
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

function updateDetails(){
    det_can = window.detail_can.getContext('2d');
    det_can.fillStyle='black';
    det_can.fillRect(0,0,1000,1000);//det_can.width,det_can.height);
    var x_offset = 80;
    var y_offset = 60;

    det_can.font = "16pt Courier New";
    det_can.fillStyle = 'white';
    det_can.fillText("Rule #: "+rule,x_offset+160,y_offset-20);

    det_can.font = "8pt Courier New";
    det_can.fillText("  future:",x_offset-70,y_offset+9);
    det_can.fillText("previous:",x_offset-70,y_offset+25);

    for(var i=0;i<8;i++){
        drawLocalRule(i,det_can,x_offset,y_offset);
        x_offset+=60;
    }
}

function drawLocalRule(ruleNum,det_can,x_offset,y_offset){
    var x_col_1=0,x_col_2=19,x_col_3=38;
    var y_row_1=0,y_row_2=17;
    var box_w=12,box_h=10;

    det_can.fillStyle = 'gray';
    det_can.fillRect(x_offset-2,y_offset-2,54,31);


    det_can.fillStyle = (rule & mask[ruleNum]) ? 'black' : 'white';
    det_can.fillRect(   x_offset+x_col_2, y_offset,
                        box_w, box_h);

    det_can.fillStyle = (ruleNum & 1) ? 'black' : 'white';
    det_can.fillRect(   x_offset+x_col_1, y_offset+y_row_2,
                        box_w, box_h);

    det_can.fillStyle = (ruleNum & 2) ? 'black' : 'white';
    det_can.fillRect(   x_offset+x_col_2, y_offset+y_row_2,
                        box_w, box_h);

    det_can.fillStyle = (ruleNum & 4) ? 'black' : 'white';
    det_can.fillRect(   x_offset+x_col_3, y_offset+y_row_2,
                        box_w, box_h);

    det_can.fillStyle = 'white';
    det_can.font = "8pt Courier New";
    det_can.fillText(ruleNum,x_offset+x_col_2+3,y_offset+y_row_2+25);
}

function initRuleSets(){
    for(var i=0;i<8;i++){
        var ba = new BitArray();
        ba.set(0,i & 1);
        ba.set(1,i & 2);
        ba.set(2,i & 4);
        window.ruleSets.push(ba);
    }    
}

