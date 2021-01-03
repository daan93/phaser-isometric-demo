import Phaser from 'phaser'

import assetGreenTile from '../assets/green_tile.png?dl=0';
import assetRedTile from '../assets/red_tile.png?dl=0';
import assetHeroTile from '../assets/hero_tile.png?dl=0';
import assetBallShadow from '../assets/ball_shadow.png?dl=0';
import assetFloor from '../assets/floor.png?dl=0';
import assetWall from '../assets/block.png?dl=0';
import assetPickup from '../assets/pickup.png?dl=0';
import assetDoor from '../assets/door.png?dl=0';
import assetHero from '../assets/hero_8_4_41_62.png?dl=0';
import assetHeroJson from '../assets/hero_8_4_41_62.json?dl=0';

export default class PreloadScene extends Phaser.Scene {
    preload() {
        let that = this;

        this.load.on("complete", () => {
            that.scene.start("level-1-scene")
        });

        this.load.image('greenTile', assetGreenTile);
        this.load.image('redTile', assetRedTile);
        this.load.image('heroTile', assetHeroTile);
        this.load.image('heroShadow', assetBallShadow);
        this.load.image('floor', assetFloor);
        this.load.image('wall', assetWall);
        this.load.image('pickup', assetPickup);
        this.load.image('door', assetDoor);
        this.load.atlas('hero', assetHero, assetHeroJson);
    }
}