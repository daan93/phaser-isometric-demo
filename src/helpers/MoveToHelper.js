import Phaser from 'phaser';
import IsoHelper from './IsoHelper';
import EasyStar from 'easystarjs'

export default class {
    constructor(heroMapTile, levelData, tileWidth, gameObject) {
        this.isFindingPath = false;
        this.path=[];
        this.destination=heroMapTile;
        this.stepsTillTurn=19;//20 works best but thats for full frame rate
        this.stepsTaken=0;
        this.isWalking;
        this.halfSpeed=0.8;//changed from 0.5 for smooth diagonal walks
        this.levelData=levelData;
        this.tileWidth=tileWidth;
        this.gameObject = gameObject;

        this.easystar = new EasyStar.js();
        this.easystar.setGrid(this.levelData);
        this.easystar.setAcceptableTiles([0, 101, 102, 8]);
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
                that.isFindingPath = false;
                if (newPath === null) {
                    console.log("No Path was found.");
                } else {
                    that.path = newPath;
                    that.path.push(that.tapPos);
                    that.path.reverse();
                    that.path.pop();
                }
            });
            this.easystar.calculate();
        }
    }

    aiWalk(scene, direction, facing) {
        if (this.path.length == 0) {//path has ended
            console.log('path ended');
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
            // scene.sorcerer.x = (scene.sorcerer.heroMapTile.x * this.tileWidth) + (this.tileWidth / 2) - (scene.sorcerer.width / 2);
            // scene.sorcerer.y = (scene.sorcerer.heroMapTile.y * this.tileWidth) + (this.tileWidth / 2) - (scene.sorcerer.height / 2);
            // scene.sorcerer.heroMapPos.x = scene.sorcerer.heroMapPos.x + scene.sorcerer.width / 2;
            // scene.sorcerer.heroMapPos.y = scene.sorcerer.heroMapPos.y + scene.sorcerer.height / 2;

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