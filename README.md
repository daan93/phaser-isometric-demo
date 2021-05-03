# Phaser-Isometric-Demo
Isometric game demo for Phaser 3.5

The demo is based on the following tutorial for Phaser 2 and rewritten for the newest version of Phaser. Scene management and depth sorting is now native to Phaser and Webpack is used to support bundling and ES6.

[An Updated Primer for Creating Isometric Worlds, Part 1](https://gamedevelopment.tutsplus.com/tutorials/creating-isometric-worlds-primer-for-game-developers-updated--cms-28392)

## Demo
Open [demo](https://daan93.github.io/phaser-isometric-demo/)

## Todo
- [x] Add pointer interaction
- [x] Add path finding with easystar.js
- [x] Add scrolling
- [x] Make game responsive
- [x] Add ways to interact with other characters
- [x] Add a store to spend coins
- [ ] Look into phasers dynamic tyle sprites (from tiled)
- [ ] ~~Improve isWalkable() by implementing collision physics~~ Don't use 2d for isometric physics, use Enable3d instead.
- [ ] ~~Look into isophyics with height (z-axis) support~~

## CLI

### Watch
Watch file changes and bundle to /dist

### Start
Start Webpack-dev-server and open browser

### Build
Bundle to /dist