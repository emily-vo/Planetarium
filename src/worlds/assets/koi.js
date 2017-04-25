const THREE = require('three')
import Asset from './asset'
import Item from './item'
const OBJLoader = require('jser-three-obj-loader')(THREE)

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

        this.material = new THREE.ShaderMaterial({
            uniforms: this.shaderUniforms,
            vertexShader: require('./assetShaders/koi-vert.glsl'),
            fragmentShader: require('./assetShaders/koi-frag.glsl')
        });

        // load koi obj 
        var koiGeo; 
        // var objLoader = new THREE.OBJLoader();
        // objLoader.load('house.obj', function(obj) {
        //     var koiGeo = obj.children[0].geometry;
        // });

        koiGeo = new THREE.BoxGeometry(0.5, 0.5, 1.0);

        var mesh = new THREE.Mesh(koiGeo, this.material);
        // mesh.position.set(10, 30, 0); 
        // mesh.scale.set(10,10,100); 

        var koiItem = new Item(mesh);

        // The asset class must have a normal and a vertex assigned before alignment can occur
        // Make sure to call updateRotations from the asset class to update the item rotations
        // koiItem.localRotation = new THREE.Vector3(90, 45, 0);

        this.items.push(koiItem);
    }
}