const THREE = require('three')

export default class GalaxyBackground {
    constructor(scene, timer, light) {
        this.scene = scene;
        this.timer = timer;
        this.light = light; 
        this.planets = []; 

        // initialize example uniform variables and store in list
        var shaderUniforms = {
            u_time: { 
                type: "float", 
                value: timer.elapsedTime
            },
            color: {
                type: "v4",
                value: new THREE.Vector4( 1., 1., 1., 1. )
            },
            light_vec: {
                type: "v3",
                value: new THREE.Vector3(light.position.x, light.position.y, light.position.z)
            },
            start_pos: {
            	type: "v3",
            	value: new THREE.Vector3(0,0,0)
            }
        };

        this.material = new THREE.ShaderMaterial({
            uniforms: shaderUniforms,
            vertexShader: require('./worldShaders/galaxy-vert.glsl'),
            fragmentShader: require('./worldShaders/galaxy-frag.glsl')
        });
        this.material.transparent = true;

    }

    initializeBackground() {
	  var points = new THREE.Geometry();

		for ( var i = 0; i < 10000; i ++ ) {
			var p = new THREE.Vector3();
			p.x = THREE.Math.randFloatSpread( 2000 );
			p.y = THREE.Math.randFloatSpread( 2000 );
			p.z = THREE.Math.randFloatSpread( 2000 );
			points.vertices.push( p )
			points.lights = true;
		}

	var whiteCol = new THREE.PointsMaterial( { color: 0xffffff } )

	var starField = new THREE.Points( points, whiteCol );

	this.scene.add( starField );

	this.renderRando(0);
    }

    renderRando(time) {
    	if (this.timer.elapsedTime >= time) {
	    	for (var i = -10; i < 20; i += 10) {
	    	 	if (i != 0) {
				  var geometry = new THREE.SphereBufferGeometry( 0.8, 32, 32 );
				  var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
				  var sphere = new THREE.Mesh( geometry, this.material );
				  sphere.position.set(0,i,0); 
				  this.scene.add( sphere );
				  this.planets.push(sphere);
	    	 	}
	    	}
    	}
    }


    tick() {
    	for (var i = 0; i < this.planets.length; i++) {
    		this.planets[i].material.uniforms.u_time.value = this.timer.elapsedTime;
    	}
    }
}
