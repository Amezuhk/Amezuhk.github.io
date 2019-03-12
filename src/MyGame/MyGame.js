/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame() {
    this.kUIButton = "assets/UI/button.png";
    this.kLevelOneSceneFile = "assets/levels/one.xml";
    this.kLevelOneBgClip = "assets/sounds/BGClip.mp3";
    this.kCue = "assets/sounds/BlueLevel_cue.wav";
    // The camera to view the scene
    this.mCamera = null;
    this.Button1 = null;
    this.mMsg = null;
}
gEngine.Core.inheritPrototype(MyGame, Scene);


MyGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kUIButton);
};

MyGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kUIButton);
    var nextLevel = new Level(this.kLevelOneSceneFile, this.kLevelOneBgClip,
    this.kCue);
    gEngine.Core.startScene(nextLevel);
};

MyGame.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(50, 37.5), // position of the camera
        100,                     // width of camera
        [0, 0, 1000, 750]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.5, 0.5, 1, 1]);
            // sets the background to gray
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);

    this.mMsg = new UIText("Brix",[500,650],20,1,0,[0,0,0,1]);
    this.mButton1 = new UIButton(this.kUIButton,this.STUFF1,this,[500,250],[300,100],"Start",8,[1,1,1,1],[0,0,0,1]);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    this.mCamera.setupViewProjection();
    this.mButton1.draw(this.mCamera);
    this.mMsg.draw(this.mCamera);
};

MyGame.prototype.update = function () {
    this.mButton1.update();
};

MyGame.prototype.STUFF1 = function(){
  gEngine.GameLoop.stop();
};