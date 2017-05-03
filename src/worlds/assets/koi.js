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
        mesh.rotation.y = Math.PI / 2.0; 
        //var mesh = new THREE.Mesh(assetGeo, new THREE.MeshBasicMaterial( {color: 0xffffff }));
        setAbsolutePosition(mesh, 0, -0.17, 0);
        var koiItem = new Item(mesh);

        // The asset class must have a normal and a vertex assigned before alignment can occur
        // Make sure to call updateRotations from the asset class to update the item rotations
        // koiItem.localPosition = new THREE.Vector3(0, 0, 0);

        this.items.push(koiItem);
    }
    
}

function resetTransform(mesh) {
    mesh.updateMatrix();
    mesh.geometry.applyMatrix( mesh.matrix );
    mesh.position.set( 0, 0, 0 );
    mesh.rotation.set( 0, 0, 0 );
    mesh.scale.set( 1, 1, 1 );
    mesh.updateMatrix();
}

function setAbsolutePosition(mesh, x, y, z) {
    mesh.position.set(x, y, z);
    resetTransform(mesh);
}