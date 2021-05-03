import Phaser from 'phaser';
import ScoreLabel from '../ui/ScoreLabel';

export default class UIScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'UI-scene'
        });
    }

    init ()
    {
        this.score = 0;
    }

    create ()
    {
        this.scoreLabel = this.createScoreLabel(10, 10, this.score)

        //  Grab a reference to the Game Scene
        let scene1 = this.scene.get('level-1-scene');
        let scene2 = this.scene.get('level-2-scene');

        //  Listen for events from it
        scene1.events.on('addScore', function() {this.updateScore()}, this);
        scene2.events.on('addScore', function() {this.updateScore()}, this);
    }

    updateScore (info) {
        this.score += 10;
        
        this.scoreLabel.add(1);
    }

    createScoreLabel(x, y, score)
	{
		const style = { fontSize: '16px', fill: '#000' }
		const label = new ScoreLabel(this, x, y, score, style)

		this.add.existing(label)

		return label
	}
};