import Phaser from 'phaser';

import assetFloor from '../assets/floor.png?dl=0';
import assetWall from '../assets/block.png?dl=0';
import assetHero from '../assets/hero_8_4_41_62.png?dl=0';
import assetHeroJson from '../assets/hero_8_4_41_62.json?dl=0';

const floorHeight = 53;
const wallHeight = 98
const heroHeight = 62;

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('alignment-scene')
    }

    preload() {
        this.load.image('floor', assetFloor);
        this.load.image('wall', assetWall);
        this.load.atlas('hero', assetHero, assetHeroJson);
    }

    create() {
        this.cameras.main.setBackgroundColor('#cccccc');

        const hero = this.add.sprite(300, 200 - (heroHeight / 2) + 8, 'hero');
        const floor = this.add.image(300, 200, 'floor');
        const wall = this.add.image(300, 200 - (wallHeight - floorHeight) / 2, 'wall');

        floor.y += 50;
        hero.y += 50;

        wall.depth = wall.y + wallHeight / 2;
        floor.depth = floor.y - floorHeight / 2;
        hero.depth = hero.y + heroHeight / 2 + 1;

        const graphics = this.add.graphics();
        graphics.depth = 9999;
        graphics.fillStyle(0xff0000);

        // graphics.fillCircle(floor.x, floor.y, 3);
        // graphics.fillStyle(0x00ff00);
        // graphics.fillCircle(wall.x, wall.y, 3);
        // graphics.fillStyle(0x0000ff);
        // graphics.fillCircle(hero.x, hero.y, 3);
        
        graphics.fillStyle(0xff0000);
        graphics.fillCircle(floor.x, floor.depth, 3);
        graphics.fillStyle(0x00ff00);
        graphics.fillCircle(wall.x, wall.depth, 3);
        graphics.fillStyle(0x0000ff);
        graphics.fillCircle(hero.x, hero.depth, 3);

        console.log(floor.depth);
        console.log(wall.depth);
        console.log(hero.depth);
    }
}