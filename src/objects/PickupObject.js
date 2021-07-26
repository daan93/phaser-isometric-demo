import Phaser from 'phaser'
import IsoHelper from '../helpers/IsoHelper'

export default class PickupObject extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'pickup');

        this.count = 0;
        this.tile = new Phaser.Geom.Point();
    }

    drawPickupIso(x, y, tileWidth, borderOffset) {
        let isoPt = new Phaser.Geom.Point();//It is not advisable to create point in update loop
        let cartPt = new Phaser.Geom.Point();//This is here for better code readability.
        cartPt.x = x * tileWidth;
        cartPt.y = y * tileWidth;
        isoPt = IsoHelper.cartesianToIsometric(cartPt);

        this.x = isoPt.x + borderOffset.x;
        this.y = isoPt.y + borderOffset.y - (47 / 2) + 8;
        this.depth = this.y + 47 / 2 + 1;
        this.clearTint();
    }

    spawnNewPickup(levelData, sorcerer, tileWidth, borderOffset) {//spawn new pickup at an empty spot
        this.count++;
        let tileType = 0;
        let tempArray = [];
        let newPt = new Phaser.Geom.Point();
        for (let i = 0; i < levelData.length; i++) {
            for (let j = 0; j < levelData[0].length; j++) {
                tileType = levelData[i][j];
                if ((Array(0, 1, 2).includes(tileType)) && sorcerer.heroMapTile.y != i && sorcerer.heroMapTile.x != j) {
                    newPt = new Phaser.Geom.Point();
                    newPt.x = i;
                    newPt.y = j;
                    tempArray.push(newPt);
                }
            }
        }
        newPt = Phaser.Utils.Array.GetRandom(tempArray);
        this.drawPickupIso(newPt.x, newPt.y, tileWidth, borderOffset);
        this.tile = newPt;
    }
}