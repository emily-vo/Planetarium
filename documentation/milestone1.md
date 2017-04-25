Emily Vo, Milestone 1
---------------------------------------
Framework: Created a base class for the world and its assets. The base class for world is in src/worlds/world.js. It includes a lot of utility functions to create different worlds easily and makes it easy to add assets while keeping them on the same surface point even if the sphere spins. An asset is simply an animated object that can be spawned on the surface of a sphere. I implemented the base class for assets in src/worlds/assets/asset.js. Assets contain a list of items, which are essentially meshes that have local transformations relative to one another. I implemented functions that made it so that it was easy to rotate entire assets and their items in any way desired. In the world class, there is a function that takes advantage of these functions by lining up the assets with the normal at a certain point. I also made functions that made it easy to spawn assets randomly across the sphere. All classes keep track of time so when we animate the assets and want to have certain animations span different durations, we can easily do so within each class. I also added functions that would make the worlds easy to animate by spinning, and the function properly updates the position and rotation of the assets.

Example class: I created a simple extension of the framework I implemented that is a basic sphere with cubes. It is a simple demo that shows that cubes can easily be aligned with the surface normals, while having their own rotation. I did this by simply created a subclass of World in src/worlds/basicWorld.js, and a subclass of Asset in src/worlds/assets/cubes.js.

Flower planet: I procedurally created the flower petals by deforming a mesh with toolbox functions. I then placed them so that they looked like petals of a peruvian lily. This class is a subclass of assets, in src/worlds/assets/flower.js. The planet simply has a texture and spawns these flowers randomly. This planet class is in src/worlds/flowerWorld.js.

See documentation/images for pictures of the different worlds. I consider these pictures of my development progress.


Andrea Lin, Milestone 1
---------------------------------------
Camera Controls: Created a class which controls the main camera and its movement. Implemented simple panning function, zoom in and zoom out. Right now the camera movements are hard coded to move to certain positions, so this week I am going to continue to work on the class so that it can take in a target position and move anywhere (i.e. pan from planet to planet).

Planet Animation: Implemented spinAccelerate() and spinDeccelerate(), which controls the speeding up and slowing down of a planet, and will be used to transition from planet to planet in the final animation. In the onUpdate() function in main, included some choreographed movement of the planets to simulate planet animation. Also adjusted the parameters of the original spin function that Emily created, so that it takes in a start time and end time for greater control.

Water Planet: I procedurally created a terrain for a water planet using fbm to disturb the surface of a sphere. The water is animated in the frag shader based on a global timer in the program. The material is also translucent by altering the alpha channel in the frag shader. Also implemented basic lambertian shading. For next week, I want to continue working on the color of the water, perhaps doing some kind of lerping functions to make the color of the ocean multi-colored/more interesting than just blue. The water can either be rendered low poly/high poly based on the base geometry of the ocean, but I haven't decided yet which one looks the best. For now, I'm just keeping it at high detail.

Asset: created a seaweed asset, which has basic spawning functionality and shader. Will continue to polish this next week! Also working on creating koi fish asset which moves around in the world. One example koi is in the scene.

References are in documentation/andrea-images. They include videos of my progress.


Suzanne Knop, Milestone 1
---------------------------------------
Audio Extraction: I learned how to create basic audio nodes using the Web Audio API, and wrote loading, playing, and setup functions which can be found in src/audio.js.

Audio Analysis: I was able to retrieve basic volume / amplitude data from the audio file using the Web Audio API, but will figure out how to get different kinds of data next week (bpm, pitch, tone). Currently, the audio is analyzed at real time, but ideally I also want to do holistic analysis beforehand 

Public Functions: In src/audio.js, I implemented getSizeFromSound(), which will be used to determine size-related transformations of the planets and their assets. I wrote headers for getColorFromSound() and getRateFromSound(), which will be used to procedurally determine colors and velocities (i.e. for spinning), respectively.
