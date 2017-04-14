const THREE = require('three')
export default class Item {
	constructor(mesh) {
		this.name = "";
		this.mesh = mesh;
		this.localScale = new THREE.Vector3(1, 1, 1);
		this.localPosition = new THREE.Vector3(0, 0, 0);
		this.localRotation = new THREE.Vector3(0, 0, 0);
	}

	// update the mesh's main position to be that of the assets and adds local displacement
	setWorldPosition(position) {
		this.mesh.position.x = position.x + this.localPosition.x;
		this.mesh.position.y = position.y + this.localPosition.y;
		this.mesh.position.z = position.z + this.localPosition.z;
	}

	// update the mesh's main rotation to be that of the assets and adds local rotation
	setWorldRotation(rotation) {
		// var ax = axis.clone();
		// ax.applyEuler(this.localRotation);
		// this.mesh.rotation.x = rotation.x + this.localRotation.x;
		// this.mesh.rotation.y = rotation.y + this.localRotation.y;
		// this.mesh.rotation.z = rotation.z + this.localRotation.z;
	}

	align(vector, axis) {
		// rotate axis to reflect local rotation
		var ax = axis.clone();
		ax.applyEuler(this.localRotation);
		this.mesh.quaternion.setFromUnitVectors(ax, vector.clone().normalize());
		// console.log("aligning...");
	}

	// update the mesh's main scale to be that of the assets and adds local scale
	setWorldScale(scale) {
		this.mesh.scale.x = scale.x * this.localScale.x;
		this.mesh.scale.y = scale.y * this.localScale.y;
		this.mesh.scale.z = scale.z * this.localScale.z;
	}
}