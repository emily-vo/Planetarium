const THREE = require('three')
import World from './world'

// this class will mostly be unchanged from world to world. 
// variation in worlds will mostly rely on the various assets.
export default class CameraControls {
	constructor(scene, timer, camera) {
		this.scene = scene;
        this.timer = timer;
        this.camera = camera; 
	}

	simplePanX(timeStart, timeEnd) {
		// pan .. todo, fix it 
		if (this.timer.elapsedTime > timeStart && this.timer.elapsedTime < timeEnd) {
			this.camera.position.set(this.camera.position.x + .1, 1, 20);
			this.camera.lookAt(new THREE.Vector3(this.camera.position.x,this.camera.position.y,this.camera.position.z));
			this.camera.updateProjectionMatrix();
		}
	}

	// zoom into the x direction 
	zoomInZ(timeStart, timeEnd, dist) {
		var totalTime = timeEnd - timeStart; 
		if (this.timer.elapsedTime > timeStart && this.timer.elapsedTime < timeEnd) {
			if (this.camera.position.z > 10 ) {
				this.camera.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z - 0.3);
				this.camera.lookAt(new THREE.Vector3(this.camera.position.x,0,0));
				this.camera.updateProjectionMatrix();
			}
		}
	}


	zoomOutZ(timeStart, timeEnd) {
		// zoom out 
		if (this.timer.elapsedTime > timeStart && this.timer.elapsedTime < timeEnd) {
			if (this.camera.position.z <= 20 ) {
				this.camera.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z + .3);
				// this.camera.lookAt(new THREE.Vector3(this.camera.position.x + .01,0,0));
				this.camera.updateProjectionMatrix();
			}
		}

	}

}