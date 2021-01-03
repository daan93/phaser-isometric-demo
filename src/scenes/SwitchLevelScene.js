import Phaser from 'phaser';
import IsoHelper from './IsoHelper';
import TileHelper from './TileHelper';
import HeroObject from './HeroObject';
import PickupObject from './PickupObject';
import ScoreLabel from '../ui/ScoreLabel';
import KeyInput from './KeyInput';

/* activity spawns pickups randomly which the character can collect by walking over 
and introduces doors with trigger tiles which can swap levels
*/

//x & y values of the direction vector for character movement
let dX = 0;
let dY = 0;
let tileWidth = 50;// the width of a tile
let borderOffset = new Phaser.Geom.Point(300, 75);//to centralise the isometric level display
let wallGraphicHeight = 98;
// let floorGraphicWidth = 103;
let floorGraphicHeight = 53;
// let heroGraphicWidth = 41;
// let heroWidth = (floorGraphicWidth / 2) - (heroGraphicWidth / 2);//for placing hero at the middle of the tile
let sorcerer;//hero
// let sorcererShadow;//duh
// let shadowOffset = new Phaser.Geom.Point(heroWidth + 7, 11);

export default class SwitchLevelScene extends Phaser.Scene {
    init(data) {
        this.score = data.score ? data.score : 0;   
        this.heroMapTile = data.heroMapTile ? data.heroMapTile : this.heroMapTile;
    }

    create() {     
        this.cameras.main.setBackgroundColor('#cccccc');
        this.pickupSprite = this.add.existing(new PickupObject(this, 0, 0));
        this.TileHelper = new TileHelper(this);
        this.scoreLabel = this.createScoreLabel(10, 360, this.score)
        // sorcererShadow = this.add.sprite(0, 0, 'heroShadow');
        // sorcererShadow.alpha = 0.4;
        // heroMapTile = new Phaser.Geom.Point(3, 3);
        this.cursors = this.input.keyboard.createCursorKeys()
        this.input.keyboard.on('keydown-X', this.triggerListener);// add a Signal listener for up event
        this.createLevel();
    }

    update() {
        //check key press
        const KeyOutput = KeyInput.detectKeyInput(this.cursors, sorcerer.facing);
        sorcerer.facing = KeyOutput.facing;
        dY = KeyOutput.dY;
        dX = KeyOutput.dX;

        //if no key is pressed then stop else play walking animation
        if (dY == 0 && dX == 0) {
            sorcerer.anims.stop();
            sorcerer.anims.setProgress(0);
        } else {
            if (sorcerer.anims.currentAnim != sorcerer.facing) {
                sorcerer.anims.play(sorcerer.facing, true);
            }
        }
        
        //check if we are walking into a wall else move hero in 2D
        if (this.TileHelper.isWalkable(this.levelData, sorcerer, dX, dY, tileWidth)) {
            sorcerer.heroMapPos.x += sorcerer.heroSpeed * dX;
            sorcerer.heroMapPos.y += sorcerer.heroSpeed * dY;
            //get the new hero map tile
            sorcerer.heroMapTile = IsoHelper.getTileCoordinates(sorcerer.heroMapPos, tileWidth);
            //check for pickup & collect
            if (this.onPickupTile()) {
                this.pickupItem();
            }
            sorcerer.update()
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
        this.pickupSprite.spawnNewPickup(this.levelData, sorcerer, tileWidth, borderOffset);
        this.renderScene();//draw once the initial state
    }

    addHero() {
        // sprite
        sorcerer = this.add.existing(new HeroObject(this, 0, 0, borderOffset, floorGraphicHeight));// keep him out side screen area
        sorcerer.setTilePosition(this.heroMapTile.x, this.heroMapTile.y, tileWidth)
        sorcerer.play(sorcerer.facing);
    }

    renderScene() {
        sorcerer.update();

        let tileType = 0;
        for (let i = 0; i < this.levelData.length; i++) {
            for (let j = 0; j < this.levelData[0].length; j++) {
                tileType = this.levelData[i][j];
                this.TileHelper.drawTileIso(this, tileType, i, j, tileWidth, borderOffset, wallGraphicHeight, floorGraphicHeight);
                if (tileType == 8) {
                    this.pickupSprite.drawPickupIso(i, j, tileWidth, borderOffset);
                }
            }
        }
    }

    triggerListener() {
        let that = this.scene;
        let trigger = that.levelData[sorcerer.heroMapTile.y][sorcerer.heroMapTile.x];
        if (trigger > 100) {//valid trigger tile
            trigger -= 100;

            let newScene;

            if (trigger == 1) {//switch to level 1
                // that.scene.stop();
                newScene = 'level-1-scene';
            } else {//switch to level 2
                // that.scene.stop();
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
        this.levelData[sorcerer.heroMapTile.y][sorcerer.heroMapTile.x] = 0;
        //spawn next pickup
        this.pickupSprite.spawnNewPickup(this.levelData, sorcerer, tileWidth, borderOffset);
    }

    onPickupTile() {//check if there is a pickup on hero tile
        return (this.levelData[sorcerer.heroMapTile.y][sorcerer.heroMapTile.x] == 8);
    }
}