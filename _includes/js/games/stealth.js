/**
 * Stealth layer: Boss Key, title switching, mute enforcement.
 */
(function(window) {
    'use strict';

    var ORIGINAL_TITLE = document.title;
    var GAME_TITLE = 'Jason - Blog';
    var BOSS_TITLES = [
        'Stack Overflow - Java garbage collection - Stack Overflow',
        'GitHub - jasonsoso/jvm-notes',
        'Understanding JVM GC | Jason Blog'
    ];
    var bossIndex = 0;
    var bossActive = false;
    var gameActive = false;
    var muted = true;

    var overlay = null;
    var modal = null;

    function init() {
        overlay = document.getElementById('boss-overlay');
        modal = document.getElementById('game-modal');

        document.addEventListener('keydown', onKeyDown, true);

        if (modal) {
            $(modal).on('hidden.bs.modal', onModalHidden);
        }

        var helpClose = document.getElementById('game-help-close');
        if (helpClose) {
            helpClose.addEventListener('click', hideHelp);
        }
    }

    function onKeyDown(e) {
        if (e.keyCode === 27) {
            if (isHelpVisible()) {
                hideHelp();
                e.preventDefault();
                return;
            }
            if (bossActive) {
                deactivateBoss();
                e.preventDefault();
                return;
            }
            if (gameActive && modal) {
                $(modal).modal('hide');
                e.preventDefault();
            }
            return;
        }

        if (e.ctrlKey && e.shiftKey && (e.keyCode === 66 || e.key === 'B')) {
            e.preventDefault();
            toggleBoss();
            return;
        }

        if (e.key === '?' && gameActive && !bossActive) {
            e.preventDefault();
            toggleHelp();
        }
    }

    function toggleBoss() {
        if (bossActive) {
            deactivateBoss();
        } else if (gameActive) {
            activateBoss();
        }
    }

    function activateBoss() {
        if (!overlay) return;
        bossActive = true;
        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
        document.title = BOSS_TITLES[bossIndex % BOSS_TITLES.length];
        bossIndex++;
        if (modal) {
            modal.style.visibility = 'hidden';
        }
    }

    function deactivateBoss() {
        if (!overlay) return;
        bossActive = false;
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
        if (gameActive) {
            document.title = GAME_TITLE;
        } else {
            document.title = ORIGINAL_TITLE;
        }
        if (modal && gameActive) {
            modal.style.visibility = '';
        }
    }

    function onModalHidden() {
        gameActive = false;
        deactivateBoss();
        hideHelp();
        document.title = ORIGINAL_TITLE;
        if (window.GameRegistry) {
            window.GameRegistry.destroyCurrent();
        }
    }

    function setGameActive(active) {
        gameActive = active;
        document.title = active ? GAME_TITLE : ORIGINAL_TITLE;
    }

    function isHelpVisible() {
        var help = document.getElementById('game-help');
        return help && help.classList.contains('active');
    }

    function toggleHelp() {
        if (isHelpVisible()) {
            hideHelp();
        } else {
            showHelp();
        }
    }

    function showHelp() {
        var help = document.getElementById('game-help');
        if (help) {
            help.classList.add('active');
            help.setAttribute('aria-hidden', 'false');
        }
    }

    function hideHelp() {
        var help = document.getElementById('game-help');
        if (help) {
            help.classList.remove('active');
            help.setAttribute('aria-hidden', 'true');
        }
    }

    function playSound() {
        /* muted by design — no audio */
        if (!muted) return;
    }

    window.Stealth = {
        init: init,
        setGameActive: setGameActive,
        isBossActive: function() { return bossActive; },
        isGameActive: function() { return gameActive; },
        playSound: playSound,
        muted: true
    };

    $(function() {
        init();
    });
})(window);
