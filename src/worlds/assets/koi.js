const THREE = require('three')
import Asset from './asset'
import Item from './item'

// this class will mostly be unchanged from world to world. 
// variation in worlds will mostly rely on the various assets.
export default class Koi extends Asset {
    constructor(scene, timer, world, assetGeo) {
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
                value: new THREE.Vector3(this.world.light.position.x, this.world.light.position.y, this.world.light.position.z)
            },
        };

        this.material = new THREE.ShaderMaterial({
            uniforms: this.shaderUniforms,
            vertexShader: require('./assetShaders/koi-vert.glsl'),
            fragmentShader: require('./assetShaders/koi-frag.glsl')
        });


        var mesh = new THREE.Mesh(assetGeo, this.material);

        var koiItem = new Item(mesh);

        // The asset class must have a normal and a vertex assigned before alignment can occur
        // Make sure to call updateRotations from the asset class to update the item rotations
        // koiItem.localRotation = new THREE.Vector3(90, 45, 0);

        this.items.push(koiItem);
    }
}