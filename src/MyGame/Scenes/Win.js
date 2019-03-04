/* global gEngine, Scene, vec2 */

function Win(){
    this.mMsg = null;
    this.mCamera=null;
    this.kLevelOneSceneFile = "assets/levels/one.xml";
    this.kLevelOneBgClip = "assets/sounds/BGClip.mp3";
    this.kCue = "assets/sounds/BlueLevel_cue.wav";
}

gEngine.Core.inheritPrototype(Win,Scene);

Win.prototype.unloadScene = function(){
    var nextLevel = new Level(this.kLevelOneSceneFile, this.kLevelOneBgClip,
        this.kCue);
    gEngine.Core.startScene(nextLevel);
};

Win.prototype.initialize = function(){
    this.mCamera = new Camera(
        vec2.fromValues(50, 37.5),   // position of the camera
        100,                       // width of camera
        [0, 0, 1000, 750]           // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    this.mMsg = new FontRenderable("Congratulations!");
    this.mMsg.setColor([0,0,0,1]);
    this.mMsg.getXform().setPosition(13,60);
    this.mMsg.setTextHeight(8);
};

Win.prototype.draw = function(){
    gEngine.Core.clearCanvas([.9,.9,.9,1]);
    this.mCamera.setupViewProjection();
    this.mMsg.draw(this.mCamera);
};