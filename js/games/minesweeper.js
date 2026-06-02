/**
 * Debug Grid — minesweeper styled as hex dump.
 */
(function(window) {
    'use strict';

    var SIZE = 9;
    var MINES = 10;

    window.GameModules = window.GameModules || {};

    window.GameModules.minesweeper = function(opts) {
        var container = opts.container;
        var onScore = opts.onScore || function() {};
        var onGameOver = opts.onGameOver || function() {};
        var destroyed = false;

        var grid = [];
        var revealed = [];
        var flagged = [];
        var gameOver = false;
        var won = false;
        var score = 0;

        container.innerHTML =
            '<div class="minesweeper-wrap">' +
            '<div class="minesweeper-info">Left click: reveal | Right click: flag | ' + MINES + ' mines</div>' +
            '<div class="minesweeper-grid" id="mine-grid"></div>' +
            '<div class="minesweeper-status" id="mine-status"></div>' +
            '</div>';

        var gridEl = container.querySelector('#mine-grid');
        var statusEl = container.querySelector('#mine-status');

        function init() {
            grid = [];
            revealed = [];
            flagged = [];
            gameOver = false;
            won = false;
            score = 0;

            for (var r = 0; r < SIZE; r++) {
                grid[r] = [];
                revealed[r] = [];
                flagged[r] = [];
                for (var c = 0; c < SIZE; c++) {
                    grid[r][c] = 0;
                    revealed[r][c] = false;
                    flagged[r][c] = false;
                }
            }

            var placed = 0;
            while (placed < MINES) {
                var mr = Math.floor(Math.random() * SIZE);
                var mc = Math.floor(Math.random() * SIZE);
                if (grid[mr][mc] !== -1) {
                    grid[mr][mc] = -1;
                    placed++;
                }
            }

            for (var r2 = 0; r2 < SIZE; r2++) {
                for (var c2 = 0; c2 < SIZE; c2++) {
                    if (grid[r2][c2] === -1) continue;
                    var count = 0;
                    for (var dr = -1; dr <= 1; dr++) {
                        for (var dc = -1; dc <= 1; dc++) {
                            var nr = r2 + dr, nc = c2 + dc;
                            if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && grid[nr][nc] === -1) count++;
                        }
                    }
                    grid[r2][c2] = count;
                }
            }

            render();
            statusEl.textContent = '';
            onScore(score);
        }

        function hexLabel(r, c) {
            var h = ((r * SIZE + c) & 0xFF).toString(16).toUpperCase();
            if (h.length < 2) h = '0' + h;
            return '0x' + h;
        }

        function render() {
            var html = '';
            for (var r = 0; r < SIZE; r++) {
                for (var c = 0; c < SIZE; c++) {
                    var cls = 'mine-cell';
                    var text = hexLabel(r, c);

                    if (flagged[r][c]) {
                        cls += ' flagged';
                        text = 'F';
                    } else if (revealed[r][c]) {
                        cls += ' revealed';
                        if (grid[r][c] === -1) {
                            cls += ' mine-hit';
                            text = 'XX';
                        } else if (grid[r][c] > 0) {
                            cls += ' num-' + grid[r][c];
                            text = String(grid[r][c]);
                        } else {
                            text = '..';
                        }
                    }

                    html += '<div class="' + cls + '" data-r="' + r + '" data-c="' + c + '">' + text + '</div>';
                }
            }
            gridEl.innerHTML = html;
        }

        function reveal(r, c) {
            if (gameOver || revealed[r][c] || flagged[r][c]) return;

            revealed[r][c] = true;
            score++;

            if (grid[r][c] === -1) {
                gameOver = true;
                statusEl.textContent = 'Mine hit! Game over.';
                revealAll();
                onGameOver(score);
                return;
            }

            if (grid[r][c] === 0) {
                for (var dr = -1; dr <= 1; dr++) {
                    for (var dc = -1; dc <= 1; dc++) {
                        var nr = r + dr, nc = c + dc;
                        if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) {
                            reveal(nr, nc);
                        }
                    }
                }
            }

            checkWin();
            render();
            onScore(score);
        }

        function revealAll() {
            for (var r = 0; r < SIZE; r++) {
                for (var c = 0; c < SIZE; c++) {
                    revealed[r][c] = true;
                }
            }
            render();
        }

        function toggleFlag(r, c) {
            if (gameOver || revealed[r][c]) return;
            flagged[r][c] = !flagged[r][c];
            render();
        }

        function checkWin() {
            var safe = SIZE * SIZE - MINES;
            var count = 0;
            for (var r = 0; r < SIZE; r++) {
                for (var c = 0; c < SIZE; c++) {
                    if (revealed[r][c] && grid[r][c] !== -1) count++;
                }
            }
            if (count === safe) {
                won = true;
                gameOver = true;
                score += 50;
                statusEl.textContent = 'All safe cells revealed! You win!';
                onGameOver(score);
            }
        }

        function onClick(e) {
            if (destroyed) return;
            var cell = e.target.closest('.mine-cell');
            if (!cell) return;
            reveal(parseInt(cell.getAttribute('data-r'), 10), parseInt(cell.getAttribute('data-c'), 10));
        }

        function onContext(e) {
            e.preventDefault();
            if (destroyed) return;
            var cell = e.target.closest('.mine-cell');
            if (!cell) return;
            toggleFlag(parseInt(cell.getAttribute('data-r'), 10), parseInt(cell.getAttribute('data-c'), 10));
        }

        gridEl.addEventListener('click', onClick);
        gridEl.addEventListener('contextmenu', onContext);

        var longPressTimer = null;
        gridEl.addEventListener('touchstart', function(e) {
            var cell = e.target.closest('.mine-cell');
            if (!cell) return;
            var r = parseInt(cell.getAttribute('data-r'), 10);
            var c = parseInt(cell.getAttribute('data-c'), 10);
            longPressTimer = setTimeout(function() {
                toggleFlag(r, c);
                longPressTimer = null;
            }, 500);
        }, { passive: true });
        gridEl.addEventListener('touchend', function() {
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
        }, { passive: true });
        gridEl.addEventListener('touchmove', function() {
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
        }, { passive: true });

        init();

        return function destroy() {
            destroyed = true;
            gridEl.removeEventListener('click', onClick);
            gridEl.removeEventListener('contextmenu', onContext);
            container.innerHTML = '';
        };
    };
})(window);
