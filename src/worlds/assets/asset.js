const THREE = require('three')
import Item from './item'

// this class will be overridden very frequently for the various assets.
export default class Asset {
    constructor(scene, timer, world) {
        // name for debugging purposes
        this.name = "";
        this.scene = scene;
        this.timer = timer;
        this.items = [];
        this.world = world;
        this.up = new THREE.Vector3(0, 1, 0);

        // local position relative to its place on some world's vertex
        this.rotation = new THREE.Vector3(0, 0, 0);
        this.position = new THREE.Vector3(0, 1, 0);
        this.scale = new THREE.Vector3(1, 1, 1);

        // stores vertex for access
        this.vertex;
        this.normal;

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
              vertexShader: require('./assetShaders/basic-vert.glsl'),
              fragmentShader: require('./assetShaders/basic-frag.glsl')
        });

        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var mesh = new THREE.Mesh(geometry, material);

        var exObject = new Item(mesh);
        this.items.push(exObject);
    }

    // adds all item meshes
    addToScene() {
      for (var i = 0; i < this.items.length; i++) {
        this.scene.add(this.items[i].mesh);
        // console.log("...adding to scene");
      }
    }

    // sets the overall asset position and moves the items accordingly
    setPosition(position) {
      this.position = position;
      this.updatePositions();
    }

    // allows the individual meshes to have their own offsets, updates them
    updatePositions() {
      for (var i = 0; i < this.items.length; i++) {
        this.items[i].setWorldPosition(this.position);
      }
    }

    // sets the overall asset position and moves the items accordingly
    setScale(scale) {
      this.scale = scale;
      this.updateScales();
    }

    // allows the individual meshes to have their own offsets, updates them
    updateScales() {
      for (var i = 0; i < this.items.length; i++) {
        this.items[i].setWorldScale(this.scale);
      }
    }

    // sets the overall asset position and moves the items accordingly
    setRotation(rotation) {
      this.rotation = rotation;
      this.updateRotations();
    }

    // allows the individual meshes to have their own offsets, updates them
    updateRotations() {
      for (var i = 0; i < this.items.length; i++) {
        this.items[i].setWorldRotation(this.rotation);
      }
    }

    // aligns items with the normals
    alignItemsWithNormal() {
      for (var i = 0; i < this.items.length; i++) {
        this.items[i].align(this.normal, this.up);
      }
      this.up = this.normal;
    }

    // updates the time for the shaders for the item meshes
    updateShaderUniforms() {
        var delta = this.timer.getDelta();
        for (var i = 0; i < this.items.length; i++) {
          var shader = this.items[i].mesh.material;
          if (shader.uniforms.time !== undefined) {
              shader.uniforms.time.value += delta;
          }
        }
    }

    // can override / update this function for each asset
    tick() {
        this.updateShaderUniforms();
    }
}