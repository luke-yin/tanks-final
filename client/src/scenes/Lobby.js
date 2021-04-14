import Phaser from 'phaser';
import io from 'socket.io-client';


export default class Lobby extends Phaser.Scene {
  constructor() {
    super('scene-lobby');
    this.state = {};
    this.hasBeenSet = false;
  }
  init(data){
    this.socket = data.socket;
    this.chatMessages = ['CHAT INITIALIZED'];
  }
  
  create() {


    const thisScene = this;
    // this.otherPlayers = this.physics.add.group();

    this.socket = io('http://localhost:3000') //this will need to change on prod server
    this.socket.on('connect', function() {
      console.log(`You have connected`);
    });
    
    this.registry.set('socket', this.socket);
    this.registry.set('state', this.state);
    console.log("--->state in lobby",this.state);
    this.scene.launch("scene-waitingRoom", {Socket: this.scene.socket})
    this.add.image(0,0, 'bckgrnd').setOrigin(0).setScale(0.5);
    
    const roomInfoText = this.add.text(500, 20, "", {
      fill: "#00ff00",
      fontSize: "20px",
      fontStyle: "bold"
    })
    
    
    this.socket.on('setState', function(state) {
      const {roomKey, players, numPlayers } = state
      thisScene.state.roomKey = roomKey;
      thisScene.state.players = players;
      thisScene.state.playerName = players[thisScene.socket.id].pName;
      thisScene.state.numPlayers = numPlayers;
      thisScene.state.pNumber = players[thisScene.socket.id].pNumber;
      const roomtext = `GAME KEY: ${roomKey} \n PLAYERS: ${numPlayers}/4`
      roomInfoText.setText(roomtext);
      if(thisScene.chatMessages.length > 20){
        thisScene.chatMessages.shift();
      }
      thisScene.chatMessages.push(`Hi ${thisScene.state.playerName} Welcome to ${roomKey}`)
      thisScene.chat.setText(thisScene.chatMessages)
      console.log("--->",thisScene.state.playerName)
    });
    
    this.socket.on("newPlayer", function(data){
      const newPlayerId = data.playerInfo.playerId;
      const newPName = data.playerInfo.pName;
      console.log("new player", newPName);
      thisScene.chatMessages.push(`---------------`,`A Rouge Operator: ${newPName}, has `,`joined the battle`, `---------------`,`Fire Away`);
      if(thisScene.chatMessages.length >= 20){
        thisScene.chatMessages.shift();
      }
      thisScene.chat.setText(thisScene.chatMessages)
      console.log("current state on playerjoin", thisScene.state);
      console.log("newplayer-->", newPlayerId);
      thisScene.state.players[newPlayerId] = data.playerInfo;
      thisScene.state.numPlayers = data.numPlayers;
      const roomtext = `GAME KEY: ${thisScene.state.roomKey} \n PLAYERS: ${thisScene.state.numPlayers}/4`;
      roomInfoText.setText(roomtext);
      console.log("current state afterplayerJoin", thisScene.state);
    });
    // PLAYERS
    // this.socket.on("currentPlayers", function (arg) {
    //   const { players, numPlayers } = arg;
    //   thisScene.state.numPlayers = numPlayers;
    //   Object.keys(players).forEach(function (id) {
    //     if (players[id].playerId === thisScene.socket.id) {
    //       thisScene.addPlayer(thisScene, players[id]);
    //     } else {
    //       scene.addOtherPlayers(thisScene, players[id]);
    //     }
    //   });
    // });




    // this.socket.on("newPlayer", function (arg) {
    //   const { playerInfo, numPlayers } = arg;
    //   thisScene.addOtherPlayers(thisScene, playerInfo);
    //   thisScene.state.numPlayers = numPlayers;
    // });
    this.chatheader = this.add.text(850, 10, "TANK CHAT",{
      lineSpacing: 10,
      backroundColor: '0xa9a9a9',
      color: '#26924F',
      padding: 10,
      fontStyle: 'bold',
    }) 
    this.chat = this.add.text(850, 30, "",{
      lineSpacing: 5,
      backroundColor: '0xa9a9a9',
      color: '#26924F',
      padding: 10,
      fontStyle: 'bold',
      wordWrap: {
        width: 325
      }
      
    });
    thisScene.textInput = this.add.dom(855, 540).createFromCache('chat-form').setOrigin(0);  
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
    
    this.enterKey.on('down', e => {
      const chatBox = thisScene.textInput.getChildByName("chat-form");
      if (chatBox.value !== "") {
        console.log(chatBox.value);
        const message = {
          message: chatBox.value,
          pName: thisScene.state.playerName,
          roomKey: thisScene.state.roomKey
        };
        thisScene.socket.emit("chatMessage", message)
        chatBox.value = ""
      }
      // }
    })
    
    this.socket.on("message", (pName,message)=>{

      thisScene.chatMessages.push(`${pName}: ${message}`)
      if(this.chatMessages.length > 20){
        this.chatMessages.shift();
      }
      this.chat.setText(this.chatMessages)
    });

   
    
    
    this.strtSmall = this.add.sprite(600, 540, 'start-sm');
    this.strtSmall.setInteractive();
    this.strtSmall.on('pointerdown', this.onDown,this);
   
    // sprites for player number selection
    this.p1Text = this.add.text(500, 150, "", {
      fill: "#00ff00",
      fontSize: "20px",
      fontStyle: "bold"
    });

    this.p1Select = this.add.sprite(400,150,'tankBlue').setInteractive();
    this.p1Select.on('pointerdown', (e) => {
      thisScene.setPlayerText(thisScene.p1Text, thisScene.state.playerName, thisScene.state.pNumber);
      console.log("before emit setpNumber1",thisScene.state.pNumber)
      thisScene.state.pNumber = "p1";
      thisScene.socket.emit("setpNumber", this.socket.id, thisScene.state)
      console.log("after emit setpNumber1",this.socket)
      console.log("after emit setpNumber1",thisScene.state.pNumber)
    });

    

    this.p2Select = this.add.sprite(400,250,'tankRed').setInteractive();
    this.p2Select.on('pointerdown', (e) => {
      thisScene.setPlayerText(thisScene.p2Text, thisScene.state.playerName, thisScene.state.pNumber);
      console.log("before emit setpNumber2",thisScene.state.pNumber)
      thisScene.state.pNumber = "p2";
      thisScene.socket.emit("setpNumber", this.socket.id, thisScene.state)
      console.log("after emit setpNumber2",this.socket)
      console.log("after emit setpNumber2",thisScene.state.pNumber)
    });


    this.p2Text = this.add.text(500, 250, "", {
      fill: "#00ff00",
      fontSize: "20px",
      fontStyle: "bold"
    })

    this.p3Select = this.add.sprite(400,350,'tankGreen').setInteractive();
    this.p3Select.on('pointerdown', (e) => {
      
      console.log("before emit setpNumber2",thisScene.state.pNumber)
      thisScene.setPlayerText(thisScene.p3Text, thisScene.state.playerName, thisScene.state.pNumber);
      thisScene.state.pNumber = "p3";
      thisScene.socket.emit("setpNumber", this.socket.id, thisScene.state)
      console.log("after emit setpNumber2",this.socket)
      console.log("after emit setpNumber2",thisScene.state.pNumber)
    });

    this.p3Text = this.add.text(500, 350, "", {
      fill: "#00ff00",
      fontSize: "20px",
      fontStyle: "bold"
    })


    this.p4Select = this.add.sprite(400,450,'tankYellow').setInteractive();
    this.p4Select.on('pointerdown', (e) => {
      thisScene.setPlayerText(thisScene.p4Text, thisScene.state.playerName, thisScene.state.pNumber);
      console.log("before emit setpNumber2",thisScene.state.pNumber)
      thisScene.state.pNumber = "p4";
      thisScene.socket.emit("setpNumber", this.socket.id, thisScene.state);
      console.log("after emit setpNumber2",this.socket)
      console.log("after emit setpNumber2",thisScene.state.pNumber)
    });
    this.p4Text = this.add.text(500, 450, "", {
      fill: "#00ff00",
      fontSize: "20px",
      fontStyle: "bold"
    });
    
  }

  onDown() {
    this.scene.start ('scene-game')
  }

  update(){
  }

  setPlayerNumber() {
    //take in player info obj and position clicked as args
    //assign pNumber in player info obj in state.
    //display player id and name beside tank
     
  }
  setPlayerText(textarea, playerName, oldPNumber){
    if (oldPNumber !== ''){
     switch (oldPNumber) {
      case 'p1':
       this.p1Text.setText('');
        break;
      case 'p2':
       this.p2Text.setText('');
        break;
      case 'p3':
        this.p3Text.setText('');    
        break;
      case 'p4':
       this.p4Text.setText('');
        break;
     }
     console.log("oldtextarea",)

    }
   textarea.setText(`Operator:${playerName} will be this tank`)
  }
}