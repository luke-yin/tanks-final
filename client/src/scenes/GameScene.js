import {Scene} from 'phaser';
import io from 'socket.io-client';
import Player from '../entities/Player';
import TestObject from '../entities/TestObject'
import unbreakableBlock from '../assets/platform.png';



export default class GameScene extends Scene {

  constructor () {
      super("scene-game");
      
  }

  /*
  preload () {
    this.load.image('box1', '../assets/boxes/1.png');
  }
  */
            
  create () {

    this.socket = this.registry.get('socket');
    this.state = this.registry.get('state');
    const map = this.createMap();
    const layers = this.createLayers(map);
    const playerSpawnZones = this.getPlayerZones(layers.spawnZone);
    
    const player1 = this.createPlayer(playerSpawnZones); 
    const player2 = this.createEnemyPlayer(playerSpawnZones);
    console.log("layer--->",layers.spawnZone)
    ///work around for player sprite render below tile map until move?
    player1.setTexture('tankRight');
    // ----------------------------------------------
    // player1.projectilesGroup.addCollider(layers.wallLayer, player1.projectilesGroup.killAndHide);
    // this.physics.add.collider(player1.projectilesGroup, layers.wallLayer);
    this.createPlayerColliders(player1,{
      colliders:{
        wallLayer: layers.wallLayer
      }
    });
  

    this.physics.add.collider(player1.projectilesGroup, layers.wallLayer, (projectile, wall) => {
      projectile.setVisible(false);
      projectile.setActive(false);
    });

    // Destructible box logic, may need refactoring
    let boxes = this.physics.add.group();
    boxes.create(600, 400, 'breakable').setScale(0.08);
    boxes.create(800, 400, 'breakable').setScale(0.08);
    boxes.children.each((box) => {
      box.body.immovable = true;
      box.body.moves = false;
    })

    player1.addCollider(boxes);

    this.physics.add.overlap(player1.projectilesGroup, boxes, (projectile, box) => {
      box.destroy();
      projectile.body.reset(0,0);
      // projectile.disableBody(true, true);
      projectile.setActive(false);
      projectile.setVisible(false);
    }, null, this);


    this.socket.on('playerMoved', function (data) {
      console.log(data.pName, data.x, data.y)
      //enemyUpdate(data);
      // player2.x = data.x;
      // player2.y = data.y;
    })

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
    const spawnZone = map.getObjectLayer('player_start');
      //need to add collision specific layer to tile map independent of wall layer.
    wallLayer.setCollisionByExclusion([-1]);
    groundLayer.setDepth(-1);
    return {groundLayer, wallLayer, spawnZone};

  }
  
  createPlayer(playerSpawnZones) {
    const { player1Spawn } = playerSpawnZones
    return new Player(this, player1Spawn.x, player1Spawn.y, this.socket, this.state);
  }

  createEnemyPlayer(playerSpawnZones){
    const { player2spawn } = playerSpawnZones
    
    //return new TestObject(this, player2spawn.x, player2spawn.y)
  }

  enemyUpdate(data) {
    // player2.x = data.x;
    // player2.y = data.y;
  }

  createPlayerColliders(player, { colliders }){
    player.addCollider(colliders.wallLayer);
  }

  getPlayerZones(spawnZoneLayer){
    console.log("zones --->",spawnZoneLayer);
    const playerSpawns = spawnZoneLayer.objects;
    return {
      player1Spawn: playerSpawns[0],
      player2Spawn: playerSpawns[1],
      player3Spawn: playerSpawns[2],
      player4Spawn: playerSpawns[3]
    }
  }

  



}