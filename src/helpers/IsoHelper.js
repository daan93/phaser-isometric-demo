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

    getTileCoordinates(cartPt, tileWidth) {
        let tempPt = new Phaser.Geom.Point();
        tempPt.x = Math.floor(cartPt.x / tileWidth);
        tempPt.y = Math.floor(cartPt.y / tileWidth);
        return (tempPt);
    },

    getCartesianFromTileCoordinates(tilePt, tileWidth) {
        let tempPt = new Phaser.Geom.Point();
        tempPt.x = tilePt.x * tileWidth;
        tempPt.y = tilePt.y * tileWidth;
        return (tempPt);
    }
}