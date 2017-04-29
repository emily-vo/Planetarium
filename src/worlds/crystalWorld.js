const THREE = require('three')
import Asset from './assets/asset'
import World from './world'
import Crystal from './assets/crystal'
// this class will mostly be unchanged from world to world. 
// variation in worlds will mostly rely on the various assets.
export default class CrystalWorld extends World {
    constructor(scene, camera, timer, light, musicAnalyser) {
    	// initialize example uniform variables and store in list
        var shaderUniforms = {
            texture: {
                type: "t", 
                value: THREE.ImageUtils.loadTexture('./textures/iridescent.bmp')
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
            }
        };
    
        // initialize example shader and mesh
        var material = new THREE.ShaderMaterial({
              uniforms: shaderUniforms,
              vertexShader: require('./worldShaders/iridescent-vert.glsl'),
              fragmentShader: require('./worldShaders/iridescent-frag.glsl'), 
              //lights: true
        });
        material.shading = THREE.FlatShading;

        var geometry = new THREE.IcosahedronGeometry(6, 1);
        var baseMesh = new THREE.Mesh(geometry, material);
        
        super(scene, timer, baseMesh);

        this.k = 0;
        this.height = 0;
        this.analyser = musicAnalyser;
        this.camera = camera;
        this.musicData;
        this.spawnAtEveryVertex();
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

        
        var pos = v;
        var up = asset.normal.clone();

        var oldPos = new THREE.Vector3();
        oldPos.addVectors ( pos, up.multiplyScalar(this.height / 120) );
    
        var newPos = new THREE.Vector3();
        newPos.addVectors ( pos, up.multiplyScalar(this.musicData[this.k] / 120) );
        
        this.height = this.musicData[this.k];
    
        var lerped = new THREE.Vector3();
        lerped.lerpVectors(oldPos, newPos, this.timer.getDelta());
    
        if (this.k < this.musicData.length) {
           this.k++; 
        }
    
        asset.position = lerped;
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
      this.spinIndefinitely(Math.PI/200);
      this.updateShaderUniforms();     

      // assets tick
      for (var i = 0; i < this.assets.length; i++) {
        this.assets[i].tick();
      }
    }
}