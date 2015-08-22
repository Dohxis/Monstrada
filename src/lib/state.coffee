config = require './config.coffee'

class State

  constructor: (game)->

  preload: ->
    @game.stage = $.extend @game.stage, config.stage
    @game.load.image imageName, path for imageName, path of config.images

  create: ->

  update: ->

module.exports = State
