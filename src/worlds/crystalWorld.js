const THREE = require('three')
import Asset from './assets/asset'
import World from './world'
import Crystal from './assets/crystal'
// this class will mostly be unchanged from world to world. 
// variation in worlds will mostly rely on the various assets.
export default class CrystalWorld extends World {
    constructor(scene, camera, timer, light) {
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
        this.timer.start();
        this.camera = camera;
        console.log(this.timer);

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

            this.addAsset(asset, v); 

            asset.alignItemsWithNormal();  
        }
    }
}