/* global gEngine, GameObject */

"use strict";

function Player(){
    this.mIsFalling = false;
    this.mVerticalSpeed = 0/60;
    this.mJumpSpeed = 50/60; //speed when jumping
    this.mGravity = -.8/60; //gravity of the player
    //this will result in a jump of 10 units
    //the jump will hit the high in 2 seconds
    //if the player isn't jumping to a higher block,
    //then the jump will finish in 4 seconds
    //iffy about this. can be changed later
    this.mPlayerMoveSpd = .4;//right and left player movement
    
    this.mPlayerObj = new Renderable();
    this.mPlayerObj.setColor([1,0,0,1]);
    this.mPlayerObj.getXform().setSize(5,5);
    this.mPlayerObj.getXform().setPosition(10,8);
    
    this.mPlayerSuccess = false; //if player reaches end or dies, change to proper scene
    this.mChangeScene = false;
    GameObject.call(this,this.mPlayerObj);
}
gEngine.Core.inheritPrototype(Player,GameObject);

Player.prototype.update = function(platformSet){
    var i;
    var xform = this.getXform();
    //TODO @@@@@@
    xform.incYPosBy(this.mVerticalSpeed);
    this.mVerticalSpeed= this.mVerticalSpeed + this.mGravity;
    var platXform, playerBox;
    var status = [];
    var playerBox = new BoundingBox(xform.getPosition(),xform.getWidth(),
    xform.getHeight());
    for(i=0;i<platformSet.length;i++){
        platXform = platformSet[i].getXform();
        var platbox = new BoundingBox(platXform.getPosition(),platXform.getWidth(),platXform.getHeight());
        status[i] = platbox.boundCollideStatus(playerBox);
    }
    var falling = true;
    for(i=0;i<status.length;i++){
        if(status[i]===4||status[i]===5||status[i]===6){
            this.mVerticalSpeed = 0;
            var topY = platformSet[i].getTopSideY();
            var playerHeight = xform.getHeight();
            var pos = topY +(playerHeight/2);
            xform.setYPos(pos);
            falling = false;
        }else if(status[i]===8){
            this.mVerticalSpeed = this.mGravity;
        }
    }
    if(!falling){
        if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Space)){
            this.mVerticalSpeed = this.mJumpSpeed;
        }
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)){
        var rightCollision = false;
        for(i=0;i<status.length;i++){
            if(status[i]===2||status[i]===10){
                rightCollision = true;
//                var playerWidth = xform.getWidth();
//                var rightX = platformSet[i].getRightSideX();
//                var pos = rightX + (playerWidth/2);
//                xform.setXPos(pos);
            }
        }
        if(!rightCollision){
            xform.incXPosBy(-this.mPlayerMoveSpd);
        }
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)){
        var leftCollision = false;
        for(i=0;i<status.length;i++){
            if(status[i]===1||status[i]===9){
                leftCollision = true;
//                var playerWidth = xform.getWidth();
//                var leftX = platformSet[i].getLeftSideX();
//                var pos = leftX - (playerWidth/2);
//                xform.setXPos(pos);
            }
        }
        if(!leftCollision){
            xform.incXPosBy(this.mPlayerMoveSpd);
        }
    }
    if(xform.getYPos()<-5){
        this.mPlayerSuccess = false;
        this.mChangeScene = true;
    }
    for(i=0;i<status.length;i++){
        var b = platformSet[i].getType();
        if(b===2 && status[i]!==0){
            this.mPlayerSuccess = false;
            this.mChangeScene = true;
        }
    }
    //the scene hasn't changed (spikes or falling off) check if they've won
    if(!this.mChangeScene){
        var lastPlatform,finishLine,finishXform;
        for(i=0;i<platformSet.length;i++){
            var b = platformSet[i].getType();
            if(b===1){
                lastPlatform = i;
            }
        }
        finishXform= platformSet[lastPlatform].getXform();
        finishLine = finishXform.getXPos();
        if(finishLine <= xform.getXPos()){
            this.mPlayerSuccess = true;
            this.mChangeScene = true;
        }
    }
};

Player.prototype.getSuccess = function(){
    return this.mPlayerSuccess;
};

Player.prototype.getSceneChange = function(){
    return this.mChangeScene;
};