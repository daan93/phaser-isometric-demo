import './css/style.css'
import Phaser from 'phaser'
import PreloadScene from './scenes/PreloadScene'
import Level1Scene from './scenes/Level1Scene'
import Level2Scene from './scenes/Level2Scene'
import UIScene from './scenes/UIScene'

const config = {
	type: Phaser.AUTO,        
	scale: {
		mode: Phaser.Scale.NONE,
		width: window.innerWidth / 1.5,
		height: window.innerHeight / 1.5,
		zoom: 1.5
	},
	scene: [PreloadScene, UIScene, Level1Scene, Level2Scene]
}

const game = new Phaser.Game(config)

window.addEventListener("resize", function (e) {
    game.scale.resize(window.innerWidth / 1.5, window.innerHeight / 1.5)
}, false)

export default game;