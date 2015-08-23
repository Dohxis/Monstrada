config = require './config.coffee'

class LostState

  constructor: (game)->

  create: ->

    @explosion = @game.add.audio 'explosion', 0.05, false

    @game.add.sprite 0, 0, 'bg'

    @platforms = @game.add.group()
    @platforms.enableBody = true

    @platform1 = @platforms.create 0, 32, 'ground'
    @platform1.body.immovable = true
    @platform1.scale.y *= -1

    @platform2 = @platforms.create 0, @game.height - 32, 'ground'
    @platform2.body.immovable = true

    @title = @game.add.text(@game.world.centerX, @game.world.centerY, "Your score: " + config.scoreThis.toString());
    @title.anchor.set 0.5
    @title.align = 'center'
    @title.font = 'Arial Black'
    @title.fontSize = 25
    @title.fontWeight = 'bold'
    @title.fill = '#4890c3'
    @title.fixedToCamera = true

    @desc = @game.add.text(@game.world.centerX, @game.world.centerY - 75, 'Best score: ' + config.score.toString());
    @desc.anchor.set 0.5
    @desc.align = 'center'
    @desc.font = 'Arial Black'
    @desc.fontSize = 50
    @desc.fontWeight = 'bold'
    @desc.fill = '#4890c3'
    @desc.fixedToCamera = true

    @con = @game.add.text(@game.world.centerX, @game.world.centerY + 45, 'Press [Spacebar] to continue');
    @con.anchor.set 0.5
    @con.align = 'center'
    @con.font = 'Arial Black'
    @con.fontSize = 25
    @con.fontWeight = 'bold'
    @con.fill = '#4890c3'
    @con.fixedToCamera = true

    @spaceBar = @game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  update: ->
    if @spaceBar.isDown
      @game.state.start 'game'

module.exports = LostState
