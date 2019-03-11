/*
 * File: SceneFile_Parse.js 
 */
/*jslint node: true, vars: true */
/*global gEngine: false, console: false, Camera: false, vec2: false, Renderable: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function LevelFileParser(sceneFilePath) {
   this.mSceneXml = gEngine.ResourceMap.retrieveAsset(sceneFilePath);
}

LevelFileParser.prototype._getElm = function (tagElm) {
    var theElm = this.mSceneXml.getElementsByTagName(tagElm);
    if (theElm.length === 0) {
        console.error("Warning: Level element:[" + tagElm + "]: is not found!");
    }
    return theElm;
};

LevelFileParser.prototype.parseLevel = function (levelSet,spikes,pickupArr) {
    var elm = this._getElm("Block");
    var type, i, j, x, y, w, h, r, c, levelObject;
    for (i = 0; i < elm.length; i++) {
        type = Number(elm.item(i).attributes.getNamedItem("Type").value);
        x = Number(elm.item(i).attributes.getNamedItem("PosX").value);
        y = Number(elm.item(i).attributes.getNamedItem("PosY").value);
        w = Number(elm.item(i).attributes.getNamedItem("Width").value);
        h = Number(elm.item(i).attributes.getNamedItem("Height").value);
        r = Number(elm.item(i).attributes.getNamedItem("Rotation").value);
        c = elm.item(i).attributes.getNamedItem("Color").value.split(" ");
        
        levelObject = new LevelRenderable();
        // make sure color array contains numbers
        for (j = 0; j < 4; j++) {
            c[j] = Number(c[j]);
        }
        levelObject.setType(type);
        //levelObject.setLeftEdge(ledge);
        //levelObject.setRightEdge(redge);
        levelObject.setColor(c);
        levelObject.getXform().setPosition(x, y);
        levelObject.getXform().setRotationInDegree(r); // In Degree
        levelObject.getXform().setSize(w, h);
        if(type===2){
            //add it to the spike array
            spikes.push(levelObject);
        }else if(type===1){
            var gObj = new GameObject(levelObject);//add renderable to gameObject
            var rObj = new RigidRectangle(levelObject.getXform(),w,h);
            rObj.setMass(0);//prevents the platform form moving
            gObj.setRigidBody(rObj);
//            gObj.toggleDrawRigidShape();
            //add it to the platform set
            levelSet.addToSet(gObj);
        }else if(type===3){
            var pick = new PlatformPickup(x,y);
            pickupArr.push(pick);
        }
    }
    var worldEnd = this._getElm("EndOfWorld");
    return Number(worldEnd[0].attributes.getNamedItem("value").value);
};
