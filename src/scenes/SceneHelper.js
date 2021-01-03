import IsoHelper from './IsoHelper'

export default {
    create(scene) {
        scene.TileHelper = new TileHelper(scene);
        scene.scoreLabel = this.createScoreLabel(scene, 10, 360, 0)
        scene.cameras.main.setBackgroundColor('#cccccc');
        scene.pickupSprite = scene.add.existing(new PickupObject(scene, 0, 0));
        // sorcererShadow = scene.add.sprite(0, 0, 'heroShadow');
        // sorcererShadow.alpha = 0.4;
        scene.levelData = level1Data;
        // heroMapTile = new Phaser.Geom.Point(3, 3);
        scene.cursors = scene.input.keyboard.createCursorKeys()
        scene.input.keyboard.on('keydown-X', scene.triggerListener);// add a Signal listener for up event
        scene.createLevel();
    },

    update(scene) {
        //check key press
        const KeyOutput = KeyInput.detectKeyInput(scene.cursors, scene.sorcerer.facing);
        scene.sorcerer.facing = KeyOutput.facing;
        scene.dY = KeyOutput.dY;
        scene.dX = KeyOutput.dX;

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
        if (scene.isWalkable()) {
            sorcerer.heroMapPos.x += sorcerer.heroSpeed * dX;
            sorcerer.heroMapPos.y += sorcerer.heroSpeed * dY;
            //get the new hero map tile
            sorcerer.heroMapTile = IsoHelper.getTileCoordinates(sorcerer.heroMapPos, tileWidth);
            //check for pickup & collect
            if (this.onPickupTile(scene)) {
                this.pickupItem(scene);
            }
            scene.sorcerer.update()
        }
    },

    createScoreLabel(scene, x, y, score)
	{
		const style = { fontSize: '16px', fill: '#000' }
		const label = new ScoreLabel(scene, x, y, score, style)

		scene.add.existing(label)

		return label
	},

    createLevel(scene) {//create minimap
        scene.addHero();
        pickupSprite.spawnNewPickup(levelData, sorcerer, tileWidth, borderOffset);
        scene.renderScene();//draw once the initial state
    },

    addHero(scene) {
        // sprite
        sorcerer = scene.add.existing(new HeroObject(scene, 0, 0, borderOffset, floorGraphicHeight));// keep him out side screen area
        sorcerer.setTilePosition(3, 3, tileWidth)
        sorcerer.play(sorcerer.facing);
    },

    renderScene(scene) {
        sorcerer.update();

        let tileType = 0;
        for (let i = 0; i < levelData.length; i++) {
            for (let j = 0; j < levelData[0].length; j++) {
                tileType = levelData[i][j];
                scene.TileHelper.drawTileIso(scene, tileType, i, j, tileWidth, borderOffset, wallGraphicHeight, floorGraphicHeight);
                if (tileType == 8) {
                    pickupSprite.drawPickupIso(i, j, tileWidth, borderOffset);
                }
            }
        }
    },

    triggerListener(scene) {
        console.log('pressed x');
        let trigger = levelData[sorcerer.heroMapTile.y][sorcerer.heroMapTile.x];
        if (trigger > 100) {//valid trigger tile
            trigger -= 100;
            if (trigger == 1) {//switch to level 1
                levelData = level1Data;
            } else {//switch to level 2
                levelData = level2Data;
            }
            for (let i = 0; i < levelData.length; i++) {
                for (let j = 0; j < levelData[0].length; j++) {
                    trigger = levelData[i][j];
                    if (trigger > 100) {//find the new trigger tile and place hero there
                        sorcerer.heroMapTile.y = j;
                        sorcerer.heroMapTile.x = i;
                        sorcerer.heroMapPos = new Phaser.Geom.Point(sorcerer.heroMapTile.y * tileWidth, sorcerer.heroMapTile.x * tileWidth);
                        sorcerer.heroMapPos.x += (tileWidth / 2);
                        sorcerer.heroMapPos.y += (tileWidth / 2);
                    }
                }
            }
        }
    },

    pickupItem(scene) {
        scene.scoreLabel.add(1)
        scene.levelData[scene.sorcerer.heroMapTile.y][scene.sorcerer.heroMapTile.x] = 0;
        //spawn next pickup
        scene.pickupSprite.spawnNewPickup(scene.levelData, scene.sorcerer, scene.tileWidth, scene.borderOffset);
    },

    onPickupTile(scene) {//check if there is a pickup on hero tile
        return (scene.levelData[scene.sorcerer.heroMapTile.y][scene.sorcerer.heroMapTile.x] == 8);
    },
}