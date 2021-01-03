import './css/style.css'
import Phaser from 'phaser'
import PreloadScene from './scenes/PreloadScene'
import Level1Scene from './scenes/Level1Scene'
import Level2Scene from './scenes/Level2Scene'

const config = {
	type: Phaser.AUTO,
	width: 600,
	height: 400,
	scene: [PreloadScene, Level1Scene, Level2Scene]
}

export default new Phaser.Game(config)