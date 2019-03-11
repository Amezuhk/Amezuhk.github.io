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
    this.mBg = null;
    this.kBg = "assets/bg.png";
    //this.mLevelRenderableSet = new GameObjectSet();
    this.mSpikes = [];
    this.mLevelPlatform = null;
    this.mPlayer = 0;//index in the object set of the player object
    this.mGhost = new Ghost();
    this.kWCWidth = 100;
    this.kWCCenterX = 50;
    this.kWCCenterY = 37.5;
    this.kViewportWidth = 1000;
    this.kViewportHeight = 750;
    this.mMouse = null;
    this.mCamera = null;   
    
    this.r = 0.0;
    this.g = 0.0;
    this.b = 0.0;
}
gEngine.Core.inheritPrototype(Level, Scene);

Level.prototype.loadScene = function () {
    // load the scene file
    gEngine.TextFileLoader.loadTextFile(this.kLevelFile, 
        gEngine.TextFileLoader.eTextFileType.eXMLFile);
    gEngine.Textures.loadTexture(this.kBg);
    
    // loads the audios
    gEngine.AudioClips.loadAudio(this.kBgClip);
    gEngine.AudioClips.loadAudio(this.kCue);
};

Level.prototype.unloadScene = function () {
    // stop the background audio
    gEngine.AudioClips.stopBackgroundAudio();
    gEngine.Textures.unloadTexture(this.kBg);
    // unload the scene flie and loaded resources
    gEngine.TextFileLoader.unloadTextFile(this.kLevelFile);
    gEngine.AudioClips.unloadAudio(this.kBgClip);
    gEngine.AudioClips.unloadAudio(this.kCue);
    
    var success = this.mLevelPlatform.getObjectAt(this.mPlayer).getSuccess();
    if(!success){
        var nextLevel = new GameOver();
        gEngine.Core.startScene(nextLevel);
    }else{
        var nextLevel = new Win();
        gEngine.Core.startScene(nextLevel);
    }

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
    this._initializeLights();   // defined in Level_Lights.js
    
    
        // the Background
    var bgR = new LightRenderable(this.kBg);
    bgR.setElementPixelPositions(0, 1024, 0, 1024);
    bgR.getXform().setSize(100, 100);
    bgR.getXform().setPosition(50, 40);
    //bgR.getMaterial().setSpecular([1, 0, 0, 1]);
    var i;
    for (i = 0; i < 4; i++) {
        bgR.addLight(this.mGlobalLightSet.getLightAt(i));   // all the lights
    }
    this.mBg = new GameObject(bgR);
    
    
    this.mLevelPlatform = new LevelPlatform();
    var pl = new Player();
    this.mLevelPlatform.addToSet(pl);
    this.mLevelPlatform.setCamera(this.mCamera);
    var levelParser = new LevelFileParser(this.kLevelFile);
    var pickArr = [];
    var endOfWorld = levelParser.parseLevel(this.mLevelPlatform,this.mSpikes,pickArr);
    this.mLevelPlatform.setWorldEnd(endOfWorld);
    
    // now start the bg music ...
    gEngine.AudioClips.playBackgroundAudio(this.kBgClip);
    this.mMouse = new MousePlatforms(this.mLevelPlatform,this.mCamera);
    var i;
    for(i=0;i<pickArr.length;i++){
        this.mMouse.addPickup(pickArr[i]);
    }
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
Level.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0, 0, 1, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    this.mBg.draw(this.mCamera);
    this.mLevelPlatform.draw();
    var i;
    for(i=0;i<this.mSpikes.length;i++){
        this.mSpikes[i].draw(this.mCamera);
    }
    this.mGhost.draw(this.mCamera);
    this.mMouse.draw();
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
Level.prototype.update = function () {
   this.mLevelPlatform.update();
   
   gEngine.Physics.processCollision(this.mLevelPlatform,[]);

   var pl = this.mLevelPlatform.getObjectAt(this.mPlayer);
   var plX = pl.getXform();
   var wx,wy,wc,w,h;
   w = this.mCamera.getWCWidth();
   h = this.mCamera.getWCHeight();
   wc = this.mCamera.getWCCenter();
   wx = wc[0]-(w/2);
   wy = wc[1]-(h/2);
   this.mBg.getXform().setPosition(wc[0], wc[1]);
   this.mGlobalLightSet.getLightAt(0).setXPos(plX.getXPos());
   this.mGlobalLightSet.getLightAt(0).setYPos(plX.getYPos());
   
   this.mGlobalLightSet.getLightAt(2).setXPos(445);
   this.r++;
   this.b++;
   this.g++;
   this.mGlobalLightSet.getLightAt(2).setColor([this.r,this.g,this.b,1]);
   if(this.r > 9) {
       this.r = 0;
   }
      if(this.g > 9) {
       this.g = 0;
   }
      if(this.b > 9) {
       this.b = 0;
   }
   
   this.mGlobalLightSet.getLightAt(3).setXPos(wc[0] - (w/2) + 3);
   this.mGlobalLightSet.getLightAt(3).setYPos(wc[1] + (h/2) - 10);
   this.mGhost.rotateObjPointTo(pl.getXform().getPosition(),0.5);
   this.mGhost.update();
   var stop = pl.isAlive(this.mSpikes,wx,wy,440,this.mGhost);
   if(stop){
       this.mLevelPlatform.stopScroll();
   }
   var change = pl.shakeOver();
   if(change||pl.getSuccess()){
       gEngine.GameLoop.stop();
   }
   this.mMouse.update(pl);
};
