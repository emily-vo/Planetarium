const THREE = require('three')
import Asset from './assets/asset'
import Seaweed from './assets/seaweed'
import Koi from './assets/koi'
import World from './world'

var seaweeds = [];
var kois = [];   

// this class will mostly be unchanged from world to world. 
// variation in worlds will mostly rely on the various assets.
export default class WaterWorld extends World {
    constructor(scene, timer, light, koiGeo, position) {

        // initialize example uniform variables and store in list
        var shaderUniforms = {
            u_time: { 
                type: "float", 
                value: timer.elapsedTime
            },
            color: {
                type: "v4",
                value: new THREE.Vector4( 1., 1., 1., 1. )
            },
            light_vec: {
                type: "v3",
                value: new THREE.Vector3(light.position.x, light.position.y, light.position.z)
            },
        };

        // noise-water material
        var material = new THREE.ShaderMaterial({
              uniforms: shaderUniforms,
              vertexShader: require('./worldShaders/water-vert.glsl'),
              fragmentShader: require('./worldShaders/water-frag.glsl')
        });
        // enable transparency of the material 
        material.transparent = true;

        // basic lambert material 
        var basicMaterial = new THREE.ShaderMaterial({
              uniforms: shaderUniforms,
              vertexShader: require('./worldShaders/basic-vert.glsl'),
              fragmentShader: require('./worldShaders/water-base-frag.glsl')
        });
        // enable transparency of the material 
        material.transparent = true;
        material.side = THREE.DoubleSide;
        // make a "base sphere"
        // add this somewhere to the class? not sure 
        var baseSphereGeom = new THREE.IcosahedronGeometry(6,4);  // new THREE.BoxGeometry(6,6,6); consider making a box
        var geometry = new THREE.IcosahedronGeometry(6, 2); // adjust second parameter: low poly (2) or high poly!!! (>3)
        baseSphereGeom.translate( position.x, position.y, position.z );
        geometry.translate( position.x, position.y, position.z );
        var baseMesh = new THREE.Mesh(geometry, material);

        super(scene, timer, baseMesh, position);
        this.innerSphere = new THREE.Mesh(baseSphereGeom, basicMaterial); 
        this.light = light; 
        
        //this.setMeshPosition(baseMesh, this.position.x, this.position.y, this.position.z);
        // this.setMeshPosition(this.innerSphere, this.position.x, this.position.y, this.position.z);
        
        // create seaweed assets!
        for (var i = 0; i < 25; i++) {
            var seaweed = new Seaweed(scene, timer, this);
            this.spawnAsset(seaweed);
            seaweeds.push(seaweed); 
        }

        // create koi assets
        for (var i = 0; i < 10; i++) {
            var koi = new Koi(scene, timer, this, koiGeo);
            // koi.setAbsolutePosition(0,-.5,0); 
            kois.push(koi); 
            this.spawnAsset(koi);
        } 
    }

    // remove the random base sphere from scene lol sad
    removeInnerSphere(time) {
        if (this.timer.elapsedTime >= time) {
            this.scene.remove(this.innerSphere);
        }
    }

    toggleDisplay(displayed) {
        if (!this.displayed && displayed) {
            this.scene.add(this.baseMesh);
            for (var i = 0; i < this.assets.length; i++) {
              this.assets[i].show();
            }
            this.scene.add(this.innerSphere);
        }
        else if (this.displayed && !displayed){
            this.scene.remove(this.baseMesh);
            for (var i = 0; i < this.assets.length; i++) {
              this.assets[i].hide();
            }
            this.scene.remove(this.innerSphere);
        }
        this.displayed = displayed;
    }

    // to update the uniform in the frag shader, enables animation
    updateWaterTime() {
        this.baseMesh.material.uniforms.u_time.value = this.timer.elapsedTime;
        for (var i = 0; i < seaweeds.length; i++) {
            seaweeds[i].material.uniforms.u_time.value = this.timer.elapsedTime; 
        }
        for (var i = 0; i < kois.length; i++) {
            kois[i].material.uniforms.u_time.value = this.timer.elapsedTime; 
        }
    }

    // CALL TO ANIMATE ASSETS HERERERERERERER /////////
    animateAsset(asset, spinningSpeed) {
        var vertices = this.worldVertices();
        
        var pos = asset.vertex;
        //pos.addVectors(asset.vertex, asset.normal.clone().multiplyScalar(this.normalOffset));

        var up = asset.normal.clone();
        var newPos = new THREE.Vector3();
        //newPos.addVectors ( pos, up.multiplyScalar(this.musicData[this.k] / 70) );
        asset.setScale(this.musicData[this.k] / 100);
        if (this.k < this.musicData.length) {
           this.k++; 
        }
        asset.position = pos;
        asset.updatePositions();
    }

    animateAssetNoMusic(asset, spinningSpeed) {
        var vertices = this.worldVertices();
        
        var pos = asset.vertex;
        //pos.addVectors(asset.vertex, asset.normal.clone().multiplyScalar(this.normalOffset));

        var up = asset.normal.clone();
        var newPos = new THREE.Vector3();
        //newPos.addVectors ( pos, up.multiplyScalar(this.musicData[this.k] / 70) );
        // asset.setScale(this.musicData[this.k] / 100);
        // if (this.k < this.musicData.length) {
           // this.k++; 
        // }
        asset.position = pos;
        asset.updatePositions();
    }

    spinIndefinitely(speed) {
      this.baseMesh.rotation.y = speed;
      this.baseMesh.updateMatrix();
      this.baseMesh.geometry.applyMatrix( this.baseMesh.matrix );
      var bufferLength = this.analyser.frequencyBinCount;
      this.musicData = new Uint8Array(bufferLength);
      this.analyser.getByteFrequencyData(this.musicData);

      for (var i = 0; i < 35; i++) {
          var asset = this.assets[i];
          if (i < 25) {
            this.animateAsset(asset, speed); 
          } else {
            this.animateAssetNoMusic(asset, speed); 
          }
          this.baseMesh.geometry.computeFaceNormals();
          this.baseMesh.geometry.computeVertexNormals();
          asset.alignItemsWithNormal();
      }  

      this.k = 0;
    }

    tick() {
        if (this.displayed) {
            this.spinIndefinitely(this.rotateSpeed);
            this.updateWaterTime();
        }  
    }
}