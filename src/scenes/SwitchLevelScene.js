import Phaser from 'phaser';
import IsoHelper from '../helpers/IsoHelper';
import TileHelper from '../helpers/TileHelper';
import HeroObject from '../objects/HeroObject';
import PickupObject from '../objects/PickupObject';
// import KeyInput from '../helpers/KeyInputHelper';

/* activity spawns pickups randomly which the character can collect by walking over 
and introduces doors with trigger tiles which can swap levels
*/

export default class SwitchLevelScene extends Phaser.Scene {
    init(data) {
        const layer = this.map.layers[0].data;

        const mapwidth = this.map.layers[0].width;
        const mapheight = this.map.layers[0].height;

        this.levelData = new Array(mapheight);

        for (var i = 0; i < this.levelData.length; i++) {
            this.levelData[i] = new Array(mapwidth);
        }

        let ii = 0;

        for (let y = 0; y < mapheight; y++)
        {
            for (let x = 0; x < mapwidth; x++)
            {
                const id = layer[ii] - 1;

                this.levelData[y][x] = id;

                ii++;
            }
        }

        this.score = data.score ? data.score : 0; // overwritten by data in scene change
        this.heroMapTile = data.heroMapTile ? data.heroMapTile : this.heroMapTile; // set in level scene, overwritten by data in scene change
        //x & y values of the direction vector for character movement
        this.direction = new Phaser.Geom.Point(0, 0);
        this.assassinDirection = new Phaser.Geom.Point(0, 0);
        this.tileWidth = this.map.tileheight;// the width of a tile
        this.borderOffset = new Phaser.Geom.Point(300, 75);//to centralise the isometric level display
        this.wallGraphicHeight = this.map.tileheight;
        this.floorGraphicHeight = this.map.tileheight;
        this.floorGraphicWidth = this.map.tilewidth;
        this.clicked = false;
        this.clickedPickup = false;
        this.clickedDoor = false;
        this.hoverDoor = false;
    }

    create() {
        this.cameras.main.setBackgroundColor('#006600');
        this.TileHelper = new TileHelper(this);
        // this.cursors = this.input.keyboard.createCursorKeys()
        // this.input.keyboard.on('keydown-X', this.triggerListener);// add a Signal listener for up event

        // detect pointer click
        let that = this;
        this.input.on('pointerup', function (pointer) {
            if (pointer.leftButtonReleased()) {
                that.clicked = true;
            }
        })

        // Render tiles and pickup
        this.renderScene();//draw once the initial state

        this.cameras.main.setBounds(
            this.map.layers[0].width * this.map.tileWidth / -2,
            0,
            this.levelData.length * this.tileWidth + this.levelData[0].length * this.tileWidth,
            this.levelData.length * this.floorGraphicHeight / 2 + this.levelData[0].length * this.floorGraphicHeight / 2);
    }

    update(time) {
        this.cameras.main.centerOn(this.sorcerer.x, this.sorcerer.y);

        if (this.clickedPickup) {
            let isoPt = new Phaser.Geom.Point(this.pickupSprite.x - this.borderOffset.x, this.pickupSprite.y - this.borderOffset.y);
            this.sorcerer.MoveTo.findPath(this, isoPt);
        }
        else if (this.clickedDoor) {
            this.triggerListener();
            let pos = this.input.activePointer.position;
            let isoPt = new Phaser.Geom.Point(pos.x - this.borderOffset.x + this.cameras.main.scrollX, pos.y - this.borderOffset.y + this.cameras.main.scrollY);
            this.sorcerer.MoveTo.findPath(this, isoPt);
        }
        else if (this.clicked) {
            let pos = this.input.activePointer.position;
            let isoPt = new Phaser.Geom.Point(pos.x - this.borderOffset.x + this.cameras.main.scrollX, pos.y - this.borderOffset.y + this.cameras.main.scrollY);
            this.sorcerer.MoveTo.findPath(this, isoPt);
        }
        this.clickedPickup = false;
        this.clickedDoor = false;
        this.clicked = false;

        // // check key press, will return direction 0 if not pressed
        // const KeyOutput = KeyInput.detectKeyInput(this.cursors, this.sorcerer.facing);
        // this.sorcerer.facing = KeyOutput.facing;
        // this.direction = KeyOutput.direction;

        //check if we are walking into a wall else move hero in 2D
        // if (this.TileHelper.isWalkable(this.levelData, this.sorcerer.getNewTileCorners(this.direction), this.tileWidth)) {
            // this.sorcerer.heroMapPos.x += this.sorcerer.heroSpeed * this.direction.x;
            // this.sorcerer.heroMapPos.y += this.sorcerer.heroSpeed * this.direction.y;
            // this.assassin.heroMapPos.x += this.assassin.heroSpeed * this.assassinDirection.x;
            // this.assassin.heroMapPos.y += this.assassin.heroSpeed * this.assassinDirection.y;
            // //get the new hero map tile
            // this.sorcerer.heroMapTile = IsoHelper.getTileCoordinates(this.sorcerer.heroMapPos, this.tileWidth);
            // this.assassin.heroMapTile = IsoHelper.getTileCoordinates(this.assassin.heroMapPos, this.tileWidth);
            // //check for pickup & collect
            // if (this.onPickupTile()) {
            //     this.pickupItem();
            // }
            this.sorcerer.update()
            this.assassin.update()
        // }

        this.heroMapTile = this.sorcerer.heroMapTile;
        
        //check for pickup & collect
        if (this.onPickupTile()) {
            this.pickupItem();
        }

        // check for trigger
        if (this.onDoorMat()) {//valid trigger tile
            this.TileHelper.door.setTintFill(0x00ff00);
        }
        else if (!this.hoverDoor) {
            this.TileHelper.door.clearTint();
        }
    }

    renderScene() {
        let scene = this;

        // add hero sprite
        this.sorcerer = this.add.existing(new HeroObject(this, this.heroMapTile.x, this.heroMapTile.y, this.borderOffset, this.floorGraphicHeight, this.tileWidth, this.levelData, 'hero2'));
        this.sorcerer.play(this.sorcerer.facing);
        this.sorcerer.update();

        // add assasin sprite
        this.assassin = this.add.existing(new HeroObject(this, 1, 1, this.borderOffset, this.floorGraphicHeight, this.tileWidth, this.levelData, 'hero3'));
        this.assassin.play(this.assassin.facing);
        this.assassin.update();

        let tilePt = new Phaser.Geom.Point(3, 1);
        this.assassin.MoveTo.findPath(this, IsoHelper.cartesianToIsometric(IsoHelper.getCartesianFromTileCoordinates(tilePt, this.tileWidth)))

        // add pickup sprite
        this.pickupSprite = this.add.existing(new PickupObject(this, 0, 0));
        this.pickupSprite.spawnNewPickup(this.levelData, this.sorcerer, this.tileWidth, this.borderOffset);

        this.pickupSprite.setInteractive().on('pointerover', function (pointer) {
            this.setTint(0xff0000);
        }).on('pointerout', function (pointer) {
            this.clearTint();
        }).on('pointerup', function (pointer) {
            scene.clickedPickup = true;
        });

        // add tiles
        let tileType = 0;
        for (let i = 0; i < this.levelData.length; i++) {
            for (let j = 0; j < this.levelData[0].length; j++) {
                tileType = this.levelData[i][j];
                this.TileHelper.drawTileIso(this, tileType, i, j, this.tileWidth, this.borderOffset, this.wallGraphicHeight, this.floorGraphicHeight);
                if (tileType == 8) {
                    this.pickupSprite.drawPickupIso(i, j, this.tileWidth, this.borderOffset);
                }
            }
        }

        this.TileHelper.door.setInteractive().on('pointerover', function (pointer) {
            this.setTint(0x999999);
            scene.hoverDoor = true;
        }).on('pointerout', function (pointer) {
            this.clearTint();
            scene.hoverDoor = false;
        }).on('pointerup', function (pointer) {
            scene.clickedDoor = true;
        });
    }

    triggerListener() {
        let that = this;
        let trigger = new Phaser.Geom.Point(that.sorcerer.heroMapTile.x, that.sorcerer.heroMapTile.y);
        if (trigger.x === this.doormat.x && trigger.y === this.doormat.y) {//valid trigger tile
            let newScene;

            if (that.scene.key == 'level-2-scene') {//switch to level 1
                newScene = 'level-1-scene';
            } else {//switch to level 2
                newScene = 'level-2-scene';
            }

            let heroMapTile = that.getNewHeroMapTile(newScene);
            that.scene.start(newScene, { score: that.score, heroMapTile: heroMapTile });
        }
    }

    getNewHeroMapTile(newScene) {
        newScene = this.scene.get(newScene);
        return newScene.doormat;
    }

    pickupItem() {
        this.score++;
        this.events.emit('addScore');
        this.levelData[this.sorcerer.heroMapTile.y][this.sorcerer.heroMapTile.x] = 0;
        //spawn next pickup
        this.pickupSprite.spawnNewPickup(this.levelData, this.sorcerer, this.tileWidth, this.borderOffset);
    }

    onPickupTile() {//check if there is a pickup on hero tile
        return (this.sorcerer.heroMapTile.y === this.pickupSprite.tile.y && this.sorcerer.heroMapTile.x === this.pickupSprite.tile.x);
    }

    onDoorMat() {
        return (this.sorcerer.heroMapTile.y === this.doormat.y && this.sorcerer.heroMapTile.x === this.doormat.x);
    }
}