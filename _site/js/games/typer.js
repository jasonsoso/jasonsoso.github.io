/**
 * Code Typer — type code snippets for WPM score.
 */
(function(window) {
    'use strict';

    var SNIPPETS = [
        'public static void main(String[] args) {',
        'List<String> items = new ArrayList<>();',
        'Optional<User> user = repo.findById(id);',
        'stream.filter(x -> x > 0).map(String::valueOf);',
        'const result = await fetch(url, { method: "GET" });',
        'if (response.status === 200) return response.json();',
        'try { conn = dataSource.getConnection(); }',
        '@Override public void run() { executor.submit(task); }',
        'Map<String, Object> map = new HashMap<>(16);',
        'logger.info("Processing batch {}", batchId);'
    ];

    window.GameModules = window.GameModules || {};

    window.GameModules.typer = function(opts) {
        var container = opts.container;
        var onScore = opts.onScore || function() {};
        var onGameOver = opts.onGameOver || function() {};
        var destroyed = false;
        var timer = null;

        var snippetIndex = 0;
        var charIndex = 0;
        var correctChars = 0;
        var totalChars = 0;
        var snippetsDone = 0;
        var timeLeft = 60;
        var started = false;

        container.innerHTML =
            '<div class="typer-game">' +
            '<div class="typer-stats">' +
            '<span>time: <b id="typer-time">60</b>s</span>' +
            '<span>wpm: <b id="typer-wpm">0</b></span>' +
            '<span>acc: <b id="typer-acc">100</b>%</span>' +
            '<span>done: <b id="typer-done-count">0</b></span>' +
            '</div>' +
            '<div class="typer-code" id="typer-display"></div>' +
            '<input type="text" class="typer-input" id="typer-input" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Start typing...">' +
            '</div>';

        var display = container.querySelector('#typer-display');
        var input = container.querySelector('#typer-input');
        var timeEl = container.querySelector('#typer-time');
        var wpmEl = container.querySelector('#typer-wpm');
        var accEl = container.querySelector('#typer-acc');
        var doneEl = container.querySelector('#typer-done-count');

        function getSnippet() {
            return SNIPPETS[snippetIndex % SNIPPETS.length];
        }

        function renderSnippet() {
            var text = getSnippet();
            var html = '';
            for (var i = 0; i < text.length; i++) {
                var cls = 'typer-char';
                if (i < charIndex) {
                    cls += input.value[i] === text[i] ? ' correct' : ' incorrect';
                } else if (i === charIndex) {
                    cls += ' current';
                }
                html += '<span class="' + cls + '">' + escapeHtml(text[i]) + '</span>';
            }
            display.innerHTML = html;
        }

        function escapeHtml(c) {
            if (c === '<') return '&lt;';
            if (c === '>') return '&gt;';
            if (c === '&') return '&amp;';
            return c;
        }

        function calcWpm() {
            var elapsed = 60 - timeLeft;
            if (elapsed <= 0) return 0;
            return Math.round((correctChars / 5) / (elapsed / 60));
        }

        function calcAcc() {
            if (totalChars === 0) return 100;
            return Math.round((correctChars / totalChars) * 100);
        }

        function updateStats() {
            timeEl.textContent = timeLeft;
            wpmEl.textContent = calcWpm();
            accEl.textContent = calcAcc();
            doneEl.textContent = snippetsDone;
            onScore(snippetsDone * 10 + calcWpm());
        }

        function nextSnippet() {
            snippetIndex++;
            charIndex = 0;
            snippetsDone++;
            input.value = '';
            renderSnippet();
            updateStats();
        }

        function onInput() {
            if (!started) {
                started = true;
                timer = setInterval(tick, 1000);
            }

            var text = getSnippet();
            var val = input.value;
            charIndex = val.length;

            if (val.length > 0) {
                var lastIdx = val.length - 1;
                totalChars++;
                if (val[lastIdx] === text[lastIdx]) {
                    correctChars++;
                }
            }

            renderSnippet();

            if (val === text) {
                nextSnippet();
            }

            updateStats();
        }

        function tick() {
            if (destroyed) return;
            timeLeft--;
            updateStats();
            if (timeLeft <= 0) {
                endGame();
            }
        }

        function endGame() {
            if (destroyed) return;
            destroyed = true;
            clearInterval(timer);
            input.disabled = true;
            var wpm = calcWpm();
            var score = snippetsDone * 10 + wpm;
            container.querySelector('.typer-game').insertAdjacentHTML('beforeend',
                '<div class="typer-done">Time\'s up! WPM: ' + wpm + ' | Snippets: ' + snippetsDone + '</div>');
            onGameOver(score);
        }

        input.addEventListener('input', onInput);
        renderSnippet();
        setTimeout(function() { input.focus(); }, 300);

        return function destroy() {
            destroyed = true;
            clearInterval(timer);
            input.removeEventListener('input', onInput);
            container.innerHTML = '';
        };
    };
})(window);
