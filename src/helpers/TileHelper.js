import Phaser from 'phaser';
import IsoHelper from './IsoHelper';

export default class TileHelper {
    constructor(scene) {
        this.tileDebug = false;
        this.tileDebugGraphics = scene.add.graphics();
        this.tileDebugGraphics.depth = 9999;
    }

    drawTileIso(scene, tileType, i, j, tileWidth, borderOffset, wallGraphicHeight, floorGraphicHeight) {//place isometric level tiles
        let isoPt = new Phaser.Geom.Point();//It is not advisable to create point in update loop
        let cartPt = new Phaser.Geom.Point();//This is here for better code readability.
        cartPt.x = j * tileWidth;
        cartPt.y = i * tileWidth;
        isoPt = IsoHelper.cartesianToIsometric(cartPt);

        let tile = undefined;

        if (tileType == 1) {
            tile = scene.add.image(isoPt.x + borderOffset.x, isoPt.y + borderOffset.y - (wallGraphicHeight - floorGraphicHeight) / 2, 'wall');
            tile.depth = tile.y + wallGraphicHeight / 2 - floorGraphicHeight / 2;
            
            if(this.tileDebug) {
                this.tileDebugGraphics.fillStyle(0xff0000);
                this.tileDebugGraphics.fillCircle(tile.x, tile.y, 3);
                this.tileDebugGraphics.fillStyle(0x00ff00);
                this.tileDebugGraphics.fillCircle(tile.x, tile.depth, 3);
            }
        } else if (tileType == 2) {
            tile = scene.add.image(isoPt.x + borderOffset.x, isoPt.y + borderOffset.y - (wallGraphicHeight - floorGraphicHeight) / 2, 'door');
            tile.depth = tile.y + wallGraphicHeight / 2 - floorGraphicHeight / 2;
        } else {
            tile = scene.add.image(isoPt.x + borderOffset.x, isoPt.y + borderOffset.y, 'floor');
            tile.depth = tile.y - floorGraphicHeight / 2;

            if(this.tileDebug) {
                this.tileDebugGraphics.fillStyle(0xffff00);
                this.tileDebugGraphics.fillCircle(tile.x, tile.y, 3);
                this.tileDebugGraphics.fillStyle(0x0000ff);
                this.tileDebugGraphics.fillCircle(tile.x, tile.depth, 3);
            }
        }
    }

    isWalkable(levelData, sorcerer, dX, dY, tileWidth) {//It is not advisable to create points in update loop, but for code readability.
        let able = true;

        const newTileCorners = sorcerer.getTileCorners(dX, dY);

        //check if those corners fall inside a wall after moving
        newTileCorners.newTileCorner1 = IsoHelper.getTileCoordinates(newTileCorners.newTileCorner1, tileWidth);
        if (levelData[newTileCorners.newTileCorner1.y][newTileCorners.newTileCorner1.x] == 1 ||
            levelData[newTileCorners.newTileCorner1.y][newTileCorners.newTileCorner1.x] == 2) {
            able = false;
        }

        newTileCorners.newTileCorner2 = IsoHelper.getTileCoordinates(newTileCorners.newTileCorner2, tileWidth);
        if (levelData[newTileCorners.newTileCorner2.y][newTileCorners.newTileCorner2.x] == 1 ||
            levelData[newTileCorners.newTileCorner2.y][newTileCorners.newTileCorner2.x] == 2) {
            able = false;
        }

        newTileCorners.newTileCorner3 = IsoHelper.getTileCoordinates(newTileCorners.newTileCorner3, tileWidth);
        if (levelData[newTileCorners.newTileCorner3.y][newTileCorners.newTileCorner3.x] == 1 ||
            levelData[newTileCorners.newTileCorner3.y][newTileCorners.newTileCorner3.x] == 2) {
            able = false;
        }

        return able;
    }
}