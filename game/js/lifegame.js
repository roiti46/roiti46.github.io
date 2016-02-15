(function() {
  var W = 20; // be bigger after
  var H = 20;
  var ALIVE = "alive";
  var DEAD = "dead";
  var generation_num = 0;
  var interval = 200;

  function initLifeGame() {
    drawLifeGame();
  }

  function makeInitialLifeGame() {
    var grid = {};
    for (var y = 0; y < H; y++)
      for (var x = 0; x < W; x++)
        grid[[x, y]] = DEAD;

    var glider = true;
    var glider_gun = false;
    var die_hard = false;
    if (glider) {
      grid = setGlider(grid);
    }
    if (glider_gun) {
      grid = setGlider(grid);
    }
    if (die_hard) {
      grid = setGlider(grid);
    }
    for (var i = 0; i < H*W/10; i++) {
      var x = Math.floor(Math.random() * (W - 1));
      var y = Math.floor(Math.random() * (H - 1));
      grid[[x, y]] = ALIVE;
    }
    return grid;
  }

  function drawLifeGame(grid) {
    var ss = [];
    ss.push('<table>');
    for (var y = 0; y < H; y++) {
      ss.push('<tr>');
      for (var x = 0; x < W; x++) {
        ss.push('<td class="');
        ss.push('cell');
        ss.push(' ');
        ss.push(grid[[x, y]]);
        ss.push('">');
        ss.push('<span class="life"></span>');
        ss.push('</td>');
      }
      ss.push('</tr>');
    }
    ss.push('</table>');

    $('#grid').html(ss.join(""));
    $('#generation_num').text(generation_num);
  }

  function setGlider(grid) {
    grid[[1, 0]] = ALIVE;
    grid[[2, 1]] = ALIVE;
    grid[[0, 2]] = ALIVE;
    grid[[
      1, 2]] = ALIVE;
    grid[[2, 2]] = ALIVE;
    return grid;
  }

  function setGriderGun() {

  }

  function setDieHard() {

  }

  function nextGeneration(grid, periodic_border) {
    var ngrid = {}
    for (var y = 0; y < H; y++)
      for (var x = 0; x < W; x++)
        ngrid[[x, y]] = DEAD;

    var dx = [1, 1, 0, -1, -1, -1, 0, 1], dy = [0, 1, 1, 1, 0, -1, -1, -1];
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

    return ngrid;
  }
  
  function doLifeGame(grid, interval, periodic_border) {
    grid = nextGeneration(grid, periodic_border);
    generation_num++;
    drawLifeGame(grid, 0);
    return grid;
  }
  
  function sleepFor(sleepDuration) {
    var now = new Date().getTime();
    while (new Date().getTime() < now + sleepDuration) {};
  }

  function resetLifeGame() {
    generation_num = 0;
    grid = makeInitialLifeGame();
    drawLifeGame(grid, 0);
    life_game = setInterval(function() {
      grid = doLifeGame(grid, interval, true);
      }, interval);
  }

  $('#stop').click(function() {
      clearInterval(life_game);
      $(this).attr('disabled', 'disabled');
      $('#start').removeAttr('disabled');
    });

  $('#start').click(function() {
      life_game = setInterval(function() {
        grid = doLifeGame(grid, interval, true);
        }, interval);
      $(this).attr('disabled', 'disabled');
      $('#stop').removeAttr('disabled');
    });

  $('#reset').click(function() {
      clearInterval(life_game);
      $('#start').attr('disabled', 'disabled');
      $('#stop').removeAttr('disabled');
      resetLifeGame();
    });

  resetLifeGame();
})();
