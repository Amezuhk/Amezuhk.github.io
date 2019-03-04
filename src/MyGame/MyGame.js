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

function MyGame(canvasID) {
    // The camera to view the scene
    this.kLevelOneSceneFile = "assets/levels/one.xml";
    this.kLevelOneBgClip = "assets/sounds/BGClip.mp3";
    this.kCue = "assets/sounds/BlueLevel_cue.wav";
    
    this.mLevel = new Level(this.kLevelOneSceneFile, this.kLevelOneBgClip,
        this.kCue);

    gEngine.Core.initializeEngineCore(canvasID, this.mLevel);
}