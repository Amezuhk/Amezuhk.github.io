/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */
"use strict";

function Level(sceneFile, bgClip, cue) {
    // scene file name
    this.kLevelFile = sceneFile;
    // audio clips: supports both mp3 and wav formats
    this.kBgClip = bgClip;
    this.kCue = cue;
    
    this.mLevelRenderableSet = [];
    
    this.mLevelPlatform = null;
    this.mPlayer = null;
    this.kWCWidth = 100;
    this.kWCCenterX = 50;
    this.kWCCenterY = 37.5;
    this.kViewportWidth = 1000;
    this.kViewportHeight = 750;
    
    this.mCamera = null;   
}
gEngine.Core.inheritPrototype(Level, Scene);

Level.prototype.loadScene = function () {
    // load the scene file
    gEngine.TextFileLoader.loadTextFile(this.kLevelFile, 
        gEngine.TextFileLoader.eTextFileType.eXMLFile);

    // loads the audios
    gEngine.AudioClips.loadAudio(this.kBgClip);
    gEngine.AudioClips.loadAudio(this.kCue);
};

Level.prototype.unloadScene = function () {
    // stop the background audio
    gEngine.AudioClips.stopBackgroundAudio();

    // unload the scene flie and loaded resources
    gEngine.TextFileLoader.unloadTextFile(this.kLevelFile);
    gEngine.AudioClips.unloadAudio(this.kBgClip);
    gEngine.AudioClips.unloadAudio(this.kCue);
    
    var success = this.mPlayer.getSuccess();
    if(!success){
        var nextLevel = new GameOver();
        gEngine.Core.startScene(nextLevel);
    }else{
        var nextLevel = new Win();
        gEngine.Core.startScene(nextLevel);
    }
    // TO-DO load game over scene
};

Level.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(this.kWCCenterX, this.kWCCenterY), // position of the camera
        this.kWCWidth,                       // width of camera
        [0, 0, this.kViewportWidth, this.kViewportHeight]           // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.5, 0.5, 1, 1]);
            // sets the background to gray

    var levelParser = new LevelFileParser(this.kLevelFile);
    var endOfWorld = levelParser.parseLevel(this.mLevelRenderableSet);
    
    this.mLevelPlatform = new LevelPlatform(this.mLevelRenderableSet, endOfWorld,
        this.mCamera);
    this.mPlayer = new Player();
    // now start the bg music ...
    gEngine.AudioClips.playBackgroundAudio(this.kBgClip);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
Level.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0, 0, 1, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    this.mPlayer.draw(this.mCamera);
    this.mLevelPlatform.drawVisibleRenderables();
    
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
Level.prototype.update = function () {
   this.mLevelPlatform.update();
   this.mPlayer.update(this.mLevelRenderableSet);
   var sceneChange= this.mPlayer.getSceneChange();
   if(sceneChange){
       gEngine.GameLoop.stop();
   }
};
