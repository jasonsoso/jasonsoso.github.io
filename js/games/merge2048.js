/**
 * Merge Diff — 2048 styled as git diff hashes.
 */
(function(window) {
    'use strict';

    var LABELS = {
        0: '',
        2: 'a1b2',
        4: 'c3d4',
        8: 'e5f6',
        16: '+01',
        32: '+02',
        64: '+04',
        128: '+08',
        256: '+16',
        512: '+32',
        1024: '+64',
        2048: 'win!'
    };

    window.GameModules = window.GameModules || {};

    window.GameModules.merge2048 = function(opts) {
        var container = opts.container;
        var onScore = opts.onScore || function() {};
        var onGameOver = opts.onGameOver || function() {};
        var destroyed = false;

        var grid = createGrid();
        var score = 0;
        var over = false;

        container.innerHTML =
            '<div class="merge2048-grid" id="merge-grid"></div>' +
            '<div class="merge2048-info">Arrow keys to merge diff chunks</div>' +
            '<div class="merge2048-over" id="merge-over" style="display:none;"></div>';

        var gridEl = container.querySelector('#merge-grid');
        var overEl = container.querySelector('#merge-over');

        function createGrid() {
            var g = [];
            for (var r = 0; r < 4; r++) {
                g[r] = [0, 0, 0, 0];
            }
            addTile(g);
            addTile(g);
            return g;
        }

        function emptyCells(g) {
            var cells = [];
            for (var r = 0; r < 4; r++) {
                for (var c = 0; c < 4; c++) {
                    if (g[r][c] === 0) cells.push({ r: r, c: c });
                }
            }
            return cells;
        }

        function addTile(g) {
            var empty = emptyCells(g);
            if (empty.length === 0) return;
            var cell = empty[Math.floor(Math.random() * empty.length)];
            g[cell.r][cell.c] = Math.random() < 0.9 ? 2 : 4;
        }

        function render() {
            var html = '';
            for (var r = 0; r < 4; r++) {
                for (var c = 0; c < 4; c++) {
                    var v = grid[r][c];
                    html += '<div class="merge2048-cell' + (v ? ' val-' + v : '') + '">' + (LABELS[v] || v) + '</div>';
                }
            }
            gridEl.innerHTML = html;
            onScore(score);
        }

        function slide(row) {
            var arr = row.filter(function(v) { return v !== 0; });
            var merged = [];
            var gained = 0;
            var i = 0;
            while (i < arr.length) {
                if (i + 1 < arr.length && arr[i] === arr[i + 1]) {
                    var nv = arr[i] * 2;
                    merged.push(nv);
                    gained += nv;
                    i += 2;
                } else {
                    merged.push(arr[i]);
                    i++;
                }
            }
            while (merged.length < 4) merged.push(0);
            return { row: merged, gained: gained, changed: merged.join() !== row.join() };
        }

        function move(direction) {
            if (over || destroyed) return;
            var changed = false;
            var gained = 0;
            var r, c, result;

            if (direction === 'left' || direction === 'right') {
                for (r = 0; r < 4; r++) {
                    var row = grid[r].slice();
                    if (direction === 'right') row.reverse();
                    result = slide(row);
                    if (direction === 'right') result.row.reverse();
                    gained += result.gained;
                    if (result.changed) changed = true;
                    grid[r] = result.row;
                }
            } else {
                for (c = 0; c < 4; c++) {
                    var col = [];
                    for (r = 0; r < 4; r++) col.push(grid[r][c]);
                    if (direction === 'down') col.reverse();
                    result = slide(col);
                    if (direction === 'down') result.row.reverse();
                    gained += result.gained;
                    if (result.changed) changed = true;
                    for (r = 0; r < 4; r++) grid[r][c] = result.row[r];
                }
            }

            if (changed) {
                score += gained;
                addTile(grid);
                render();
                if (!canMove()) {
                    over = true;
                    overEl.style.display = 'block';
                    overEl.textContent = 'No more merges. Final score: ' + score;
                    onGameOver(score);
                }
            }
        }

        function canMove() {
            if (emptyCells(grid).length > 0) return true;
            var r, c;
            for (r = 0; r < 4; r++) {
                for (c = 0; c < 4; c++) {
                    var v = grid[r][c];
                    if (c < 3 && grid[r][c + 1] === v) return true;
                    if (r < 3 && grid[r + 1][c] === v) return true;
                }
            }
            return false;
        }

        function onKey(e) {
            if (destroyed) return;
            switch (e.keyCode) {
                case 37: move('left'); e.preventDefault(); break;
                case 38: move('up'); e.preventDefault(); break;
                case 39: move('right'); e.preventDefault(); break;
                case 40: move('down'); e.preventDefault(); break;
            }
        }

        var touchStart = null;
        function onTouchStart(e) {
            touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        function onTouchEnd(e) {
            if (!touchStart) return;
            var dx = e.changedTouches[0].clientX - touchStart.x;
            var dy = e.changedTouches[0].clientY - touchStart.y;
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
                move(dx > 0 ? 'right' : 'left');
            } else if (Math.abs(dy) > 30) {
                move(dy > 0 ? 'down' : 'up');
            }
            touchStart = null;
        }

        document.addEventListener('keydown', onKey);
        gridEl.addEventListener('touchstart', onTouchStart, { passive: true });
        gridEl.addEventListener('touchend', onTouchEnd, { passive: true });
        render();

        return function destroy() {
            destroyed = true;
            document.removeEventListener('keydown', onKey);
            gridEl.removeEventListener('touchstart', onTouchStart);
            gridEl.removeEventListener('touchend', onTouchEnd);
            container.innerHTML = '';
        };
    };
})(window);
