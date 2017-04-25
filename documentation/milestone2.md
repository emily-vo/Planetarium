Emily Vo, Milestone 2
---------------------------------------


Andrea Lin, Milestone 2
---------------------------------------
WaterWorld Assets: Continued working on assets for the WaterWorld. Created seaweed asset using toolbox function, and made a vertex shader which displaces the vertices based on a cosine function, giving it the appearance of waving in the water's currents. Also began on a koi asset, which will swim around through the water world. It is currently a box mesh that has simple movement functionality. 

WaterWorld Planet: I continued to fine tune the visualization of the water above the base of the water planet. It now animated by the frag shader. I also added a color change for the base planet based on time interpolation of a color palatte using a funciton from IQ http://www.iquilezles.org/www/articles/palettes/palettes.html)

Animation: I worked on the order and transitions for the final animation. I added functions to the framework code which allow greater control over what is rendered and not rendered to the scene (based on time). Using the spin, accelerate, deccelerate, recreatePlanet and deletePlanet functions, I created a rough template of what our final animation is going to look like in a new function called basicChoreography(). It iterates through each planets, with the transitions being an acceleration spin into the new planet, which then deccelerates into the scene. Going to work on continuing to make the transitions smoother, perhaps add more interesting time-based animations that can go along with the current spinning (i.e. bouncing/growing/shrinking assets and world).   

Suzanne Knop, Milestone 2
---------------------------------------
