MenuState = require './lib/menu.coffee'
GameState = require './lib/game.coffee'
LostState = require './lib/lost.coffee'
config = require './lib/config.coffee'

$(document).ready ->
  ld = new Phaser.Game config.width, config.height, Phaser.AUTO
  ld.state.add 'menu', MenuState, yes
  ld.state.add 'game', GameState, no
  ld.state.add 'lost', LostState, no
