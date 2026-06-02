/**
 * Game registry: lazy-load scripts and manage game lifecycle.
 */
(function(window) {
    'use strict';

    var GAMES = {
        typer: {
            name: 'type.js',
            prompt: '$ node type.js',
            script: 'js/games/typer.js',
            scoreKey: 'game_typer_best'
        },
        snake: {
            name: 'snake.js',
            prompt: '$ node snake.js',
            script: 'js/games/snake.js',
            scoreKey: 'game_snake_best'
        },
        merge2048: {
            name: '2048.diff',
            prompt: '$ git diff --merge',
            script: 'js/games/merge2048.js',
            scoreKey: 'game_2048_best'
        },
        minesweeper: {
            name: 'debug.grid',
            prompt: '$ hexdump -C memory',
            script: 'js/games/minesweeper.js',
            scoreKey: 'game_mine_best'
        }
    };

    var loadedScripts = {};
    var currentGame = null;
    var currentDestroy = null;

    function init() {
        var cards = document.querySelectorAll('.game-card[data-game]');
        for (var i = 0; i < cards.length; i++) {
            cards[i].addEventListener('click', onCardClick);
            cards[i].addEventListener('keydown', function(e) {
                if (e.keyCode === 13 || e.keyCode === 32) {
                    e.preventDefault();
                    onCardClick.call(this, e);
                }
            });
        }

        var modal = document.getElementById('game-modal');
        if (modal) {
            $(modal).on('hidden.bs.modal', function() {
                destroyCurrent();
            });
        }
    }

    function onCardClick() {
        var gameId = this.getAttribute('data-game');
        if (gameId) {
            launchGame(gameId);
        }
    }

    function getBaseUrl() {
        return window.SITE_BASEURL || '';
    }

    function scriptUrl(src) {
        var base = getBaseUrl();
        if (base && base.charAt(base.length - 1) === '/') {
            base = base.slice(0, -1);
        }
        return (base ? base + '/' : '/') + src.replace(/^\//, '');
    }

    function launchGame(gameId) {
        var config = GAMES[gameId];
        if (!config) return;

        destroyCurrent();

        var modal = document.getElementById('game-modal');
        var area = document.getElementById('game-area');
        var prompt = document.getElementById('game-prompt');
        var tabs = document.getElementById('game-tabs');
        var scoreEl = document.getElementById('game-score');

        if (!modal || !area) return;

        area.innerHTML = '<p style="color:#888;text-align:center;padding:40px;">Loading...</p>';
        if (prompt) prompt.textContent = config.prompt;
        if (tabs) tabs.innerHTML = '<span class="terminal-tab">' + config.name + '</span>';
        updateScore(scoreEl, 0, config.scoreKey);

        $(modal).modal('show');

        if (window.Stealth) {
            window.Stealth.setGameActive(true);
        }

        loadScript(config.script, function() {
            var factory = window.GameModules && window.GameModules[gameId];
            if (!factory) {
                area.innerHTML = '<p style="color:#f44747;">Failed to load game.</p>';
                return;
            }
            currentGame = gameId;
            currentDestroy = factory({
                container: area,
                onScore: function(score) {
                    updateScore(scoreEl, score, config.scoreKey);
                },
                onGameOver: function(score) {
                    saveBest(config.scoreKey, score);
                    updateScore(scoreEl, score, config.scoreKey);
                }
            });
        });
    }

    function loadScript(src, callback) {
        if (loadedScripts[src]) {
            callback();
            return;
        }
        var script = document.createElement('script');
        script.src = scriptUrl(src);
        script.onload = function() {
            loadedScripts[src] = true;
            callback();
        };
        script.onerror = function() {
            var area = document.getElementById('game-area');
            if (area) {
                area.innerHTML = '<p style="color:#f44747;">Script load failed: ' + src + '</p>';
            }
        };
        document.body.appendChild(script);
    }

    function updateScore(el, score, scoreKey) {
        if (!el) return;
        var best = getBest(scoreKey);
        var text = 'score: ' + score;
        if (best > 0) {
            text += ' | best: ' + best;
        }
        el.textContent = text;
    }

    function getBest(key) {
        try {
            return parseInt(localStorage.getItem(key), 10) || 0;
        } catch (e) {
            return 0;
        }
    }

    function saveBest(key, score) {
        try {
            var best = getBest(key);
            if (score > best) {
                localStorage.setItem(key, String(score));
            }
        } catch (e) { /* ignore */ }
    }

    function destroyCurrent() {
        if (typeof currentDestroy === 'function') {
            try {
                currentDestroy();
            } catch (e) { /* ignore */ }
        }
        currentDestroy = null;
        currentGame = null;
        var area = document.getElementById('game-area');
        if (area) area.innerHTML = '';
    }

    window.GameRegistry = {
        init: init,
        launch: launchGame,
        destroyCurrent: destroyCurrent,
        getBest: getBest,
        saveBest: saveBest
    };

    window.GameModules = window.GameModules || {};

    $(function() {
        init();
    });
})(window);
