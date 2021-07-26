import Phaser from 'phaser'

import assetPickup from '../assets/pickup.png?dl=0';
import assetHero from '../assets/hero_8_4_41_62.png?dl=0';
import assetHeroJson from '../assets/hero_8_4_41_62.json?dl=0';
import tiles from '../assets/tileset2.png';
import map from '../assets/map.json';
import map2 from '../assets/map2.json';

export default class PreloadScene extends Phaser.Scene {
    preload() {
        let that = this;

        this.load.on("complete", () => {
            this.scene.launch('UI-scene');
            this.scene.bringToTop('UI-scene');
            that.scene.start("level-1-scene")
        });

        this.load.image('pickup', assetPickup);
        this.load.atlas('hero', assetHero, assetHeroJson);
        this.load.spritesheet('tiles', tiles, { frameWidth: 128, frameHeight: 192 });
        this.load.json('map', map);
        this.load.json('map2', map2);
    }
}