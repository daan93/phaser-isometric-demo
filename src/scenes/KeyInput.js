export default {
    detectKeyInput(cursors, facing) {//assign direction for character & set x,y speed components   
        let dY = 0;
        let dX = 0; 

        if (cursors.up.isDown) {
            dY = -1;
        }
        else if (cursors.down.isDown) {
            dY = 1;
        }
        else {
            dY = 0;
        }
        if (cursors.right.isDown) {
            dX = 1;
            if (dY == 0) {
                facing = "east";
            }
            else if (dY == 1) {
                facing = "southeast";
                dX = dY = 0.5;
            }
            else {
                facing = "northeast";
                dX = 0.5;
                dY = -0.5;
            }
        }
        else if (cursors.left.isDown) {
            dX = -1;
            if (dY == 0) {
                facing = "west";
            }
            else if (dY == 1) {
                facing = "southwest";
                dY = 0.5;
                dX = -0.5;
            }
            else {
                facing = "northwest";
                dX = dY = -0.5;
            }
        }
        else {
            dX = 0;
            if (dY == 0) {
                //facing="west";
            }
            else if (dY == 1) {
                facing = "south";
            }
            else {
                facing = "north";
            }
        }

        return {
            facing: facing,
            dY: dY,
            dX: dX,
        }
    }
}