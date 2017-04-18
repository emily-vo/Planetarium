const THREE = require('three')
import Asset from './assets/asset'

// this class will mostly be unchanged from world to world. 
// variation in worlds will mostly rely on the various assets.

export default class World {
    constructor(scene, timer, baseMesh) {
        this.scene = scene;
        this.timer = timer;
        this.assets = [];
        this.baseMesh = baseMesh;
        this.createScene();
    }

    // for now, just adds the base mesh
    createScene() {
        this.scene.add(this.baseMesh);
    }

    // easy getter for vertex list
    worldVertices() {
        return this.baseMesh.geometry.vertices;
    }

    // easy getter for face list
    worldFaces() {
        return this.baseMesh.geometry.faces;
    }

    spin(speed) {
        // Spin the world  
        this.baseMesh.rotation.y = speed;
        this.baseMesh.updateMatrix();
        this.baseMesh.geometry.applyMatrix( this.baseMesh.matrix );

        for (var i = 0; i < this.assets.length; i++) {
            var asset = this.assets[i];
            asset.setPosition(asset.vertex);
            this.baseMesh.geometry.computeFaceNormals();
            this.baseMesh.geometry.computeVertexNormals();
            asset.alignItemsWithNormal(); 
        }   

    // easeSpin(speed) {
    //     // slow world down
    //     this.baseMesh.rotation.y -= speed; 
    //     this.baseMesh.updateMatrix();
    //     this.baseMesh.geometry.applyMatrix( this.baseMesh.matrix );

    //     for (var i = 0; i < this.assets.length; i++) {
    //         var asset = this.assets[i];
    //         if (i == 0) console.log(asset.vertex);
    }


    // spawn asset at random vertex (adds to scene) and adds to the global list of assets
    spawnAsset(asset) {
        var vertices = this.worldVertices();
        var faces = this.worldFaces();
        
        // get vertex from idx stored in face
        var faceIdx = Math.max(0, 
            Math.min(Math.floor(Math.random() * faces.length), faces.length - 1));
        var vIdx = Math.max(0, 
            Math.min(Math.floor(Math.random() * 3), 2));
        
        var face = faces[faceIdx];

        var arr = ['a', 'b', 'c'];
        var char = arr[vIdx];
        
        var vertex = vertices[face[char]];
        asset.vertex = vertex;

        // add asset to a random point on the sphere
        this.addAsset(asset, vertex); 

        // assign normal
        
        asset.faceIdx = faceIdx;
        asset.vIdx = vIdx;
        asset.normal = this.getNormal(asset);
        asset.alignItemsWithNormal();       
    }

    getNormal(asset) {
        var faces = this.worldFaces();
        return faces[asset.faceIdx].vertexNormals[asset.vIdx];
    }

    // adds assets to global list and adds their geometry to the scene
    addAsset(asset, position) {
        this.assets.push(asset);
        asset.setPosition(position);
        asset.addToScene();
    }

    // update shader times
    updateShaderUniforms() {
        //this.baseMesh.material.uniforms;
        for (var i = 0; i < this.assets.length; i++) {
            this.assets[i].updateShaderUniforms();
        }
    }

    // update assets
    tick() {
        this.updateShaderUniforms();     
        // this.spin();
        // assets tick
        for (var i = 0; i < this.assets.length; i++) {
          this.assets[i].tick();
        }
    }
}