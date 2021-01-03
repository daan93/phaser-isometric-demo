import Phaser from 'phaser';
import IsoHelper from '../helpers/IsoHelper';
import TileHelper from '../helpers/TileHelper';
import HeroObject from '../objects/HeroObject';
import PickupObject from '../objects/PickupObject';
import ScoreLabel from '../ui/ScoreLabel';
import KeyInput from '../helpers/KeyInput';

/* activity spawns pickups randomly which the character can collect by walking over 
and introduces doors with trigger tiles which can swap levels
*/

export default class SwitchLevelScene extends Phaser.Scene {
    init(data) {
        this.score = data.score ? data.score : 0;   
        this.heroMapTile = data.heroMapTile ? data.heroMapTile : this.heroMapTile;
        //x & y values of the direction vector for character movement
        this.dX = 0;
        this.dY = 0;
        this.tileWidth = 50;// the width of a tile
        this.borderOffset = new Phaser.Geom.Point(300, 75);//to centralise the isometric level display
        this.wallGraphicHeight = 98;
        // this.floorGraphicWidth = 103;
        this.floorGraphicHeight = 53;
        // this.heroGraphicWidth = 41;
        // this.heroWidth = (floorGraphicWidth / 2) - (heroGraphicWidth / 2);//for placing hero at the middle of the tile
        this.sorcerer;//hero
        // this.sorcererShadow;//duh
        // this.shadowOffset = new Phaser.Geom.Point(heroWidth + 7, 11);
    }

    create() {     
        this.cameras.main.setBackgroundColor('#cccccc');
        this.pickupSprite = this.add.existing(new PickupObject(this, 0, 0));
        this.TileHelper = new TileHelper(this);
        this.scoreLabel = this.createScoreLabel(10, 360, this.score)
        // this.sorcererShadow = this.add.sprite(0, 0, 'heroShadow');
        // this.sorcererShadow.alpha = 0.4;
        // heroMapTile = new Phaser.Geom.Point(3, 3);
        this.cursors = this.input.keyboard.createCursorKeys()
        this.input.keyboard.on('keydown-X', this.triggerListener);// add a Signal listener for up event
        this.createLevel();
    }

    update() {
        //check key press
        const KeyOutput = KeyInput.detectKeyInput(this.cursors, this.sorcerer.facing);
        this.sorcerer.facing = KeyOutput.facing;
        this.dY = KeyOutput.dY;
        this.dX = KeyOutput.dX;

        //if no key is pressed then stop else play walking animation
        if (this.dY == 0 && this.dX == 0) {
            this.sorcerer.anims.stop();
            this.sorcerer.anims.setProgress(0);
        } else {
            if (this.sorcerer.anims.currentAnim != this.sorcerer.facing) {
                this.sorcerer.anims.play(this.sorcerer.facing, true);
            }
        }
        
        //check if we are walking into a wall else move hero in 2D
        if (this.TileHelper.isWalkable(this.levelData, this.sorcerer, this.dX, this.dY, this.tileWidth)) {
            this.sorcerer.heroMapPos.x += this.sorcerer.heroSpeed * this.dX;
            this.sorcerer.heroMapPos.y += this.sorcerer.heroSpeed * this.dY;
            //get the new hero map tile
            this.sorcerer.heroMapTile = IsoHelper.getTileCoordinates(this.sorcerer.heroMapPos, this.tileWidth);
            //check for pickup & collect
            if (this.onPickupTile()) {
                this.pickupItem();
            }
            this.sorcerer.update()
        }
    }

    createScoreLabel(x, y, score)
	{
		const style = { fontSize: '16px', fill: '#000' }
		const label = new ScoreLabel(this, x, y, score, style)

		this.add.existing(label)

		return label
	}

    createLevel() {//create minimap
        this.addHero();
        this.pickupSprite.spawnNewPickup(this.levelData, this.sorcerer, this.tileWidth, this.borderOffset);
        this.renderScene();//draw once the initial state
    }

    addHero() {
        // sprite
        this.sorcerer = this.add.existing(new HeroObject(this, 0, 0, this.borderOffset, this.floorGraphicHeight));// keep him out side screen area
        this.sorcerer.setTilePosition(this.heroMapTile.x, this.heroMapTile.y, this.tileWidth)
        this.sorcerer.play(this.sorcerer.facing);
    }

    renderScene() {
        this.sorcerer.update();

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
    }

    triggerListener() {
        let that = this.scene;
        let trigger = that.levelData[that.sorcerer.heroMapTile.y][that.sorcerer.heroMapTile.x];
        if (trigger > 100) {//valid trigger tile
            trigger -= 100;

            let newScene;

            if (trigger == 1) {//switch to level 1
                newScene = 'level-1-scene';
            } else {//switch to level 2
                newScene = 'level-2-scene';
            }
            
            let heroMapTile = that.getNewHeroMapTile(newScene);
            that.scene.start(newScene, {score: that.score, heroMapTile: heroMapTile});
        }
    }

    getNewHeroMapTile(newScene) {
        newScene = this.scene.get(newScene);
        let levelData = newScene.levelData;
        let heroMapTile = new Phaser.Geom.Point();
        for (var i = 0; i < levelData.length; i++)
        {
            for (var j = 0; j < levelData[0].length; j++)
            {
                let trigger=levelData[i][j];
                if(trigger>100){//find the new trigger tile and place hero there
                    heroMapTile.y=j;
                    heroMapTile.x=i;
                }
            }
        }
        return heroMapTile;
    }

    pickupItem() {
        this.score++;
        this.scoreLabel.add(1)
        this.levelData[this.sorcerer.heroMapTile.y][this.sorcerer.heroMapTile.x] = 0;
        //spawn next pickup
        this.pickupSprite.spawnNewPickup(this.levelData, this.sorcerer, this.tileWidth, this.borderOffset);
    }

    onPickupTile() {//check if there is a pickup on hero tile
        return (this.levelData[this.sorcerer.heroMapTile.y][this.sorcerer.heroMapTile.x] == 8);
    }
}