var W = 30;
var H = 30;
var ALIVE = "alive";
var DEAD = "dead";
var generation_num = 0;
var interval = 200;
var stop = true;
var periodic_border = true;
var grid = {};

function initLifeGame() {
  drawLifeGame();
}

function makeInitialLifeGame(mode) {
  for (var y = 0; y < H; y++)
    for (var x = 0; x < W; x++)
      grid[[x, y]] = DEAD;

  switch(mode) {
    case("random"):
      setRandom();
      break;
    case("glider"):
      setGlider();
      break;
    case("light_space_ship"):
      setLightSpaceShip();
      break;
    case("middle_space_ship"):
      setMiddleSpaceShip();
      break;
    case("heavy_space_ship"):
      setHeavySpaceShip();
      break;
    case("glider_gun"):
      setGriderGun();
      break;
    default:
      break;
  }
}

function drawLifeGame() {
  var ss = [];
  ss.push('<table>');
  for (var y = 0; y < H; y++) {
    ss.push('<tr>');
    for (var x = 0; x < W; x++) {
      ss.push('<td class="');
      ss.push('cell');
      ss.push(' ');
      ss.push(grid[[x, y]]);
      ss.push('" ');
      ss.push('onclick="switchDeadOrAlive(' + x + ',' + y + ');"');
      ss.push('>');
      ss.push('<span class="life"></span>');
      ss.push('</td>');
    }
    ss.push('</tr>');
  }
  ss.push('</table>');

  $('#grid').html(ss.join(""));
  $('#generation_num').text(generation_num);
}

function setRandom() {
  for (var i = 0; i < H*W/5; i++) {
    var x = Math.floor(Math.random() * (W - 1));
    var y = Math.floor(Math.random() * (H - 1));
    grid[[x, y]] = ALIVE;
  }
}

function setGlider() {
  grid[[3, 2]] = ALIVE;
  grid[[4, 3]] = ALIVE;
  grid[[2, 4]] = ALIVE;
  grid[[3, 4]] = ALIVE;
  grid[[4, 4]] = ALIVE;
}

function setLightSpaceShip() {
  grid[[2, 2]] = ALIVE;
  grid[[5, 2]] = ALIVE;
  grid[[6, 3]] = ALIVE;
  grid[[2, 4]] = ALIVE;
  grid[[6, 4]] = ALIVE;
  grid[[3, 5]] = ALIVE;
  grid[[4, 5]] = ALIVE;
  grid[[5, 5]] = ALIVE;
  grid[[6, 5]] = ALIVE;
}

function setMiddleSpaceShip() {
  grid[[4, 2]] = ALIVE;
  grid[[2, 3]] = ALIVE;
  grid[[6, 3]] = ALIVE;
  grid[[7, 4]] = ALIVE;
  grid[[2, 5]] = ALIVE;
  grid[[7, 5]] = ALIVE;
  grid[[3, 6]] = ALIVE;
  grid[[4, 6]] = ALIVE;
  grid[[5, 6]] = ALIVE;
  grid[[6, 6]] = ALIVE;
  grid[[7, 6]] = ALIVE;
}

function setGriderGun() {

}

function switchDeadOrAlive(x, y) {
  grid[[x, y]] = grid[[x, y]] == ALIVE ? DEAD:ALIVE;
  drawLifeGame();
}

function nextGeneration(periodic_border) {
  var ngrid = {}
  for (var y = 0; y < H; y++)
    for (var x = 0; x < W; x++)
      ngrid[[x, y]] = DEAD;

  var dx = [1, 1, 0, -1, -1, -1, 0, 1]
  var dy = [0, 1, 1, 1, 0, -1, -1, -1];
  for (var y = 0; y < H; y++) {
    for (var x = 0; x < W; x++) {
      var count = 0;
      for (var i = 0; i < 8; i++) {
        if (periodic_border) {
          var nx = (x + dx[i] + W) % W, ny = (y + dy[i] + H) % H;
        } else {
          var nx = x + dx[i], ny = y + dy[i];
        }
        if (0 <= nx && nx < W && 0 <= ny && ny < H)
          if (grid[[nx, ny]] == ALIVE)
            count++;
      }

      if (grid[[x, y]] === DEAD && count == 3) {
        ngrid[[x, y]] = ALIVE;
      }
      if (grid[[x, y]] === ALIVE && 2 <= count && count <= 3) {
        ngrid[[x, y]] = ALIVE;
      }
    }
  }

  grid = ngrid;
}

function doLifeGame(interval, periodic_border) {
  nextGeneration(periodic_border);
  generation_num++;
  drawLifeGame(0);
}

function sleepFor(sleepDuration) {
  var now = new Date().getTime();
  while (new Date().getTime() < now + sleepDuration) {};
}

function resetLifeGame(mode) {
  generation_num = 0;
  makeInitialLifeGame(mode);
  drawLifeGame(0);
  if (!stop)
    life_game = setInterval(function() {
      doLifeGame(interval, true);
      }, interval);
}

$('#stop').click(function() {
    stop = true;
    clearInterval(life_game);
    $(this).attr('disabled', 'disabled');
    $('#start').removeAttr('disabled');
  });

$('#start').click(function() {
    stop = false;
    life_game = setInterval(function() {
      doLifeGame(interval, true);
      }, interval);
    $(this).attr('disabled', 'disabled');
    $('#stop').removeAttr('disabled');
  });

$('#random').click(function() {
    if (!stop) clearInterval(life_game);
    resetLifeGame("random");
  });

$('#glider').click(function() {
    if (!stop) clearInterval(life_game);
    resetLifeGame("glider");
  });

$('#lightSS').click(function() {
    if (!stop) clearInterval(life_game);
    resetLifeGame("light_space_ship");
  });

$('#middleSS').click(function() {
    if (!stop) clearInterval(life_game);
    resetLifeGame("middle_space_ship");
  });

$('#clear').click(function() {
    if (!stop) clearInterval(life_game);
    stop = true;
    $('#start').removeAttr('disabled');
    $('#stop').attr('disabled', 'disabled');
    resetLifeGame("");
  });

resetLifeGame("random");
