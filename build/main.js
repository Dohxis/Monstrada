(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
  width: 640,
  height: 480,
  score: 0,
  scoreThis: 0,
  images: {
    bg: 'assets/img/bg.png',
    ground: 'assets/img/ground.png',
    platform: 'assets/img/platform.png',
    bullet: 'assets/img/bullet.png',
    heart: 'assets/img/heart.png'
  }
};


},{}],2:[function(require,module,exports){
var State, config;

config = require('./config.coffee');

State = (function() {
  var EnemyObj, collideEnemy, collideWalls, getHit, hitEnemy;

  EnemyObj = function(index, game) {
    this.game = game;
    this.enemy = game.add.sprite(game.world.centerX, 0, 'enemy');
    this.game.physics.enable(this.enemy, Phaser.Physics.ARCADE);
    this.enemy.name = index.toString();
    this.enemy.body.immovable = false;
    this.enemy.body.gravity.y = 800;
    this.enemy.body.bounce.y = 0.2;
    this.enemy.animations.add('walking', [0, 1, 2, 3], 10, true);
    this.enemy.goD = Math.round(Math.random()) === 1 ? 'right' : 'left';
    this.enemy.body.setSize(50, 89);
    return this.enemy.speed = Math.floor(Math.random() * 80) + 30;
  };

  EnemyObj.prototype.kill = function(explosion) {
    explosion.play();
    return this.enemy.kill();
  };

  function State(game) {}

  State.prototype.create = function() {
    var x, _i;
    this.score = 1;
    this.lives = 3;
    this.explosion = this.game.add.audio('explosion', 0.05, false);
    this.jump = this.game.add.audio('jump', 0.05, false);
    this.shoot = this.game.add.audio('shoot', 0.05, false);
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.add.sprite(0, 0, 'bg');
    this.player = this.game.add.sprite(this.game.world.centerX, 400, 'player');
    this.player.scale.setTo(0.8, 0.8);
    this.player.anchor.setTo(0.5, 0.5);
    this.game.physics.arcade.enable(this.player, Phaser.Physics.ARCADE);
    this.player.body.collideWorldBounds = true;
    this.player.body.gravity.y = 800;
    this.player.body.bounce.y = 0.2;
    this.player.animations.add('walking', [0, 1, 2, 3], 10, true);
    this.playerFacing = 'right';
    this.platforms = this.game.add.group();
    this.platforms.enableBody = true;
    this.ground = this.platforms.create(0, this.game.height - 32, 'ground');
    this.ground.body.immovable = true;
    this.platform1 = this.platforms.create(450, this.game.height - 180, 'ground');
    this.platform1.body.immovable = true;
    this.platform2 = this.platforms.create(-450, this.game.height - 180, 'ground');
    this.platform2.body.immovable = true;
    this.platform3 = this.platforms.create(160, this.game.height - 300, 'platform');
    this.platform3.body.immovable = true;
    this.walls = this.game.add.group();
    this.walls.enableBody = true;
    this.wall1 = this.walls.create(25, 0, '');
    this.wall1.scale.setTo(0.01, 20);
    this.wall1.body.immovable = true;
    this.wall1.visable = false;
    this.wall2 = this.walls.create(this.game.world.width + 15, 0, '');
    this.wall2.scale.setTo(0.01, 20);
    this.wall2.body.immovable = true;
    this.wall2.visable = false;
    this.hearts = [];
    this.hearts.push(this.game.add.sprite(5, 3, 'heart'));
    this.hearts.push(this.game.add.sprite(45, 3, 'heart'));
    this.hearts.push(this.game.add.sprite(85, 3, 'heart'));
    this.hearts[0].fixedToCamera = true;
    this.hearts[1].fixedToCamera = true;
    this.hearts[2].fixedToCamera = true;
    this.scoreText = this.game.add.text(this.game.width - 100, 5, "Score: " + this.score.toString());
    this.scoreText.anchor.set(0.5);
    this.scoreText.align = 'center';
    this.scoreText.font = 'Arial Black';
    this.scoreText.fontSize = 40;
    this.scoreText.fontWeight = 'bold';
    this.scoreText.fill = '#4890c3';
    this.scoreText.fixedToCamera = true;
    this.enemiesAlive = 0;
    this.enemiesKilled = 0;
    this.enemies = [];
    for (x = _i = 0; _i <= 2; x = ++_i) {
      this.enemies.push(new EnemyObj(x, this.game));
      this.enemiesAlive++;
    }
    this.bullets = this.game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(100, 'bullet', 0, false);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);
    this.shootTimer = 0;
    this.attackButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.button = this.game.input.keyboard.createCursorKeys();
    return this.jumpTimer = 0;
  };

  State.prototype.update = function() {
    var x, _i, _j, _ref, _ref1;
    this.game.physics.arcade.collide(this.player, this.platforms);
    this.player.body.velocity.x = 0;
    this.scoreText.cameraOffset.x = this.game.world.width - this.scoreText.width + 100;
    this.scoreText.setText("Score: " + this.score.toString());
    for (x = _i = 0, _ref = this.enemies.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; x = 0 <= _ref ? ++_i : --_i) {
      this.game.physics.arcade.collide(this.platforms, this.enemies[x].enemy, collideEnemy, null, this);
      this.game.physics.arcade.collide(this.walls, this.enemies[x].enemy, collideWalls, null, this);
      this.game.physics.arcade.collide(this.bullets, this.enemies[x].enemy, hitEnemy, null, this);
      this.game.physics.arcade.collide(this.player, this.enemies[x].enemy, getHit, null, this);
    }
    if (this.button.right.isDown) {
      this.player.body.velocity.x = 150;
      this.player.animations.play('walking');
      this.player.scale.x *= this.playerFacing === 'right' ? 1 : -1;
      this.playerFacing = 'right';
    } else if (this.button.left.isDown) {
      this.player.body.velocity.x = -150;
      this.player.animations.play('walking');
      this.player.scale.x *= this.playerFacing === 'left' ? 1 : -1;
      this.playerFacing = 'left';
    } else {
      this.player.animations.stop();
      this.player.frame = 0;
    }
    if (this.button.up.isDown && this.game.time.now > this.jumpTimer && this.player.body.onFloor) {
      this.player.body.velocity.y = -500;
      this.jumpTimer = this.game.time.now + 1500;
      this.jump.play();
    }
    if (this.attackButton.isDown && this.game.time.now > this.shootTimer) {
      this.shootTimer = this.game.time.now + 1000;
      this.bullet = this.bullets.getFirstExists(false);
      this.xDir = this.playerFacing === 'right' ? this.player.body.x + 26 : this.player.body.x - 26;
      this.bullet.reset(this.xDir, this.player.body.y + 5);
      this.bullet.body.velocity.x = this.playerFacing === 'right' ? 300 : -300;
      this.shoot.play();
    }
    if (this.enemiesAlive <= 0) {
      this.newX = Math.floor(Math.random() * 2) + 1;
      this["new"] = this.enemies.length + this.newX;
      for (x = _j = 0, _ref1 = this.newX; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; x = 0 <= _ref1 ? ++_j : --_j) {
        this.enemies.push(new EnemyObj(x, this.game));
        this.enemiesAlive++;
      }
    }
    if (this.lives === 0) {
      this.lives = 3;
      config.scoreThis = this.score;
      if (config.score < this.score) {
        config.score = this.score;
      }
      return this.game.state.start('lost');
    }
  };

  collideEnemy = function(enemy, platform) {
    enemy.body.velocity.x = enemy.goD === 'right' ? enemy.speed : enemy.speed * -1;
    enemy.animations.play('walking');
    return enemy.scale.x = enemy.goD === 'right' ? 1 : -1;
  };

  collideWalls = function(enemy, walls) {
    return enemy.goD = enemy.goD === 'right' ? 'left' : 'right';
  };

  hitEnemy = function(enemy, bullet) {
    this.enemiesAlive--;
    this.enemiesKilled += 1;
    this.score = this.enemiesKilled === 0 ? 1 : this.enemiesKilled * 10;
    bullet.kill();
    return this.enemies[enemy.name].kill(this.explosion);
  };

  getHit = function(enemy, player) {
    if (this.lives > 0) {
      this.hearts[this.lives - 1].destroy();
      this.lives--;
      this.player.body.x = this.game.world.centerX;
      return this.player.body.y = this.game.world.centerY;
    }
  };

  return State;

})();

module.exports = State;


},{"./config.coffee":1}],3:[function(require,module,exports){
var LostState, config;

config = require('./config.coffee');

LostState = (function() {
  function LostState(game) {}

  LostState.prototype.create = function() {
    this.explosion = this.game.add.audio('explosion', 0.05, false);
    this.game.add.sprite(0, 0, 'bg');
    this.platforms = this.game.add.group();
    this.platforms.enableBody = true;
    this.platform1 = this.platforms.create(0, 32, 'ground');
    this.platform1.body.immovable = true;
    this.platform1.scale.y *= -1;
    this.platform2 = this.platforms.create(0, this.game.height - 32, 'ground');
    this.platform2.body.immovable = true;
    this.title = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "Your score: " + config.scoreThis.toString());
    this.title.anchor.set(0.5);
    this.title.align = 'center';
    this.title.font = 'Arial Black';
    this.title.fontSize = 25;
    this.title.fontWeight = 'bold';
    this.title.fill = '#4890c3';
    this.title.fixedToCamera = true;
    this.desc = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 75, 'Best score: ' + config.score.toString());
    this.desc.anchor.set(0.5);
    this.desc.align = 'center';
    this.desc.font = 'Arial Black';
    this.desc.fontSize = 50;
    this.desc.fontWeight = 'bold';
    this.desc.fill = '#4890c3';
    this.desc.fixedToCamera = true;
    this.con = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 45, 'Press [Spacebar] to continue');
    this.con.anchor.set(0.5);
    this.con.align = 'center';
    this.con.font = 'Arial Black';
    this.con.fontSize = 25;
    this.con.fontWeight = 'bold';
    this.con.fill = '#4890c3';
    this.con.fixedToCamera = true;
    return this.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  };

  LostState.prototype.update = function() {
    if (this.spaceBar.isDown) {
      return this.game.state.start('game');
    }
  };

  return LostState;

})();

module.exports = LostState;


},{"./config.coffee":1}],4:[function(require,module,exports){
var MenuState, config;

config = require('./config.coffee');

MenuState = (function() {
  function MenuState(game) {}

  MenuState.prototype.preload = function() {
    var imageName, path, _ref;
    this.game.stage = $.extend(this.game.stage, config.stage);
    _ref = config.images;
    for (imageName in _ref) {
      path = _ref[imageName];
      this.game.load.image(imageName, path);
    }
    this.game.load.spritesheet('player', 'assets/img/player.png', 50, 89);
    this.game.load.spritesheet('enemy', 'assets/img/enemy.png', 50, 89);
    this.game.load.audio('music', 'assets/sounds/music.mp3');
    this.game.load.audio('explosion', 'assets/sounds/explosion.wav');
    this.game.load.audio('jump', 'assets/sounds/jump.wav');
    return this.game.load.audio('shoot', 'assets/sounds/shoot.wav');
  };

  MenuState.prototype.create = function() {
    this.music = this.game.add.audio('music');
    this.music.volume = 0.5;
    this.music.loop = true;
    this.music.play();
    this.game.add.sprite(0, 0, 'bg');
    this.platforms = this.game.add.group();
    this.platforms.enableBody = true;
    this.platform1 = this.platforms.create(0, 32, 'ground');
    this.platform1.body.immovable = true;
    this.platform1.scale.y *= -1;
    this.platform2 = this.platforms.create(0, this.game.height - 32, 'ground');
    this.platform2.body.immovable = true;
    this.title = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 45, "Monstrada");
    this.title.anchor.set(0.5);
    this.title.align = 'center';
    this.title.font = 'Arial Black';
    this.title.fontSize = 75;
    this.title.fontWeight = 'bold';
    this.title.fill = '#4890c3';
    this.title.fixedToCamera = true;
    this.desc = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 20, 'Press [Spacebar] to play');
    this.desc.anchor.set(0.5);
    this.desc.align = 'center';
    this.desc.font = 'Arial Black';
    this.desc.fontSize = 25;
    this.desc.fontWeight = 'bold';
    this.desc.fill = '#4890c3';
    this.desc.fixedToCamera = true;
    return this.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  };

  MenuState.prototype.update = function() {
    if (this.spaceBar.isDown) {
      return this.game.state.start('game');
    }
  };

  return MenuState;

})();

module.exports = MenuState;


},{"./config.coffee":1}],5:[function(require,module,exports){
var GameState, LostState, MenuState, config;

MenuState = require('./lib/menu.coffee');

GameState = require('./lib/game.coffee');

LostState = require('./lib/lost.coffee');

config = require('./lib/config.coffee');

$(document).ready(function() {
  var ld;
  ld = new Phaser.Game(config.width, config.height, Phaser.AUTO);
  ld.state.add('menu', MenuState, true);
  ld.state.add('game', GameState, false);
  return ld.state.add('lost', LostState, false);
});


},{"./lib/config.coffee":1,"./lib/game.coffee":2,"./lib/lost.coffee":3,"./lib/menu.coffee":4}]},{},[5]);