config = require './config.coffee'

class State

  EnemyObj = (index, game) ->
    @game = game
    @enemy = game.add.sprite game.world.centerX, 0, 'enemy'
    @game.physics.enable @enemy, Phaser.Physics.ARCADE
    @enemy.name = index.toString()
    @enemy.body.immovable = false
    @enemy.body.gravity.y = 800
    @enemy.body.bounce.y = 0.2
    @enemy.animations.add 'walking', [0, 1, 2, 3], 10, true
    @enemy.goD = if Math.round(Math.random()) == 1 then 'right' else 'left'
    @enemy.body.setSize 50, 89
    @enemy.speed = Math.floor(Math.random() * 80) + 30

  EnemyObj.prototype.kill = (explosion) ->
    explosion.play()
    @enemy.kill()

  constructor: (game)->

  create: ->

    @score = 1
    @lives = 3

    # Music
    @explosion = @game.add.audio 'explosion', 0.05, false
    @jump = @game.add.audio 'jump', 0.05, false
    @shoot = @game.add.audio 'shoot', 0.05, false

    # Physics
    @game.physics.startSystem Phaser.Physics.ARCADE

    # Game objects
    @game.add.sprite 0, 0, 'bg'

    @player = @game.add.sprite @game.world.centerX, 400, 'player'
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

    @platform1 = @platforms.create 450, @game.height - 180, 'ground'
    @platform1.body.immovable = true

    @platform2 = @platforms.create -450, @game.height - 180, 'ground'
    @platform2.body.immovable = true

    @platform3 = @platforms.create 160, @game.height - 300, 'platform'
    @platform3.body.immovable = true

    @walls = @game.add.group()
    @walls.enableBody = true

    @wall1 = @walls.create 25, 0, ''
    @wall1.scale.setTo 0.01, 20
    @wall1.body.immovable = true
    @wall1.visable = false

    @wall2 = @walls.create @game.world.width + 15, 0, ''
    @wall2.scale.setTo 0.01, 20
    @wall2.body.immovable = true
    @wall2.visable = false

    # UI
    @hearts = []
    @hearts.push @game.add.sprite(5, 3, 'heart')
    @hearts.push @game.add.sprite(45, 3, 'heart')
    @hearts.push @game.add.sprite(85, 3, 'heart')
    @hearts[0].fixedToCamera = true
    @hearts[1].fixedToCamera = true
    @hearts[2].fixedToCamera = true

    @scoreText = @game.add.text @game.width - 100, 5, "Score: " + @score.toString()
    @scoreText.anchor.set 0.5
    @scoreText.align = 'center'
    @scoreText.font = 'Arial Black';
    @scoreText.fontSize = 40
    @scoreText.fontWeight = 'bold'
    @scoreText.fill = '#4890c3'
    @scoreText.fixedToCamera = true

    # Enemies
    @enemiesAlive = 0
    @enemiesKilled = 0
    @enemies = []
    for x in [0..2]
      @enemies.push new EnemyObj(x, @game)
      @enemiesAlive++


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

    # Update score
    @scoreText.cameraOffset.x = @game.world.width - @scoreText.width + 100
    @scoreText.setText "Score: " + @score.toString()

    for x in [0 .. @enemies.length - 1]
      @game.physics.arcade.collide @platforms, @enemies[x].enemy, collideEnemy, null, this
      @game.physics.arcade.collide @walls, @enemies[x].enemy, collideWalls, null, this
      @game.physics.arcade.collide @bullets, @enemies[x].enemy, hitEnemy, null, this
      @game.physics.arcade.collide @player, @enemies[x].enemy, getHit, null, this

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
      @jump.play()

    # Attack
    if @attackButton.isDown && @game.time.now > @shootTimer
      @shootTimer = @game.time.now + 1000
      @bullet = @bullets.getFirstExists false
      @xDir = if @playerFacing == 'right' then @player.body.x + 26 else @player.body.x - 26
      @bullet.reset @xDir, @player.body.y + 5
      @bullet.body.velocity.x = if @playerFacing == 'right' then 300 else -300
      @shoot.play()

    # Enemies
    if @enemiesAlive <= 0
      @newX = Math.floor(Math.random() * 2) + 1
      @new = @enemies.length + @newX;
      for x in [0 .. @newX]
        @enemies.push new EnemyObj(x, @game)
        @enemiesAlive++

    # Lost
    if @lives == 0
      @lives = 3;
      config.scoreThis = @score
      if config.score < @score
        config.score = @score
      @game.state.start 'lost'

  collideEnemy = (enemy, platform) ->
    enemy.body.velocity.x  = if enemy.goD == 'right' then enemy.speed else enemy.speed * -1
    enemy.animations.play 'walking'
    enemy.scale.x = if enemy.goD == 'right' then 1 else -1

  collideWalls = (enemy, walls) ->
    enemy.goD = if enemy.goD == 'right' then 'left' else 'right'

  hitEnemy = (enemy, bullet)->
    @enemiesAlive--
    @enemiesKilled += 1
    @score = if @enemiesKilled == 0 then 1 else @enemiesKilled * 10
    bullet.kill()
    @enemies[enemy.name].kill(@explosion)

  getHit = (enemy, player) ->
    if @lives > 0
      @hearts[@lives - 1].destroy()
      @lives--
      @player.body.x = @game.world.centerX
      @player.body.y = @game.world.centerY;

module.exports = State
