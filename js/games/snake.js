/**
 * Terminal Snake — ASCII-style snake game.
 */
(function(window) {
    'use strict';

    window.GameModules = window.GameModules || {};

    window.GameModules.snake = function(opts) {
        var container = opts.container;
        var onScore = opts.onScore || function() {};
        var onGameOver = opts.onGameOver || function() {};
        var destroyed = false;
        var loopId = null;

        var COLS = 20;
        var ROWS = 15;
        var CELL = 20;
        var snake = [{ x: 10, y: 7 }];
        var dir = { x: 1, y: 0 };
        var nextDir = { x: 1, y: 0 };
        var food = spawnFood();
        var score = 0;
        var speed = 120;

        container.innerHTML =
            '<canvas class="snake-canvas" id="snake-canvas" width="' + (COLS * CELL) + '" height="' + (ROWS * CELL) + '"></canvas>' +
            '<div class="snake-controls">Arrow keys to move</div>' +
            '<div class="snake-dpad">' +
            '<div class="snake-dpad-row"><button data-dir="up">&#9650;</button></div>' +
            '<div class="snake-dpad-row"><button data-dir="left">&#9664;</button><button data-dir="down">&#9660;</button><button data-dir="right">&#9654;</button></div>' +
            '</div>';

        var canvas = container.querySelector('#snake-canvas');
        var ctx = canvas.getContext('2d');

        function spawnFood() {
            var pos;
            do {
                pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
            } while (snake.some(function(s) { return s.x === pos.x && s.y === pos.y; }));
            return pos;
        }

        function setDir(nx, ny) {
            if (nx === -dir.x && ny === -dir.y) return;
            nextDir = { x: nx, y: ny };
        }

        function onKey(e) {
            if (destroyed) return;
            switch (e.keyCode) {
                case 37: setDir(-1, 0); e.preventDefault(); break;
                case 38: setDir(0, -1); e.preventDefault(); break;
                case 39: setDir(1, 0); e.preventDefault(); break;
                case 40: setDir(0, 1); e.preventDefault(); break;
            }
        }

        function onDpad(e) {
            var d = e.target.getAttribute('data-dir');
            if (!d) return;
            if (d === 'up') setDir(0, -1);
            if (d === 'down') setDir(0, 1);
            if (d === 'left') setDir(-1, 0);
            if (d === 'right') setDir(1, 0);
        }

        function draw() {
            ctx.fillStyle = '#0d0d0d';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = CELL - 4 + 'px Consolas, monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.fillStyle = '#4ec9b0';
            ctx.fillText('#', food.x * CELL + CELL / 2, food.y * CELL + CELL / 2);

            for (var i = 0; i < snake.length; i++) {
                ctx.fillStyle = i === 0 ? '#fed136' : '#6a9955';
                ctx.fillText('@', snake[i].x * CELL + CELL / 2, snake[i].y * CELL + CELL / 2);
            }
        }

        function tick() {
            if (destroyed) return;
            dir = nextDir;
            var head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

            if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
                endGame();
                return;
            }
            for (var i = 0; i < snake.length; i++) {
                if (snake[i].x === head.x && snake[i].y === head.y) {
                    endGame();
                    return;
                }
            }

            snake.unshift(head);

            if (head.x === food.x && head.y === food.y) {
                score += 10;
                onScore(score);
                food = spawnFood();
                if (speed > 60) speed -= 2;
                clearInterval(loopId);
                loopId = setInterval(tick, speed);
            } else {
                snake.pop();
            }

            draw();
        }

        function endGame() {
            if (destroyed) return;
            destroyed = true;
            clearInterval(loopId);
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#f44747';
            ctx.font = '20px Consolas';
            ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
            onGameOver(score);
        }

        document.addEventListener('keydown', onKey);
        container.querySelector('.snake-dpad').addEventListener('click', onDpad);
        draw();
        loopId = setInterval(tick, speed);

        return function destroy() {
            destroyed = true;
            clearInterval(loopId);
            document.removeEventListener('keydown', onKey);
            container.innerHTML = '';
        };
    };
})(window);
