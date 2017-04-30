Emily Vo, Milestone 2
---------------------------------------
I created a new crystal planet by procedurally creating the crystals. I extruded shapes. I gave both the planet and crystals an iridescent shader. I also fixed Andrea's mesh loading issue that has been plaguing us for two weeks. It took me 4 hours, but I realized that new npm installs have a broken obj loader. I cleaned out the junk node modules and replaced it with older ones from previous projects.

Photos of my crystal generation is in images.

Andrea Lin, Milestone 2
---------------------------------------
WaterWorld Assets: Continued working on assets for the WaterWorld. Created seaweed asset using toolbox function, and made a vertex shader which displaces the vertices based on a cosine function, giving it the appearance of waving in the water's currents. Also began on a koi asset, which will swim around through the water world. It is currently a box mesh that has simple movement functionality. (video is at andrea-demos/m2-seaweed.movx)

WaterWorld Planet: I continued to fine tune the visualization of the water above the base of the water planet. It now animated by the frag shader. I also added a color change for the base planet based on time interpolation of a color palatte using a funciton from IQ http://www.iquilezles.org/www/articles/palettes/palettes.html) (video is at andrea-demos/m2-colors.mov)

Animation: I worked on the order and transitions for the final animation. I added functions to the framework code which allow greater control over what is rendered and not rendered to the scene (based on time). Using the spin, accelerate, deccelerate, recreatePlanet and deletePlanet functions, I created a rough template of what our final animation is going to look like in a new function called basicChoreography(). It iterates through each planets, with the transitions being an acceleration spin into the new planet, which then deccelerates into the scene. Going to work on continuing to make the transitions smoother, perhaps add more interesting time-based animations that can go along with the current spinning (i.e. bouncing/growing/shrinking assets and world). (video is at andrea-demos/m2-animation-flow.mov)

Suzanne Knop, Milestone 2
---------------------------------------
I spent the bulk of my time understanding and implementing a pitch detection algorithm to get the fundamental frequency of the music as it plays in real-time. Most of the algorithm is done in `findFundamentalFreq()` in `src/pitchHelper.js`, and called by `detectPitch()` in `src/audio.js`. I use this function to get a color in `getColorFromSound()` by converting the frequency into 3-digit hex, creating a color from the hex code, and linearly blending the new color with the old color passed in. I added this blending so that the transitions between colors would be smoother, and not give the viewer a seizure.

I also added gui elements for muting and choosing a song!
