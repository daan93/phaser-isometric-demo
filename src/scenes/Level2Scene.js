import Phaser from 'phaser'
import SwitchLevelScene from './SwitchLevelScene'

export default class Level1Scene extends SwitchLevelScene {
    constructor() {
        super('level-2-scene')
        this.heroMapTile = new Phaser.Geom.Point(2,2);
    }
    
    init(data) {
        //  Parse the data out of the map
        this.map = this.cache.json.get('map2');
        this.doormat = new Phaser.Geom.Point(6, 4)
        
        super.init(data);
    }
}