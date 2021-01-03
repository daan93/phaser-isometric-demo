import Phaser from 'phaser'
import IsoHelper from './IsoHelper'

export default class PickupObject extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'pickup');
    }

    drawPickupIso(i, j, tileWidth, borderOffset) {
        let isoPt = new Phaser.Geom.Point();//It is not advisable to create point in update loop
        let cartPt = new Phaser.Geom.Point();//This is here for better code readability.
        cartPt.x = j * tileWidth;
        cartPt.y = i * tileWidth;
        isoPt = IsoHelper.cartesianToIsometric(cartPt);

        this.x = isoPt.x + borderOffset.x;
        this.y = isoPt.y + borderOffset.y - (47 / 2) + 8;
        this.depth = this.y + 47 / 2 + 1;
    }

    spawnNewPickup(levelData, sorcerer, tileWidth, borderOffset) {//spawn new pickup at an empty spot
        let tileType = 0;
        let tempArray = [];
        let newPt = new Phaser.Geom.Point();
        for (let i = 0; i < levelData.length; i++) {
            for (let j = 0; j < levelData[0].length; j++) {
                tileType = levelData[i][j];
                if (tileType == 0 && sorcerer.heroMapTile.y != i && sorcerer.heroMapTile.x != j) {
                    newPt = new Phaser.Geom.Point();
                    newPt.x = i;
                    newPt.y = j;
                    tempArray.push(newPt);
                }
            }
        }
        newPt = Phaser.Utils.Array.GetRandom(tempArray);
        levelData[newPt.x][newPt.y] = 8;

        for (let i = 0; i < levelData.length; i++) {
            for (let j = 0; j < levelData[0].length; j++) {
                tileType = levelData[i][j];
                if (tileType == 8) {
                    this.drawPickupIso(i, j, tileWidth, borderOffset);
                }
            }
        }
    }
}