import Phaser from 'phaser';
import IsoHelper from './IsoHelper';

export default class TileHelper {
    constructor(scene) {
        this.tileDebug = false;
        this.tileDebugGraphics = scene.add.graphics();
        this.tileDebugGraphics.depth = 9999;
        this.door;
        this.doormat = new Phaser.Geom.Point()
    }

    drawTileIso(scene, tileType, i, j, tileWidth, borderOffset, wallGraphicHeight, floorGraphicHeight) {//place isometric level tiles
        let isoPt = new Phaser.Geom.Point();//It is not advisable to create point in update loop
        let cartPt = new Phaser.Geom.Point();//This is here for better code readability.
        cartPt.x = j * tileWidth;
        cartPt.y = i * tileWidth;
        isoPt = IsoHelper.cartesianToIsometric(cartPt);
        let tile;

        if (i == 0 && j == 0) {
            console.log(isoPt.x + borderOffset.x, isoPt.y + borderOffset.y);
        }

        tile = scene.add.image(isoPt.x + borderOffset.x, isoPt.y + borderOffset.y - (wallGraphicHeight - floorGraphicHeight) / 2, 'tiles', tileType);
        tile.setOrigin(.5, 1 / 6 * 5);
        console.log(tile.originY);
        tile.depth = tile.y - floorGraphicHeight / 2;

        if (Array(3, 4, 5).includes(tileType)) {
            tile.depth = tile.y
        }

        if (tileType == 3) {
            this.door = tile;
        }

        if (this.tileDebug) {
            this.tileDebugGraphics.fillStyle(0xffff00);
            this.tileDebugGraphics.fillCircle(tile.x, tile.y, 3);
            this.tileDebugGraphics.fillStyle(0x0000ff);
            this.tileDebugGraphics.fillCircle(tile.x, tile.depth, 3);
        }
    }

    // isWalkable(levelData, tileCorners, tileWidth) {//It is not advisable to create points in update loop, but for code readability.
    //     let able = true;

    //     //check if those corners fall inside a wall after moving
    //     tileCorners.newTileCorner1 = IsoHelper.getTileCoordinates(tileCorners.newTileCorner1, tileWidth);
    //     if (levelData[tileCorners.newTileCorner1.y][tileCorners.newTileCorner1.x] == 1 ||
    //         levelData[tileCorners.newTileCorner1.y][tileCorners.newTileCorner1.x] == 2) {
    //         able = false;
    //     }

    //     tileCorners.newTileCorner2 = IsoHelper.getTileCoordinates(tileCorners.newTileCorner2, tileWidth);
    //     if (levelData[tileCorners.newTileCorner2.y][tileCorners.newTileCorner2.x] == 1 ||
    //         levelData[tileCorners.newTileCorner2.y][tileCorners.newTileCorner2.x] == 2) {
    //         able = false;
    //     }

    //     tileCorners.newTileCorner3 = IsoHelper.getTileCoordinates(tileCorners.newTileCorner3, tileWidth);
    //     if (levelData[tileCorners.newTileCorner3.y][tileCorners.newTileCorner3.x] == 1 ||
    //         levelData[tileCorners.newTileCorner3.y][tileCorners.newTileCorner3.x] == 2) {
    //         able = false;
    //     }

    //     return able;
    // }
}