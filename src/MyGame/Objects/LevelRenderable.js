/* 
 * Fie: LevelComponent.js
 * Object that makes up a level.(block, spikes, collectable, etc..)
 */
/*jslint node: true, vars: true */
/*global gEngine: false, console: false, Renderable: false, vec2: false, Transform: false */
/* find out more about jslint: http://www.jslint.com/help.html */

function LevelRenderable() {
    // the following are used to determine whether we should 
    // render this
    this.mLeftEdge = null;
    this.mRightEdge = null;
    
    Renderable.call(this);
    Renderable.prototype._setShader.call(this, gEngine.DefaultResources.getLightShader());
    this.mLights = [];
}
gEngine.Core.inheritPrototype(LevelRenderable, Renderable);

LevelRenderable.prototype.draw = function (aCamera) {
    
    var gl = gEngine.Core.getGL();
    this.mShader.activateShader(this.mColor, aCamera);  // always activate the shader first!
    this.mShader.loadObjectTransform(this.mXform.getXform());
    this.mShader.setLights(this.mLights);
    
    var start = gEngine.VertexBuffer.getShapeBufferStart(this.mShapeType);
    var count = gEngine.VertexBuffer.getShapeVerticesCount(this.mShapeType);
    gl.drawArrays(gl.TRIANGLE_STRIP, start, count); 
};

LevelRenderable.prototype.setType = function (type) { 
    this.mShapeType = type;
};
LevelRenderable.prototype.getType = function() { return this.mShapeType; };

LevelRenderable.prototype.setLeftEdge = function(lEdge) { 
    this.mLeftEdge = lEdge; };
LevelRenderable.prototype.getLeftEdge = function() { return this.mLeftEdge; };

LevelRenderable.prototype.setRightEdge = function(rEdge) { 
    this.mRightEdge = rEdge; };
LevelRenderable.prototype.getRightEdge = function() { return this.mRightEdge; };

LevelRenderable.prototype.getBBox = function(){
    var xform = this.getXform();
    var b = new BoundingBox(xform.getPosition(),xform.getWidth(), xform.getHeight());
    return b;
};

LevelRenderable.prototype.addLight = function (l) {
    this.mLights.push(l);
};