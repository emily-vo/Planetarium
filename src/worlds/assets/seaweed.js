const THREE = require('three')
import Asset from './asset'
import Item from './item'


// this class will mostly be unchanged from world to world. 
// variation in worlds will mostly rely on the various assets.
export default class Seaweed extends Asset {
    constructor(scene, timer, world) {
        super(scene, timer, world);

        // add basic cube mesh item as example asset
        this.shaderUniforms = {
            time: { 
                type: "float", 
                value: 0
            },
            color: {
                type: "v4",
                value: new THREE.Vector4( 1., 0., 0., 1. )
            }
        };

        var material = new THREE.ShaderMaterial({
              uniforms: this.shaderUniforms,
              vertexShader: require('./assetShaders/seaweed-vert.glsl'),
              fragmentShader: require('./assetShaders/seaweed-frag.glsl')
        });

        // trying to import koi 
        var koiMesh; 
        var objLoader = new THREE.OBJLoader();
        objLoader.load('koi.obj', function(obj) {
            var koi = obj.children[0].geometry;
            koiMesh = new THREE.Mesh(koi, material);
            koiMesh.position.set(0,5,0); 
            // test: visualizing the koi fish 
            scene.add(koiMesh);
        });

        // for now, just visualize box 
        var geometry = new THREE.BoxGeometry(0.1, 2, 0.1);
        var mesh = new THREE.Mesh(geometry, material);

        // var mesh = new THREE.Mesh(koiMesh, material);

        var weed = new Item(mesh);

        // The asset class must have a normal and a vertex assigned before alignment can occur
        // Make sure to call updateRotations from the asset class to update the item rotations
        weed.localRotation = new THREE.Vector3(0, 0, 0);

        this.items.push(weed);
    }
}