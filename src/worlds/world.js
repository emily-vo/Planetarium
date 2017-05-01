const THREE = require('three')
import Asset from './assets/asset'

// this class will mostly be unchanged from world to world. 
// variation in worlds will mostly rely on the various assets.

export default class World {
    constructor(scene, timer, baseMesh, position) {
        this.position = position;
        this.scene = scene;
        this.timer = timer;
        this.assets = [];
        this.baseMesh = baseMesh;
        this.displayed = false;
        this.rotateSpeed = Math.PI/ 200;
        // this.pivot = new THREE.Group();
        // scene.add( this.pivot );
// 
        // this.pivot.add( this.baseMesh );
        // this.baseMesh.position.set( -this.position.x, -this.position.y, -this.position.z); // the negative of the group's center
        //this.setMeshPosition(this.baseMesh, this.position.x, this.position.y, this.position.z);
    }

    toggleDisplay(displayed) {
        if (!this.displayed && displayed) {
            this.scene.add(this.baseMesh);
            for (var i = 0; i < this.assets.length; i++) {
              this.assets[i].show();
            }
        }
        else if (this.displayed && !displayed){
            this.scene.remove(this.baseMesh);
            for (var i = 0; i < this.assets.length; i++) {
              this.assets[i].hide();
            }
        }
        this.displayed = displayed;
    }

    // easy getter for vertex list
    worldVertices() {
        return this.baseMesh.geometry.vertices;
    }

    // easy getter for face list
    worldFaces() {
        return this.baseMesh.geometry.faces;
    }

    spinIndefinitely(speed) {
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
    }
    // world animation options 
    spin(tStart, tEnd, speed) {
        // Spin the world  
        if (this.timer.elapsedTime >= tStart && this.timer.elapsedTime < tEnd) {
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
        }
    }

    spinAccelerate(tStart, tEnd, speed) {
        if (this.timer.elapsedTime >= tStart && this.timer.elapsedTime < tEnd) {
            this.baseMesh.rotation.y += speed;
            this.baseMesh.updateMatrix();
            this.baseMesh.geometry.applyMatrix( this.baseMesh.matrix );

            for (var i = 0; i < this.assets.length; i++) {
                var asset = this.assets[i];
                asset.setPosition(asset.vertex);
                this.baseMesh.geometry.computeFaceNormals();
                this.baseMesh.geometry.computeVertexNormals();
                asset.alignItemsWithNormal(); 
            }   
        }
    }

    spinDeccelerate(tStart, tEnd, speed) {
        if (this.timer.elapsedTime >= tStart && this.timer.elapsedTime < tEnd) {
            this.baseMesh.rotation.y -= speed;
            this.baseMesh.updateMatrix();
            this.baseMesh.geometry.applyMatrix( this.baseMesh.matrix );

            for (var i = 0; i < this.assets.length; i++) {
                var asset = this.assets[i];
                asset.setPosition(asset.vertex);
                this.baseMesh.geometry.computeFaceNormals();
                this.baseMesh.geometry.computeVertexNormals();
                asset.alignItemsWithNormal(); 
            }   
        }
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
    }

    // update shader times
    updateShaderUniforms() {
        this.baseMesh.material.uniforms;
        if (this.baseMesh.material.uniforms !== undefined) {
            this.baseMesh.material.uniforms.time.value = this.timer.elapsedTime;
        }
        for (var i = 0; i < this.assets.length; i++) {
            this.assets[i].updateShaderUniforms();
        }
    }

    resetTransform(mesh) {
        mesh.updateMatrix();
        mesh.geometry.applyMatrix( mesh.matrix );
        // mesh.position.set( this.position.x, this.position.y, this.position.z );
        // mesh.rotation.set( 0, 0, 0 );
        // mesh.scale.set( 1, 1, 1 );
        // mesh.updateMatrix();
    }

    setMeshPosition(mesh, x, y, z) {
        mesh.position.set(x, y, z);
        this.resetTransform(mesh);
    }

    // update assets
    tick() {
        if (this.displayed) {
            this.spinIndefinitely(this.rotateSpeed);
            this.updateShaderUniforms();     
            // assets tick
            for (var i = 0; i < this.assets.length; i++) {
              this.assets[i].tick();
            } 
        }
    }
}