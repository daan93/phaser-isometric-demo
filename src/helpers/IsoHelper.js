export default {
    cartesianToIsometric(cartPt) {
        let tempPt = new Phaser.Geom.Point();
        tempPt.x = cartPt.x - cartPt.y;
        tempPt.y = (cartPt.x + cartPt.y) / 2;
        return (tempPt);
    },

    isometricToCartesian(isoPt) {
        let tempPt = new Phaser.Geom.Point();
        tempPt.x = (2 * isoPt.y + isoPt.x) / 2;
        tempPt.y = (2 * isoPt.y - isoPt.x) / 2;
        return (tempPt);
    },

    getTileCoordinates(cartPt, tileHeight) {
        let tempPt = new Phaser.Geom.Point();
        tempPt.x = Math.floor(cartPt.x / tileHeight);
        tempPt.y = Math.floor(cartPt.y / tileHeight);
        return (tempPt);
    },

    getCartesianFromTileCoordinates(tilePt, tileHeight) {
        let tempPt = new Phaser.Geom.Point();
        tempPt.x = tilePt.x * tileHeight;
        tempPt.y = tilePt.y * tileHeight;
        return (tempPt);
    }
}