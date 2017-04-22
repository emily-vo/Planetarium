const THREE = require('three')
import Asset from './asset'
import Item from './item'

// this class will mostly be unchanged from world to world. 
// variation in worlds will mostly rely on the various assets.
export default class Koi extends Asset {
    constructor(scene, timer, world) {
        super(scene, timer, world);

        // add basic cube mesh item as example asset
        this.shaderUniforms = {
            time: { 
                type: "float", 
                value: 0
            },
            u_time: { 
                type: "float", 
                value: timer.elapsedTime
            },
            light_vec: {
                type: "v3",
                value: new THREE.Vector3(world.light.position.x, world.light.position.y, world.light.position.z)
            },
        };

        var material = new THREE.ShaderMaterial({
            uniforms: this.shaderUniforms,
            vertexShader: require('./assetShaders/basic-vert.glsl'),
            fragmentShader: require('./assetShaders/koi-frag.glsl')
        });

        // load koi obj 
        // var koiGeo; 
        // var objLoader = new THREE.OBJLoader();
        // objLoader.load('textures/koi.obj', function(obj) {
        //     var koiGeo = obj.children[0].geometry;
        // });

        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var mesh = new THREE.Mesh(koiGeo, material);

        var koiItem = new Item(mesh);

        // The asset class must have a normal and a vertex assigned before alignment can occur
        // Make sure to call updateRotations from the asset class to update the item rotations
        koiItem.localRotation = new THREE.Vector3(45, 45, 0);

        this.items.push(koiItem);
    }
}