import Phaser from 'phaser'
import IsoHelper from '../helpers/IsoHelper'
import MoveTo from '../helpers/MoveToHelper';

export default class HeroObject extends Phaser.GameObjects.Sprite {
    constructor(scene, tileX, tileY, borderOffset, floorGraphicHeight, tileWidth, levelData) {
        super(scene);

        // set tile position
        this.tileWidth = tileWidth;
        this.heroMapTile;//hero tile values in array
        this.setTilePosition(tileX, tileY);

        // walk to other tiles
        this.MoveTo = new MoveTo(this.heroMapTile, levelData, this.tileWidth, this);

        // other settings
        this.heroSpeed = 1.2;//well, speed of our hero
        this.heroMapPos;//2D coordinates of hero map marker sprite in minimap, assume this is mid point of graphic
        this.hero2DVolume = new Phaser.Geom.Point(30, 30);//now that we dont have a minimap & hero map sprite, we need this
        this.heroGraphicHeight = 62;
        this.borderOffset = borderOffset;
        this.floorGraphicHeight = floorGraphicHeight
        this.facing = 'southeast';
        this.direction = new Phaser.Geom.Point(0, 0);

        this.heroDebug = false;
        this.HeroDebugGraphics = scene.add.graphics();
        this.HeroDebugGraphics.depth = 9999;
        this.createAnims();
    }

    setTilePosition(tileX, tileY) {
        this.heroMapTile = new Phaser.Geom.Point(tileX, tileY);
        this.heroMapPos = new Phaser.Geom.Point(this.heroMapTile.y * this.tileWidth, this.heroMapTile.x * this.tileWidth);
        this.heroMapPos.x += (this.tileWidth / 2);
        this.heroMapPos.y += (this.tileWidth / 2);
    }

    update() {
        if (this.MoveTo.isWalking || this.MoveTo.path.length > 0) {
            // get directions
            const PathOutput = this.MoveTo.aiWalk(this, this.direction, this.facing);
            this.facing = PathOutput.facing;
            this.direction = PathOutput.direction;
        }

        //if directions are 0 then stop else play walking animation
        if (this.direction.y == 0 && this.direction.x == 0) {
            this.anims.stop();
            this.anims.setProgress(0);
        }
        else if (this.anims.currentAnim != this.facing) {
            this.anims.play(this.facing, true);
        }

        this.heroMapPos.x += this.heroSpeed * this.direction.x;
        this.heroMapPos.y += this.heroSpeed * this.direction.y;

        //get the new hero map tile
        this.heroMapTile = IsoHelper.getTileCoordinates(this.heroMapPos, this.tileWidth);

        let isoPt = new Phaser.Geom.Point();//It is not advisable to create points in update loop
        let heroCornerPt = new Phaser.Geom.Point(this.heroMapPos.x - this.hero2DVolume.x, this.heroMapPos.y - this.hero2DVolume.y);
        isoPt = IsoHelper.cartesianToIsometric(heroCornerPt);//find new isometric position for hero from 2D map position

        this.x = isoPt.x + this.borderOffset.x;
        this.y = isoPt.y + this.borderOffset.y - (this.floorGraphicHeight / 2);
        this.depth = this.y + this.heroGraphicHeight / 2;

        if (this.heroDebug) {
            this.HeroDebugGraphics.clear();
            this.HeroDebugGraphics.fillStyle(0xff0000);
            this.HeroDebugGraphics.fillCircle(this.x, this.y, 3);
            this.HeroDebugGraphics.fillStyle(0x00ff00);
            this.HeroDebugGraphics.fillCircle(this.x, this.depth, 3);
        }
    }

    createAnims() {
        // animation
        this.anims.create({
            key: 'southeast',
            frames: this.anims.generateFrameNames('hero', { suffix: '.png', start: 1, end: 4 }),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'south',
            frames: this.anims.generateFrameNames('hero', { suffix: '.png', start: 5, end: 8 }),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'southwest',
            frames: this.anims.generateFrameNames('hero', { suffix: '.png', start: 9, end: 12 }),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'west',
            frames: this.anims.generateFrameNames('hero', { suffix: '.png', start: 13, end: 16 }),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'northwest',
            frames: this.anims.generateFrameNames('hero', { suffix: '.png', start: 17, end: 20 }),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'north',
            frames: this.anims.generateFrameNames('hero', { suffix: '.png', start: 21, end: 24 }),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'northeast',
            frames: this.anims.generateFrameNames('hero', { suffix: '.png', start: 25, end: 28 }),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'east',
            frames: this.anims.generateFrameNames('hero', { suffix: '.png', start: 29, end: 32 }),
            frameRate: 6,
            repeat: -1
        });
    }

    // getNewTileCorners(direction) {
    //     let heroCornerPt = new Phaser.Geom.Point(this.heroMapPos.x - this.hero2DVolume.x / 2, this.heroMapPos.y - this.hero2DVolume.y / 2);
    //     let cornerTL = new Phaser.Geom.Point();
    //     cornerTL.x = heroCornerPt.x + (this.heroSpeed * direction.x);
    //     cornerTL.y = heroCornerPt.y + (this.heroSpeed * direction.y);
    //     // now we have the top left corner point. we need to find all 4 corners based on the map marker graphics width & height
    //     // ideally we should just provide the hero a volume instead of using the graphics' width & height
    //     let cornerTR = new Phaser.Geom.Point();
    //     cornerTR.x = cornerTL.x + this.hero2DVolume.x;
    //     cornerTR.y = cornerTL.y;
    //     let cornerBR = new Phaser.Geom.Point();
    //     cornerBR.x = cornerTR.x;
    //     cornerBR.y = cornerTL.y + this.hero2DVolume.y;
    //     let cornerBL = new Phaser.Geom.Point();
    //     cornerBL.x = cornerTL.x;
    //     cornerBL.y = cornerBR.y;
    //     let newTileCorner1;
    //     let newTileCorner2;
    //     let newTileCorner3 = this.heroMapPos;

    //     //let us get which 2 corners to check based on current this.facing, may be 3
    //     switch (this.facing) {
    //         case "north":
    //             newTileCorner1 = cornerTL;
    //             newTileCorner2 = cornerTR;
    //             break;
    //         case "south":
    //             newTileCorner1 = cornerBL;
    //             newTileCorner2 = cornerBR;
    //             break;
    //         case "east":
    //             newTileCorner1 = cornerBR;
    //             newTileCorner2 = cornerTR;
    //             break;
    //         case "west":
    //             newTileCorner1 = cornerTL;
    //             newTileCorner2 = cornerBL;
    //             break;
    //         case "northeast":
    //             newTileCorner1 = cornerTR;
    //             newTileCorner2 = cornerBR;
    //             newTileCorner3 = cornerTL;
    //             break;
    //         case "southeast":
    //             newTileCorner1 = cornerTR;
    //             newTileCorner2 = cornerBR;
    //             newTileCorner3 = cornerBL;
    //             break;
    //         case "northwest":
    //             newTileCorner1 = cornerTR;
    //             newTileCorner2 = cornerBL;
    //             newTileCorner3 = cornerTL;
    //             break;
    //         case "southwest":
    //             newTileCorner1 = cornerTL;
    //             newTileCorner2 = cornerBR;
    //             newTileCorner3 = cornerBL;
    //             break;
    //     }

    //     return {
    //         newTileCorner1,
    //         newTileCorner2,
    //         newTileCorner3,
    //     }
    // }
}