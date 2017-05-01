const THREE = require('three')
import World from './world'

// this class will mostly be unchanged from world to world. 
// variation in worlds will mostly rely on the various assets.
export default class CameraControls {
	constructor(scene, timer, camera) {
		this.scene = scene;
        this.timer = timer;
        this.camera = camera; 
        this.focusPoints = []; 
	}

	simplePanX(timeStart, timeEnd) {
		// pan .. todo, fix it 
		var targetX = focusPoints[planetIndex].x; 
		var targetY = focusPoints[planetIndex].y; 
		var targetZ = focusPoints[planetIndex].z; 

		if (this.timer.elapsedTime > timeStart && this.timer.elapsedTime < timeEnd) {
			this.camera.position.set(this.camera.position.x + .1, 1, 20);
			this.camera.lookAt(new THREE.Vector3(targetX,targetY,targetZ));
			this.camera.updateProjectionMatrix();
		}
	}

	// zoom into the x direction 
	zoomInZ(timeStart, timeEnd, target) {
		var totalTime = timeEnd - timeStart; 
		if (this.timer.elapsedTime > timeStart && this.timer.elapsedTime < timeEnd) {
			if (this.camera.position.z > target ) {
				this.camera.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z - 0.3);
				this.camera.lookAt(new THREE.Vector3(this.camera.position.x, this.camera.position.y, this.camera.position.z - 20));
				this.camera.updateProjectionMatrix();
			}
		}
	}

	zoom(timeStart, timeEnd, originalPos, target) {
		// zoom out 
		if (this.timer.elapsedTime > timeStart && this.timer.elapsedTime < timeEnd) {
			this.timer.getDelta();
			var t = (this.timer.elapsedTime - timeStart) / (timeEnd - timeStart);
			var delta = t * target + (1 - t) * originalPos;
			this.camera.position.set(this.camera.position.x, this.camera.position.y, delta);
			this.camera.lookAt(new THREE.Vector3(this.camera.position.x, this.camera.position.y, this.camera.position.z - 20));
			this.camera.updateProjectionMatrix();
			return true;
		}
		return false;
	}

	zoomOutZ(timeStart, timeEnd, originalPos, target) {
		// zoom out 
		if (this.timer.elapsedTime > timeStart && this.timer.elapsedTime < timeEnd) {
			if (this.camera.position.z <= target ) {
				this.timer.getDelta();
				var t = (this.timer.elapsedTime - timeStart) / (timeEnd - timeStart);
				var delta = t * target + (1 - t) * originalPos;
				this.camera.position.set(this.camera.position.x, this.camera.position.y, delta);
				this.camera.lookAt(new THREE.Vector3(this.camera.position.x, this.camera.position.y, this.camera.position.z - 20));
				this.camera.updateProjectionMatrix();
			}
		}

	}

}