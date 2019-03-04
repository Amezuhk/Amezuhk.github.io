/* 
 * Fie: LevelComponent.js
 * Object that makes up a level.(block, spikes, collectable, etc..)
 */
/*jslint node: true, vars: true */
/*global gEngine: false, console: false, Renderable: false, vec2: false, Transform: false */
/* find out more about jslint: http://www.jslint.com/help.html */

function LevelRenderable(type) {
    this.mShapeType = type;
    
    // the following are used to determine whether we should 
    // render this
    this.mLeftEdge = null;
    this.mRightEdge = null;
    
    Renderable.call(this);
}
gEngine.Core.inheritPrototype(LevelRenderable, Renderable);

LevelRenderable.prototype.draw = function (aCamera) {
    var gl = gEngine.Core.getGL();
    this.mShader.activateShader(this.mColor, aCamera);  // always activate the shader first!
    this.mShader.loadObjectTransform(this.mXform.getXform());
    
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

LevelRenderable.prototype.getBBox = function(){
    var xform = this.getXform();
    var b = new BoundingBox(xform.getPosition(),xform.getWidth(), xform.getHeight());
    return b;
};
LevelRenderable.prototype.getRightSideX = function(){
    var xform = this.getXform();
    var x, width, finalX;
    x = xform.getXPos();
    width = xform.getWidth();
    finalX = x +(width/2);
    return finalX;
};
LevelRenderable.prototype.getLeftSideX = function(){
    var xform = this.getXform();
    var x, width, finalX;
    x = xform.getXPos();
    width = xform.getWidth();
    finalX = x -(width/2);
    return finalX;
};
LevelRenderable.prototype.getTopSideY = function(){
    var xform = this.getXform();
    var y, height, finalY;
    y = xform.getYPos();
    height = xform.getHeight();
    finalY = y+(height/2);
    return finalY;
};
LevelRenderable.prototype.getBotSideY = function(){
    var xform = this.getXform();
    var y, height, finalY;
    y = xform.getYPos();
    height = xform.getHeight();
    finalY = y -(height/2);
    return finalY;
};