import Phaser from 'phaser'
import SwitchLevelScene from './SwitchLevelScene'

export default class Level1Scene extends SwitchLevelScene {
    constructor() {
        super('level-1-scene')
        this.heroMapTile = new Phaser.Geom.Point(2,4);
    }

    init(data) {
        //  Parse the data out of the map
        this.map = this.cache.json.get('map');
        this.doormat = new Phaser.Geom.Point(1, 4)
        
        super.init(data);
    }
}