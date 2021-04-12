import {Scene} from 'phaser';
import io from 'socket.io-client';
import Player from '../entities/Player';
import unbreakableBlock from '../assets/platform.png';





// let logo;
// let cursors;
// let wasd;
// let spacebar;
// let tankP1;
// let tankP2;

// let p1Bullets;
// let unbreakable;
// let gameOver = false;
// let hardWalls;


function destroyBullet (unbreakable, bullet) {
  bullet.disableBody(true, true);
}



export default class GameScene extends Scene {

  constructor () {
      super("scene-game");
      
  }


  preload () {
    this.load.image('unbreakable', unbreakableBlock);
   
 
  }
      
      
  
      
  create () {
    const player1 = this.createPlayer();
    player1.setTexture('tankRight');
    const map = this.createMap();
    const layers = this.createLayers(map);
    const boundary = layers.wallLayer;
    
    this.physics.add.collider(player1, boundary);
    
    // Create objects
    // tankP1 = this.physics.add.sprite(200, 200, 'tankP1');
    // tankP1.direction = "up";
    // unbreakable = this.physics.add.staticSprite(400, 400, 'unbreakable');
    // tankP1.setCollideWorldBounds(true);
    // this.physics.add.collider(tankP1, layers.wallLayer)

    // Add groups for Bullet objects
      // p1Bullets = this.physics.add.group({ key: "bullet" });
      // this.physics.add.collider(p1Bullets, layers.wallLayer)
    



    //SOCKETS
  //   let self = this;
  //   this.socket = io('http://localhost:3000') //this will need to change on prod server
  //   this.socket.on('connect', function() {
  //     console.log(`User: ... has connected`);
  //   });

  //   this.socket.on('currentPlayers', (players) => {
  //     Object.keys(players).forEach((id) => {
  //       if (players[id].playerId === self.socket.id) {
  //         addPlayer(self, players[id]);
  //       }
  //     });
  //   });
  //   this.otherPlayers = this.physics.add.group();
  //   this.socket.on('currentPlayers', function (players) {
  //     Object.keys(players).forEach(function (id) {
  //       if (players[id].playerId === self.socket.id) {
  //         addPlayer(self, players[id]);
  //       } else {
  //         addOtherPlayers(self, players[id]);
  //       }
  //     });
  //   });

  //   this.socket.on('newPlayer', function (playerInfo) {
  //     addOtherPlayers(self, playerInfo);
  //   });

  //   this.socket.on('remove', function (playerId) {
  //     self.otherPlayers.getChildren().forEach(function (otherPlayer) {
  //       if (playerId === otherPlayer.playerId) {
  //         otherPlayer.destroy();
  //       }
  //     });
  //   });

  //   // Add players
  //   function addPlayer(self, playerInfo) {
  //     self.tankP1 = self.physics.add.image(playerInfo.x, playerInfo.y, 'tankP1').setOrigin(0.5, 0.5).setDisplaySize(64, 64);
  //     // if (playerInfo.team === 'blue') {
  //     //   self.tankP1.setTint(0x0000ff);
  //     // } else {
  //     //   self.tankP1.setTint(0xff0000);
  //     // }
  //     self.tankP1.setDrag(100);
  //     self.tankP1.setAngularDrag(100);
  //     self.tankP1.setMaxVelocity(200);
  //   }

  //   function addOtherPlayers(self, playerInfo) {
  //     const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'tankP2').setOrigin(0.5, 0.5).setDisplaySize(64, 64);
  //     // if (playerInfo.team === 'blue') {
  //     //   otherPlayer.setTint(0x0000ff);
  //     // } else {
  //     //   otherPlayer.setTint(0xff0000);
  //     // }
  //     otherPlayer.playerId = playerInfo.playerId;
  //     self.otherPlayers.add(otherPlayer);
  //   }
    

  //   // Input
    

  //   this.socket.on('playerMoved', function (playerInfo) {
  //     self.otherPlayers.getChildren().forEach(function (otherPlayer) {
  //       if (playerInfo.playerId === otherPlayer.playerId) {
  //         otherPlayer.setRotation(playerInfo.rotation);
  //         otherPlayer.setPosition(playerInfo.x, playerInfo.y);
  //       }
  //     });
  //   });
   

  //   spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  //   // Collisions
  //   this.physics.add.collider(tankP1, unbreakable);
  //   this.physics.add.overlap(p1Bullets, unbreakable, destroyBullet, null, this);

    // bullets = this.physics.add.group();

  }

  
  createMap() {
    const map = this.make.tilemap({key: 'map1'});
    map.addTilesetImage('rpl_grass', 'tilesGrass', 32, 32);
    map.addTilesetImage('rpl_sand','tilesSand', 32, 32);
   
    return map;
  }

  createLayers(map) {
    const tilesetGrass = map.getTileset('rpl_grass');
    const tilesetSand = map.getTileset('rpl_sand');
    const groundLayer = map.createLayer('background', [tilesetGrass, tilesetSand], 0, 0);
    const wallLayer = map.createLayer('blockedlayer', [tilesetGrass, tilesetSand], 0, 0);

    wallLayer.setCollisionByExclusion([-1]);
    return {groundLayer, wallLayer};

  }

  createPlayer() {
    return new Player(this,100,100,);
  }
  


}
