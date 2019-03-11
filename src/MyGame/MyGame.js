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
    this.mShapes = new GameObjectSet();
    this.mPlayer = this.mShapes.size();
    this.Button1 = null;
    this.Button2 = null;
    this.mMsg = null;
    this.mMouse = null;
//    this.mSmoke = null;
    this.ghost = null;
}
gEngine.Core.inheritPrototype(MyGame, Scene);


MyGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kUIButton);
};

MyGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kUIButton);
//    var nextLevel = new Level(this.kLevelOneSceneFile, this.kLevelOneBgClip,
//    this.kCue);
    var nextLevel = new GameOver();
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

    var g = new Player();
    this.mShapes.addToSet(g);
    
    var l = new Renderable();
    l.setColor([0,.5,.5,1]);
    var xf2 = l.getXform();
    xf2.setSize(10,2.5);
    xf2.setPosition(50,20);
    var g2 = new GameObject(l);
    var r2 = new RigidRectangle(xf2,10,2.5);
    r2.setMass(0);
    g2.setRigidBody(r2);
    g2.toggleDrawRigidShape();
    this.mShapes.addToSet(g2);
    this.mMsg = new UIText("Brix",[500,650],20,1,0,[0,0,0,1]);
    this.mButton1 = new UIButton(this.kUIButton,this.STUFF1,this,[500,250],[300,100],"Start",8,[1,1,1,1],[0,0,0,1]);
//    this.mSmoke = new Smoke(30,9,3,-30,3,0,5,0,20,0,1,3);
    this.ghost = new Ghost();
    this.mMouse = new MousePlatforms(this.mShapes,this.mCamera);
    var pick = new PlatformPickup(70,30);
    this.mMouse.addPickup(pick);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    this.mCamera.setupViewProjection();
    this.mShapes.draw(this.mCamera);
    //this.mButton1.draw(this.mCamera);
    //this.mMsg.draw(this.mCamera);
    this.ghost.draw(this.mCamera);
    this.mMouse.draw();
};

MyGame.prototype.update = function () {
    this.mShapes.update();    
    var pl = this.mShapes.getObjectAt(0);
    //pl.checkFall();
    var o = this.mShapes.getObjectAt(1);
    var col = new CollisionInfo();
    var ot = o.getRigidBody();
    var status = pl.getRigidBody().collisionTest(ot,col);
    if(status){
        pl.setFall(false);
    }
    this.mButton1.update();
    gEngine.Physics.processCollision(this.mShapes,[]);
    this.ghost.rotateObjPointTo(pl.getXform().getPosition(),1);
    this.ghost.update();
    var sp = [];
    var change = pl.isAlive(sp,0,0,100,this.ghost);
    change = pl.shakeOver();
    if(change){
        gEngine.GameLoop.stop();
    }
    this.mMouse.update(pl);
};

MyGame.prototype.STUFF1 = function(){
  gEngine.GameLoop.stop();
};