/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */
"use strict";

function LevelPlatform(renderableSet, worldEnd, camera) {
    this.mCurrentTime = Date.now();
    this.mElapsedTime = 0;
    this.mPreviousTime = this.mCurrentTime;
    
    this.mEndOfWorld = worldEnd;
    
    this.mCamera = camera;
    
    this.mLevelRenderableSet = renderableSet;
    
    this.mIsScrolling = true;
    
    this.mCameraSpeed = 15;
    
    // draw object if it is within x% horizontal distance to the right of the 
    // center of the camera. Example, draw if within 120% distane from cam
    this.kDrawBoundary = 120; 
    this.mLastStarterDrawIndex = 0;
    this.mIsRendering = false;
    
     this.mMsg = new FontRenderable("Renderables :");
    this.mMsg.setColor([0, 0, 0, 1]);
    this.mMsg.getXform().setPosition(2, 70);
    this.mMsg.setTextHeight(3);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
LevelPlatform.prototype.update = function () {
    if (this.mIsScrolling) {
        this._updateScrollingCamera();
    }
};

LevelPlatform.prototype._updateScrollingCamera = function () {
    var wcCenter = this.mCamera.getWCCenter();
    var msgCenter = this.mMsg.getXform().getPosition();
    
    this.mCurrentTime = Date.now();
    this.mElapsedTime = this.mCurrentTime - this.mPreviousTime;
    this.mPreviousTime = this.mCurrentTime;
    
    vec2.scaleAndAdd(wcCenter, wcCenter, [1,0], 
        ( this.mCameraSpeed * this.mElapsedTime)/1000);
    vec2.scaleAndAdd(msgCenter, msgCenter, [1,0], 
        ( this.mCameraSpeed * this.mElapsedTime)/1000);
    if(wcCenter[0] >= this.mEndOfWorld) {
        this.mIsScrolling = false;
    }
};

// this function will only draw the renderables that should be visible.
LevelPlatform.prototype.drawVisibleRenderables = function () {
    var i = this.mLastStarterDrawIndex, l;
    var count = 0;
    
    // start drawing at last known visible object
    for (i; i < this.mLevelRenderableSet.length; i++) {
        l = this.mLevelRenderableSet[i];
        if(this._isVisible(l)) {
            l.draw(this.mCamera);
            this.mIsRendering = true;
            count++;
        } else if (!this.mIsRendering) {
            // as the camera scrolls objects will move off screen to the 
            // left and we wont render them anymore so update index to
            // skip those objects
            this.mLastStarterDrawIndex += 1;
        }
    }
    this.mIsRendering = false;
    this.mMsg.setText("Renderables drawn: " + count);
    this.mMsg.draw(this.mCamera);   // only draw status in the main camera
    return i;
};

LevelPlatform.prototype._isVisible = function(object) {
    // Check right edge
    var camRightEdge = this.mCamera.getWCCenter()[0] + 
            ((this.mCamera.getWCWidth()/2) * (this.kDrawBoundary/100));
    var objLeftEdge = object.getXform().getXPos() - (object.getXform().getWidth()/2);
    if( objLeftEdge <= camRightEdge) {
        // Check left edge
        var camLeftEdge = this.mCamera.getWCCenter()[0] - 
            (this.mCamera.getWCWidth()/2);
        var objRightEdge = object.getXform().getXPos() + 
                (object.getXform().getWidth()/2);
        if(objRightEdge <= camLeftEdge) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
};

LevelPlatform.prototype.getRenderableSet = function(){
    return this.mLevelRenderableSet;
}