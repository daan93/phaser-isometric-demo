import Phaser from 'phaser'
import SwitchLevelScene from './SwitchLevelScene'

export default class Level1Scene extends SwitchLevelScene {
    constructor() {
        super('level-2-scene')

        this.levelData =
            [[1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 1],
            [1, 0, 8, 0, 0, 1],
            [1, 0, 0, 0, 101, 2],
            [1, 0, 1, 0, 0, 1],
            [1, 1, 1, 1, 1, 1]];
        this.heroMapTile = new Phaser.Geom.Point(2,2);
    }
}