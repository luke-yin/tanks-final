import Phaser from 'phaser';
import {Scene} from 'phaser';
import io from 'socket.io-client';

export default class GameOver extends Scene {
  constructor() {
    super('scene-gameover');
  }

  create() {
    const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
    this.add.image(0,0, 'bckgrnd').setOrigin(0).setScale(0.5);
    // this.scene.setActive(false, 'scene-lobby');
    // this.scene.setActive(true, 'scene-gameover');

    // this.scene.moveAbove("scene-game", 'scene-gameover');
    this.state = this.registry.get('state');
    this.scene.setActive(true, 'scene-gameover');
    this.scene.bringToTop('scene-gameover');
    this.add.text(screenCenterX, 200, 'GAME OVER', {
      fill: "#ff0000",
      fontSize: "64px",
      fontStyle: "bold",
      fontFamily: "Pixelar"
    }).setOrigin(0.5);

    /*
    // Play Again button
    this.strtBtn = this.add.sprite(400, 400, 'play-again');
    this.strtBtn.setInteractive();
    this.strtBtn.on('pointerdown', () => {
      this.playAgain();
    });
    */

    // Restart button
    // this.restartBtn = this.add.sprite(900, 400, 'main-menu'); // Use with play again button
    this.restartBtn = this.add.sprite(screenCenterX, 400, 'main-menu').setScale(0.5).setOrigin(0.5); // Use without play again button
    this.restartBtn.setInteractive();
    this.restartBtn.on('pointerdown', () => {
      this.restart();
    });

  }

  playAgain() {
    // this.registry.destroy();
    // this.events.off();
    // this.scene.restart();
    console.log("Clicked play again button");
    this.scene.run('scene-lobby', {previousGame: true});
    // this.scene.setActive(true, 'scene-lobby');
    this.scene.sleep('scene-gameover');
    this.scene.bringToTop('scene-lobby');
  }

  restart() {
    console.log("Clicked restart button");
    this.registry.destroy();
    this.events.off();
    this.scene.restart();
    this.scene.start('scene-boot');
    this.scene.bringToTop('scene-boot');
  }
}