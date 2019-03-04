/* global gEngine, Scene, MyGame, vec2 */

function GameOver(){
    this.mMsg = null;
    this.mRetry = null;
    this.mYes = null;
    this.mNo = null;
    this.mChoiceBox = null;
    this.mCamera = null;
    this.mChoice =true;
    this.kLevelOneSceneFile = "assets/levels/one.xml";
    this.kLevelOneBgClip = "assets/sounds/BGClip.mp3";
    this.kCue = "assets/sounds/BlueLevel_cue.wav";
}

gEngine.Core.inheritPrototype(GameOver,Scene);

GameOver.prototype.loadScene = function(){
    
};

GameOver.prototype.unloadScene = function(){
    var nextLevel = new Level(this.kLevelOneSceneFile, this.kLevelOneBgClip,
        this.kCue);
    gEngine.Core.startScene(nextLevel);
};

GameOver.prototype.initialize = function(){
    this.mCamera = new Camera(
        vec2.fromValues(50, 37.5),   // position of the camera
        100,                       // width of camera
        [0, 0, 1000, 750]           // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    
    this.mMsg = new FontRenderable("Game Over");
    this.mMsg.setColor([0,0,0,1]);
    this.mMsg.getXform().setPosition(28,60);
    this.mMsg.setTextHeight(9);
    this.mRetry = new FontRenderable("Retry?");
    this.mRetry.setColor([0,0,0,1]);
    this.mRetry.getXform().setPosition(37,45);
    this.mRetry.setTextHeight(9);
    this.mYes = new FontRenderable("Yes");
    this.mNo = new FontRenderable("No");
    this.mYes.setColor([0,0,0,1]);
    this.mNo.setColor([0,0,0,1]);
    this.mYes.getXform().setPosition(17,15);
    this.mNo.getXform().setPosition(70,15);
    this.mYes.setTextHeight(9);
    this.mNo.setTextHeight(9);
    
    this.mChoiceBox = new Renderable();
    this.mChoiceBox.setColor([1,1,1,1]);
    var size = this.mYes.getXform().getSize();
    this.mChoiceBox.getXform().setSize(size[0]+.5,size[1]+.5);
    var position = this.mYes.getXform().getPosition();
    this.mChoiceBox.getXform().setPosition(position[0]+5,position[1]-1);
};

GameOver.prototype.draw = function(){
    gEngine.Core.clearCanvas([.9,.9,.9,1]);
    this.mCamera.setupViewProjection();
    this.mChoiceBox.draw(this.mCamera);
    this.mMsg.draw(this.mCamera);
    this.mYes.draw(this.mCamera);
    this.mNo.draw(this.mCamera);
    this.mRetry.draw(this.mCamera);
    
};

GameOver.prototype.update = function(){
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)){
        var size = this.mYes.getXform().getSize();
        this.mChoiceBox.getXform().setSize(size[0]+.5,size[1]+.5);
        var position = this.mYes.getXform().getPosition();
        this.mChoiceBox.getXform().setPosition(position[0]+5,position[1]-1);
        this.mChoice = true;
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)){
        var size = this.mNo.getXform().getSize();
        this.mChoiceBox.getXform().setSize(size[0]+.5,size[1]+.5);
        var position = this.mNo.getXform().getPosition();
        this.mChoiceBox.getXform().setPosition(position[0]+2.5,position[1]-1);
        this.mChoice = false;
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Space)){
        if(this.mChoice){
            gEngine.GameLoop.stop();
        }
    }
};