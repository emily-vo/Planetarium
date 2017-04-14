const THREE = require('three')
export default class Item {
	constructor(mesh) {
		this.name = "";
		this.mesh = mesh;
		this.localScale = new THREE.Vector3(1, 1, 1);
		this.localPosition = new THREE.Vector3(0, 0, 0);
		
		// this is in degrees
		this.localRotation = new THREE.Vector3(0, 0, 0);
	}

	// update the mesh's main position to be that of the assets and adds local displacement
	setWorldPosition(position) {
		this.mesh.position.x = position.x + this.localPosition.x;
		this.mesh.position.y = position.y + this.localPosition.y;
		this.mesh.position.z = position.z + this.localPosition.z;
	}

	// aligns the mesh with the vector specified (usually with the normal)
	// will have to call align every time local rotation is changed, does the actual rotation
	align(axis, vector) {
		var v = vector.clone();
	    var x = this.localRotation.x * (Math.PI / 180);
	    var y = this.localRotation.y * (Math.PI / 180);
	    var z = this.localRotation.z * (Math.PI / 180);
	    v.applyEuler(new THREE.Euler( x, y, z, 'XYZ'));
		this.mesh.quaternion.setFromUnitVectors(axis, v.clone().normalize());
	}

	// update the mesh's main scale to be that of the assets and adds local scale
	setWorldScale(scale) {
		this.mesh.scale.x = scale.x * this.localScale.x;
		this.mesh.scale.y = scale.y * this.localScale.y;
		this.mesh.scale.z = scale.z * this.localScale.z;
	}
}