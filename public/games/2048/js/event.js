function event(game) {

    var down = false;
    var gameContainer = $('.game-container')[0];

    // KLAVYE KONTROLLERİ
    on(window, 'keydown', function (e) {
        if (down) return;
        down = true;
        var num = e.keyCode - 37;
        if (num >= 0 && num <= 3) {
            game.move(num);
        }
    });

    on(window, 'keyup', function () {
        down = false;
    });

    // MOBİL DOKUNMATİK KONTROLLERİ
    touchMoveDir(gameContainer, 15, function (dir) {
        game.move(dir);
    });

    // TÜM YENİDEN BAŞLAT BUTONLARI İÇİN OLAY DİNLEYİCİ
    var restartButtons = $('.restart-btn');
    for (var i = 0; i < restartButtons.length; i++) {
        on(restartButtons[i], 'click', function (e) {
            e.preventDefault();
            game.restart();
        });
    }

    on(window, 'resize', function () {
        game.view.resize();
    });

    // Otomatik test
    var autoTest = false;

    if (autoTest) {
        (function () {
            var timer = setInterval(function () {
                var moveInfo = game.move(random(0, 3));
                if (!moveInfo) {
                    clearInterval(timer);
                }
            }, 20);
        })();
    }
}