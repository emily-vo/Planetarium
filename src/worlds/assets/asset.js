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
      this.rotation = new THREE.Vector3(0, 0, 0);
      this.position = new THREE.Vector3(0, 1, 0);
      this.scale = new THREE.Vector3(1, 1, 1);
      this.up = new THREE.Vector3(0, 1, 0);
      this.up.applyEuler(new THREE.Euler(this.rotation.x, 
        this.rotation.y, this.rotation.z, 'XYZ'));
      
      // stores vertex and normal for access
      this.vertex;
      this.normal;

      this.faceIdx;
      this.vIdx;
    }

    // adds all item meshes
    addToScene() {
      for (var i = 0; i < this.items.length; i++) {
        this.scene.add(this.items[i].mesh);
      }
    }

    // remove all meshes (in an optional timed interval)
    deleteFromScene() {
      for (var i = 0; i < this.items.length; i++) {
        this.scene.remove(this.items[i].mesh);
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

    // sets the overall asset rotation
    setRotation(rotation) {
      this.rotation = rotation;
      var x = this.localRotation.x * (Math.PI / 180);
      var y = this.localRotation.y * (Math.PI / 180);
      var z = this.localRotation.z * (Math.PI / 180);
      this.up.applyEuler(new THREE.Vector3(x, y, z));
      this.updateRotations();
    }

    // allows the individual meshes to have their own offsets, updates them
    updateRotations() {
      for (var i = 0; i < this.items.length; i++) {
        this.items[i].align(this.up, this.normal);
      }
    }

    // aligns items with the normals
    alignItemsWithNormal() {
      this.updateRotations();
      //this.up = this.normal;
    }

    // updates the time for the shaders for the item meshes
    updateShaderUniforms() {
      var delta = this.timer.getDelta();
      for (var i = 0; i < this.items.length; i++) {
        var shader = this.items[i].mesh.material;
        if (shader.uniforms !== undefined) {
          if (shader.uniforms.time !== undefined) {
            shader.uniforms.time.value += delta;
          }
        }
      }
    }

    // can override / update this function for each asset
    tick() {
      this.updateShaderUniforms();
    }
}