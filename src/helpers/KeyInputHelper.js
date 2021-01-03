import Phaser from 'phaser';

export default {
    detectKeyInput(cursors, facing) {//assign direction for character & set x,y speed components   
        let direction = new Phaser.Geom.Point(0, 0);

        if (cursors.up.isDown) {
            direction.y = -1;
        }
        else if (cursors.down.isDown) {
            direction.y = 1;
        }
        else {
            direction.y = 0;
        }
        if (cursors.right.isDown) {
            direction.x = 1;
            if (direction.y == 0) {
                facing = "east";
            }
            else if (direction.y == 1) {
                facing = "southeast";
                direction.x = direction.y = 0.5;
            }
            else {
                facing = "northeast";
                direction.x = 0.5;
                direction.y = -0.5;
            }
        }
        else if (cursors.left.isDown) {
            direction.x = -1;
            if (direction.y == 0) {
                facing = "west";
            }
            else if (direction.y == 1) {
                facing = "southwest";
                direction.y = 0.5;
                direction.x = -0.5;
            }
            else {
                facing = "northwest";
                direction.x = direction.y = -0.5;
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

        return {
            facing: facing,
            direction: direction,
        }
    }
}