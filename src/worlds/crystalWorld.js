const THREE = require('three')
import Asset from './assets/asset'
import World from './world'
import Crystal from './assets/crystal'
// this class will mostly be unchanged from world to world. 
// variation in worlds will mostly rely on the various assets.
export default class CrystalWorld extends World {
    constructor(scene, camera, timer, light, position) {
    	// initialize example uniform variables and store in list
        var texloader = new THREE.TextureLoader();
        var shaderUniforms = {
            texture: {
                type: "t", 
                value: texloader.load('./textures/iridescent.bmp')
            },
            u_useTexture: {
                type: 'i',
                value: true
            },
            u_albedo: {
                type: 'v3',
                value: new THREE.Color('#dddddd')
            },
            u_ambient: {
                type: 'v3',
                value: new THREE.Color('#111111')
            },
            u_lightPos: {
                type: 'v3',
                value: new THREE.Vector3(30, 50, 40)
            },
            u_lightCol: {
                type: 'v3',
                value: new THREE.Color('#ffffff')
            },
            u_lightIntensity: {
                type: 'f',
                value: 2
            },
            u_camPos: {
                type: 'v3',
                value: camera.position
            }, 
            time: {
                type: 'float',
                value: timer.elapsedTime
            }, 
            alpha: {
                type: 'float', 
                value: 1.0
            }
        };
    
        // initialize example shader and mesh
        var material = new THREE.ShaderMaterial({
              uniforms: shaderUniforms,
              vertexShader: require('./worldShaders/iridescent-vert.glsl'),
              fragmentShader: require('./worldShaders/iridescent-frag.glsl'), 
              //lights: true
        });
        material.side = THREE.DoubleSide;
        material.transparent = true;

        var geometry = new THREE.IcosahedronGeometry(6, 1);
        var baseMesh = new THREE.Mesh(geometry, material);
        

        super(scene, timer, baseMesh, position);
        
        this.camera = camera;
        this.alpha = 0.9;
        this.normalOffset = -1;
        this.spawnAtEveryVertex();
    }

    fadeIn(start, end) {
        if (this.timer.elapsedTime >= start && this.timer.elapsedTime < end) { 
            var t = (this.timer.elapsedTime - start) / (end - start);
            var delta =  1 / (end - start);
            this.baseMesh.material.uniforms.alpha.value += delta * t * t;

            if (this.baseMesh.material.uniforms.alpha.value > 0.9) {
                this.baseMesh.material.uniforms.alpha.value = 0.9;
            }

            for (var i = 0; i < this.assets.length; i++) {
                this.assets[i].material.uniforms.alpha.value = this.baseMesh.material.uniforms.alpha.value;
            }
        }
    }

    fadeOut(start, end) {
        if (this.timer.elapsedTime >= start && this.timer.elapsedTime < end) { 
            var t = (this.timer.elapsedTime - start) / (end - start);
            var delta =  -1 / (end - start);
            this.baseMesh.material.uniforms.alpha.value += delta * t * t;
            if (this.baseMesh.material.uniforms.alpha.value < 0) {
                this.baseMesh.material.uniforms.alpha.value = 0;
            }
            for (var i = 0; i < this.assets.length; i++) {
                this.assets[i].material.uniforms.alpha.value = this.baseMesh.material.uniforms.alpha.value;
            }
        }
    }

    toggleDisplay(displayed) {
        if (!this.displayed && displayed) {
            this.scene.add(this.baseMesh);
            this.baseMesh.material.uniforms.alpha.value = 1.0;
            for (var i = 0; i < this.assets.length; i++) {
              this.assets[i].show();
            }
        }
        else if (this.displayed && !displayed){
            this.baseMesh.material.uniforms.alpha.value = 0.0;
            this.scene.remove(this.baseMesh);
            for (var i = 0; i < this.assets.length; i++) {
              this.assets[i].hide();
            }
        }
        
        this.displayed = displayed;
    }


    spawnAtEveryVertex() {
        var faces = this.worldFaces();
        var vertices = this.worldVertices();
        for (var i = 0; i < faces.length; i++) {
            var face = faces[i]; 
            var v0 = vertices[face.a];
            var v1 = vertices[face.b];
            var v2 = vertices[face.c];

            var x = (v0.x + v1.x + v2.x) / 3;
            var y = (v0.y + v1.y + v2.y) / 3;
            var z = (v0.z + v1.z + v2.z) / 3;

            var v = new THREE.Vector3(x, y, z);

            var asset = new Crystal(this.scene, this.camera, this.timer, this);

            asset.normal = faces[i].vertexNormals[0];
            asset.normal = face.normal;
            asset.vertex = v;
            asset.face = face;
            this.addAsset(asset, v); 


            asset.alignItemsWithNormal(); 
            //asset.up = asset.normal; 
        }
    }

    spawnRing() {

    }

    animateAsset(asset, spinningSpeed) {
        var vertices = this.worldVertices();
        var v0 = vertices[asset.face.a];
        var v1 = vertices[asset.face.b];
        var v2 = vertices[asset.face.c];

        var x = (v0.x + v1.x + v2.x) / 3;
        var y = (v0.y + v1.y + v2.y) / 3;
        var z = (v0.z + v1.z + v2.z) / 3;

        var v = new THREE.Vector3(x, y, z);
        asset.vertex = v;

        
        var pos = new THREE.Vector3();
        pos.addVectors(v, asset.normal.clone().multiplyScalar(this.normalOffset));

        var up = asset.normal.clone();
        var newPos = new THREE.Vector3();
        newPos.addVectors ( pos, up.multiplyScalar(this.musicData[this.k] / 70) );
    
        if (this.k < this.musicData.length) {
           this.k++; 
        }
        asset.position = newPos;
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