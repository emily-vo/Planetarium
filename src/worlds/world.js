const THREE = require('three')
import Asset from './assets/asset'

// this class will mostly be unchanged from world to world. 
// variation in worlds will mostly rely on the various assets.
export default class World {
    constructor(scene, timer, baseMesh) {
        this.scene = scene;
        this.timer = timer;
        this.assets = [];
        this.rotation = new THREE.Vector3(0, 0, 0);
        this.position = new THREE.Vector3(0, 0, 0);
        
        // test spawning assets
        for (var i = 0; i < 10; i++) {
            // initialize example uniform variables and store in list
            this.shaderUniforms = {
                time: { 
                    type: "float", 
                    value: 0
                },
                color: {
                    type: "v4",
                    value: new THREE.Vector4( 1., 1., 1., 1. )
                }
            };
    
            // initialize example shader and mesh
            var material = new THREE.ShaderMaterial({
                  uniforms: this.shaderUniforms,
                  vertexShader: require('./worldShaders/basic-vert.glsl'),
                  fragmentShader: require('./worldShaders/basic-frag.glsl')
            });
    
            var geometry = new THREE.IcosahedronGeometry(6, 3);
            this.baseMesh = new THREE.Mesh(geometry, material);
    
            // create an example asset
            var exAsset = new Asset(scene, timer, this);
    
            this.spawnAsset(exAsset);
        }

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
        asset.normal = faces[faceIdx].vertexNormals[vIdx];

        // align asset with normal
        this.alignAsset(asset);       
    }

    // adds assets to global list and adds their geometry to the scene
    addAsset(asset, position) {
        this.assets.push(asset);
        asset.setPosition(position);
        asset.addToScene();
    }

    alignAsset(asset) {
        asset.alignItemsWithNormal();
    }

    // update shader times
    updateShaderUniforms() {
        this.baseMesh.material.uniforms;
        for (var i = 0; i < this.assets.length; i++) {
            this.assets[i].updateShaderUniforms();
        }
    }

    // update assets
    tick() {
        this.updateShaderUniforms();

        // assets tick
        for (var i = 0; i < this.assets.length; i++) {
          this.assets[i].tick();
        }
    }
}