config = require './config.coffee'

class State

  constructor: (game)->

  preload: ->
    @game.stage = $.extend @game.stage, config.stage
    @game.load.image imageName, path for imageName, path of config.images
    @game.load.spritesheet 'player', 'assets/img/player.png', 50, 100

  create: ->

    # Physics
    @game.physics.startSystem Phaser.Physics.ARCADE

    # Game objects
    @game.add.sprite 0, 0, 'bg'

    @player = @game.add.sprite 0, 0, 'player'
    @player.scale.setTo 0.8, 0.8
    @player.anchor.setTo 0.5, 0.5
    @game.physics.arcade.enable @player, Phaser.Physics.ARCADE
    @player.body.collideWorldBounds = true
    @player.body.gravity.y = 800
    @player.body.bounce.y = 0.2
    @player.animations.add 'walking', [0, 1, 2, 3], 10, true
    @playerFacing = 'right'

    @platforms = @game.add.group()
    @platforms.enableBody = true

    @ground = @platforms.create 0, @game.height - 32, 'ground'
    @ground.body.immovable = true

    # Attacking
    @bullets = @game.add.group();
    @bullets.enableBody = true
    @bullets.physicsBodyType = Phaser.Physics.ARCADE
    @bullets.createMultiple 100, 'bullet', 0, false
    @bullets.setAll 'outOfBoundsKill', true
    @bullets.setAll 'checkWorldBounds', true
    @shootTimer = 0
    @attackButton = @game.input.keyboard.addKey Phaser.Keyboard.SPACEBAR

    # Movement
    @button = @game.input.keyboard.createCursorKeys()
    @jumpTimer = 0


  update: ->
    @game.physics.arcade.collide @player, @platforms
    @player.body.velocity.x = 0

    # Movement
    if @button.right.isDown
      @player.body.velocity.x = 150
      @player.animations.play 'walking'
      @player.scale.x *= if @playerFacing == 'right' then 1 else -1
      @playerFacing = 'right'
    else if @button.left.isDown
      @player.body.velocity.x = -150
      @player.animations.play 'walking'
      @player.scale.x *= if @playerFacing == 'left' then 1 else -1
      @playerFacing = 'left'
    else
      @player.animations.stop()
      @player.frame = 0
    if @button.up.isDown && @game.time.now > @jumpTimer && @player.body.onFloor
      @player.body.velocity.y = -500
      @jumpTimer = @game.time.now + 1500

      # Attack
    if @attackButton.isDown && @game.time.now > @shootTimer
      @shootTimer = @game.time.now + 800
      @bullet = @bullets.getFirstExists false
      @xDir = if @playerFacing == 'right' then @player.body.x + 26 else @player.body.x - 26
      @bullet.reset @xDir, @player.body.y + 16
      @bullet.body.velocity.x = if @playerFacing == 'right' then 400 else -400

  render: ->
    #@game.debug.body(@player);
    #@game.debug.bodyInfo(@player, 16, 24);

module.exports = State
