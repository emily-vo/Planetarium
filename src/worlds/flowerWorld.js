const THREE = require('three')
import Asset from './assets/asset'
import Flower from './assets/flower'
import World from './world'
// this class will mostly be unchanged from world to world. 
// variation in worlds will mostly rely on the various assets.
export default class FlowerWorld extends World {
    constructor(scene, timer, light, position) {
    	// initialize example uniform variables and store in list
        var shaderUniforms = {
            time: { 
                type: "float", 
                value: 0
            },
            color: {
                type: "v4",
                value: new THREE.Vector4( 1., 1., 1., 1. )
            }, 
            image: { // Check the Three.JS documentation for the different allowed types and values
                type: "t", 
                value: THREE.ImageUtils.loadTexture('./textures/grass.jpg')
            },
            light_vec: {
                type: "v3",
                value: new THREE.Vector3(light.position.x, light.position.y, light.position.z)
            },
        };
    
        // initialize example shader and mesh
        var material = new THREE.ShaderMaterial({
              uniforms: shaderUniforms,
              vertexShader: require('./worldShaders/basic-vert.glsl'),
              fragmentShader: require('./worldShaders/basic-frag.glsl'), 
              //lights: true
        });
        material.side = THREE.DoubleSide;
    
        var geometry = new THREE.IcosahedronGeometry(4, 1);
        var baseMesh = new THREE.Mesh(geometry, material);
        super(scene, timer, baseMesh, position);
        this.setMeshPosition(baseMesh, this.position.x, this.position.y, this.position.z);

        for (var i = 0; i < 10; i++) {
        	this.spawnAsset(new Flower(scene, timer, this));
        }
    }

    animateAsset(asset, spinningSpeed) {
        var vertices = this.worldVertices();
        
        var pos = asset.vertex;
        //pos.addVectors(asset.vertex, asset.normal.clone().multiplyScalar(this.normalOffset));

        var up = asset.normal.clone();
        var newPos = new THREE.Vector3();
        //newPos.addVectors ( pos, up.multiplyScalar(this.musicData[this.k] / 70) );
        asset.setScale(this.musicData[this.k] / 200);
        if (this.k < this.musicData.length) {
           this.k++; 
        }
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

      for (var i = 0; i < this.assets.length; i++) {
          var asset = this.assets[i];
          this.animateAsset(asset, speed); 
          this.baseMesh.geometry.computeFaceNormals();
          this.baseMesh.geometry.computeVertexNormals();
          asset.alignItemsWithNormal();
      }  

      this.k = 0;
    }
}