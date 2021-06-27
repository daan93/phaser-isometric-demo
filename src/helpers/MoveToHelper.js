import Phaser from 'phaser';
import IsoHelper from './IsoHelper';
import EasyStar from 'easystarjs'

export default class {
    constructor(heroMapTile, levelData, tileWidth, gameObject) {
        this.isFindingPath = false;
        this.path = [];
        this.destination = heroMapTile;
        this.stepsTillTurn = 19;//20 works best but thats for full frame rate
        this.stepsTaken = 0;
        this.isWalking;
        this.halfSpeed = 0.8;//changed from 0.5 for smooth diagonal walks
        this.levelData = levelData;
        this.tileWidth = tileWidth;
        this.gameObject = gameObject;
        this.walkableTiles = [0, 101, 102, 8];
        this.lowestDistanceToTarget = 0;

        this.easystar = new EasyStar.js();
        this.easystar.setGrid(this.levelData);
        this.easystar.setAcceptableTiles(this.walkableTiles);
        this.easystar.enableDiagonals();// we want path to have diagonals
        this.easystar.disableCornerCutting();// no diagonal path when walking at wall corners
    }

    findPath(scene, isoPt) {
        this.path = [];
        this.tapPos = IsoHelper.isometricToCartesian(isoPt);
        this.tapPos.x += this.tileWidth / 2;//adjustment to find the right tile for error due to rounding off
        this.tapPos.y += this.tileWidth / 2;
        this.tapPos = IsoHelper.getTileCoordinates(this.tapPos, this.tileWidth);

        if (this.tapPos.x > -1 && this.tapPos.y > -1 && this.tapPos.y < this.levelData.length && this.tapPos.x < this.levelData[this.tapPos.y].length) {//tapped within grid
            this.isFindingPath = true;
            //let the algorithm do the magic
            let that = this;
            this.easystar.findPath(this.gameObject.heroMapTile.x, this.gameObject.heroMapTile.y, this.tapPos.x, this.tapPos.y, function (newPath) {
                if (!that.isWalking) that.destination = that.gameObject.heroMapTile;
                console.log(that.destination);
                that.isFindingPath = false;
                if (newPath === null) {
                    console.log("No Path was found, generating partial path");

                    that.findClosestPath(that.tapPos);
                } else {
                    that.path = newPath;
                    that.path.push(that.tapPos);
                    that.path.reverse();
                    that.path.pop();
                    console.log(that.path[that.path.length-1]);
                }
            });
            this.easystar.calculate();
        }
    }

    findClosestPath(tilePt) {
        // flood fill from unwalkable until walkables are found
        let tiles = this.floodFill(tilePt);
        let that = this;

        tiles.walkableTiles.forEach(element => {
            this.easystar.findPath(this.gameObject.heroMapTile.x, this.gameObject.heroMapTile.y, element.x, element.y, function (newPath) {
                if (!that.path.length || newPath.length < that.path.length ) {
                    that.path = newPath;
                    that.path.push(newPath[newPath.length-1]);
                    that.path.reverse();
                    that.path.pop();
                    console.log(that.path[that.path.length-1]);
                }
            });
        });

        this.easystar.calculate();
        // find path to each walkable tile
        // pick path with lowest amount of steps and lowest tile cost
        // move character along path
    }

    searchedTileBefore(tilePt, walkableTiles, unwalkableTiles) {
        if (JSON.stringify(walkableTiles).includes(JSON.stringify(tilePt))) return true;
        if (JSON.stringify(unwalkableTiles).includes(JSON.stringify(tilePt))) return true;
        return false;
    }

    floodFill(tilePt, walkableTiles, unwalkableTiles, distance) {
        if (!walkableTiles) walkableTiles = [];
        if (!unwalkableTiles) unwalkableTiles = []
        if (!distance) distance = 0;

        // return empty if outside of grid
        if (tilePt.y < 0) return {};
        if (tilePt.y > this.levelData.length - 1) return {};
        if (tilePt.x < 0) return {};
        if (tilePt.x > this.levelData[tilePt.y].length - 1) return {};

        
        if (this.walkableTiles.includes(this.levelData[tilePt.y][tilePt.x])) {
            if (distance < this.lowestDistanceToTarget) walkableTiles = [] // remove walkable tiles further away

            this.lowestDistanceToTarget = distance; // log distance of found tile

            return { 
                "walkableTiles": walkableTiles.concat(tilePt) // return tile with other walkable tiles if walkable
            };
        }

        // if not returned this tile is unwalkable
        unwalkableTiles = unwalkableTiles.concat(tilePt);

        // search in all four directions
        // increase distance in every direction
        // don't go any deeper then logged distance in each direction
        if (distance < this.lowestDistanceToTarget || this.lowestDistanceToTarget === 0) {
            if (!this.searchedTileBefore(new Phaser.Geom.Point(tilePt.x + 1, tilePt.y), walkableTiles, unwalkableTiles)) {
                let right = this.floodFill(new Phaser.Geom.Point(tilePt.x + 1, tilePt.y), walkableTiles, unwalkableTiles, distance + 1);
                if (right.walkableTiles) walkableTiles = right.walkableTiles;
                if (right.unwalkableTiles) unwalkableTiles = right.unwalkableTiles;
            }

            if (!this.searchedTileBefore(new Phaser.Geom.Point(tilePt.x - 1, tilePt.y), walkableTiles, unwalkableTiles)) {
                let left = this.floodFill(new Phaser.Geom.Point(tilePt.x - 1, tilePt.y), walkableTiles, unwalkableTiles, distance + 1);
                if (left.walkableTiles) walkableTiles = left.walkableTiles;
                if (left.unwalkableTiles) unwalkableTiles = left.unwalkableTiles;
            }

            if (!this.searchedTileBefore(new Phaser.Geom.Point(tilePt.x, tilePt.y + 1), walkableTiles, unwalkableTiles)) {
                let up = this.floodFill(new Phaser.Geom.Point(tilePt.x, tilePt.y + 1), walkableTiles, unwalkableTiles, distance + 1);
                if (up.walkableTiles) walkableTiles = up.walkableTiles;
                if (up.unwalkableTiles) unwalkableTiles = up.unwalkableTiles;
            }

            if (!this.searchedTileBefore(new Phaser.Geom.Point(tilePt.x, tilePt.y - 1), walkableTiles, unwalkableTiles)) {
                let down = this.floodFill(new Phaser.Geom.Point(tilePt.x, tilePt.y - 1), walkableTiles, unwalkableTiles, distance + 1);
                if (down.walkableTiles) walkableTiles = down.walkableTiles;
                if (down.unwalkableTiles) unwalkableTiles = down.unwalkableTiles;
            }
        }

        // reset lowest distance for future calculations
        if (distance === 0) this.lowestDistanceToTarget = 0;

        // return search result
        return {
            "walkableTiles": walkableTiles,
            "unwalkableTiles": unwalkableTiles,
        };
    }

    aiWalk(scene, direction, facing) {
        if (this.path.length == 0) {//path has ended
            // console.log('path ended');
            if (this.gameObject.heroMapTile.x == this.destination.x && this.gameObject.heroMapTile.y == this.destination.y) {
                direction.x = 0;
                direction.y = 0;
                //console.log("ret "+destination.x+" ; "+destination.y+"-"+heroMapTile.x+" ; "+heroMapTile.y);
                this.isWalking = false;
                return {
                    facing: facing,
                    direction: direction,
                }
            }
        }
        this.isWalking = true;
        if (this.gameObject.heroMapTile.x == this.destination.x && this.gameObject.heroMapTile.y == this.destination.y) {//reached current destination, set new, change direction
            //wait till we are few steps into the tile before we turn
            this.stepsTaken++;
            if (this.stepsTaken < this.stepsTillTurn) {
                return {
                    facing: facing,
                    direction: direction,
                }
            }
            console.log("turn at " + this.gameObject.heroMapTile.x + " ; " + this.gameObject.heroMapTile.y);
            //centralise the hero on the tile    
            // this.gameObject.x = (this.gameObject.heroMapTile.x * this.tileWidth) + (this.tileWidth / 2) - (this.gameObject.width / 2);
            // this.gameObject.y = (this.gameObject.heroMapTile.y * this.tileWidth) + (this.tileWidth / 2) - (this.gameObject.height / 2);
            // this.gameObject.heroMapPos.x = this.gameObject.heroMapPos.x + this.gameObject.width / 2;
            // this.gameObject.heroMapPos.y = this.gameObject.heroMapPos.y + this.gameObject.height / 2;

            this.stepsTaken = 0;
            this.destination = this.path.pop();//whats next tile in path
            if (this.gameObject.heroMapTile.x < this.destination.x) {
                direction.x = 1;
            } else if (this.gameObject.heroMapTile.x > this.destination.x) {
                direction.x = -1;
            } else {
                direction.x = 0;
            }
            if (this.gameObject.heroMapTile.y < this.destination.y) {
                direction.y = 1;
            } else if (this.gameObject.heroMapTile.y > this.destination.y) {
                direction.y = -1;
            } else {
                direction.y = 0;
            }
            if (this.gameObject.heroMapTile.x == this.destination.x) {//top or bottom
                direction.x = 0;
            } else if (this.gameObject.heroMapTile.y == this.destination.y) {//left or right
                direction.y = 0;
            }
            //figure out which direction to face
            if (direction.x == 1) {
                if (direction.y == 0) {
                    facing = "east";
                }
                else if (direction.y == 1) {
                    facing = "southeast";
                    direction.x = direction.y = this.halfSpeed;
                }
                else {
                    facing = "northeast";
                    direction.x = this.halfSpeed;
                    direction.y = -1 * this.halfSpeed;
                }
            }
            else if (direction.x == -1) {
                direction.x = -1;
                if (direction.y == 0) {
                    facing = "west";
                }
                else if (direction.y == 1) {
                    facing = "southwest";
                    direction.y = this.halfSpeed;
                    direction.x = -1 * this.halfSpeed;
                }
                else {
                    facing = "northwest";
                    direction.x = direction.y = -1 * this.halfSpeed;
                }
            }
            else {
                direction.x = 0;
                if (direction.y == 0) {
                    //facing="west";
                }
                else if (direction.y == 1) {
                    facing = "south";
                }
                else {
                    facing = "north";
                }
            }
        }

        return {
            facing: facing,
            direction: direction,
        }
    }
}