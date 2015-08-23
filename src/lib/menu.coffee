config = require './config.coffee'

class MenuState

  constructor: (game)->

  preload: ->
    @game.stage = $.extend @game.stage, config.stage
    @game.load.image imageName, path for imageName, path of config.images
    @game.load.spritesheet 'player', 'assets/img/player.png', 50, 89
    @game.load.spritesheet 'enemy', 'assets/img/enemy.png', 50, 89
    @game.load.audio 'music', 'assets/sounds/music.mp3'
    @game.load.audio 'explosion', 'assets/sounds/explosion.wav'
    @game.load.audio 'jump', 'assets/sounds/jump.wav'
    @game.load.audio 'shoot', 'assets/sounds/shoot.wav'

  create: ->

    @music = @game.add.audio 'music'
    @music.volume = 0.5
    @music.loop = true
    @music.play()

    @game.add.sprite 0, 0, 'bg'

    @platforms = @game.add.group()
    @platforms.enableBody = true

    @platform1 = @platforms.create 0, 32, 'ground'
    @platform1.body.immovable = true
    @platform1.scale.y *= -1

    @platform2 = @platforms.create 0, @game.height - 32, 'ground'
    @platform2.body.immovable = true

    @title = @game.add.text(@game.world.centerX, @game.world.centerY - 45, "Monstrada");
    @title.anchor.set 0.5
    @title.align = 'center'
    @title.font = 'Arial Black'
    @title.fontSize = 75
    @title.fontWeight = 'bold'
    @title.fill = '#4890c3'
    @title.fixedToCamera = true

    @desc = @game.add.text(@game.world.centerX, @game.world.centerY + 20, 'Press [Spacebar] to play');
    @desc.anchor.set 0.5
    @desc.align = 'center'
    @desc.font = 'Arial Black'
    @desc.fontSize = 25
    @desc.fontWeight = 'bold'
    @desc.fill = '#4890c3'
    @desc.fixedToCamera = true

    @spaceBar = @game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  update: ->
    if @spaceBar.isDown
      @game.state.start 'game'

module.exports = MenuState
