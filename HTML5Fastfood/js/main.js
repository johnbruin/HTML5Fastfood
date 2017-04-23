$(document).ready(function () {

    var _rolls = [];
    var _score = 0;
    var _description;
    var _prize = 0;
    var _hasSpinned = false;

    function start() {
        init();
        draw();
    }

    var delay = (function () {
        var timer = 0;
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();

    var mainCanvas;
    var mainContext;
    function init() {

        _score = 2500;

        mainCanvas = document.getElementById('canvasMain');
        mainContext = mainCanvas.getContext('2d');
        $('#canvasMain').css('background-color', '#000000');

        _rolls.push(new roll("1,6,2,3,4,5,6,4"));
        _rolls.push(new roll("6,5,4,3,6,2,1,4"));
        _rolls.push(new roll("3,4,6,2,1,6,5,4"));

        $("#startButton").click(function () {
            if (_score == 0) {
                _score = 2500;
            }
            _score = _score - 25;

            _description = "3x = WIN";

            _rolls[0].Start();
            _rolls[1].Start();
            _rolls[2].Start();

            var delayFactor = 50;
            delay(function () {
                _rolls[0].Stop();

                delay(function () {
                    _rolls[1].Stop();

                    delay(function () {
                        _rolls[2].Stop();
                    }, delayFactor * (Math.floor(Math.random() * 15) + 10));

                }, delayFactor * (Math.floor(Math.random() * 15) + 10));

            }, delayFactor * (Math.floor(Math.random() * 15) + 10));
            _hasSpinned = true;
        });
    }

    Number.prototype.pad = function (size) {
        var s = String(this);
        while (s.length < (size || 2)) { s = "0" + s; }
        return s;
    }

    var then = Date.now();
    var fps = 40;

    var _red = 255;
    var _red_add = -2;
    var _green = 255;
    var _green_add = -5;
    var _blue = 255;
    var _blue_addd = -5;
    function draw() {
        requestAnimationFrame(draw);

        var now = Date.now();
        var delta = now - then;
        var interval = 1000 / fps;
        if (delta > interval) {
            then = now - (delta % interval);

            mainContext.drawImage(_rolls[0].Draw(), 10, 10, 100, 300);
            mainContext.drawImage(_rolls[1].Draw(), 120, 10, 100, 300);
            mainContext.drawImage(_rolls[2].Draw(), 230, 10, 100, 300);
        }

        if (_prize > 0)
        {
            _hasSpinned = false;
            $("#startButton").prop("disabled", true);
            _score = _score + 1;
            _prize = _prize - 1;

            if (_red > 255 || _red < 248) {
                _red_add = -_red_add;
            }
            _red = _red - _red_add;

            if (_green > 255 || _green < 30) {
                _green_add = -_green_add;
            }
            _green = _green - _green_add;

            if (_blue > 255 || _blue < 150) {
                _blue_addd = -_blue_addd;
            }
            _blue = _blue - _blue_addd;

            $('#win').css('color', 'rgb(' + _red + ', ' + _green + ', ' + _blue + ')');
        }
        else
        {
            $('#win').css('color', 'rgb(255, 255, 255)');
            $("#startButton").prop("disabled", false);
            if (_score <= 0) {
                _description = "GAME OVER";
                _score = 0;
            }
            else {
                if (_hasSpinned && _rolls[0].Result() == _rolls[1].Result() && _rolls[1].Result() == _rolls[2].Result()) {
                    switch (_rolls[0].Result()) {
                        case '1':
                            _description = "Big Mac 495 kcal";
                            _prize = 495;
                            break;
                        case '2':
                            _description = "Filet-O-Fish 350 kcal";
                            _prize = 350;
                            break;
                        case '3':
                            _description = "Medium Frites 340 kcal";
                            _prize = 340;
                            break;
                        case '4':
                            _description = "Mc Nuggets 250 kcal";
                            _prize = 250;
                            break;
                        case '5':
                            _description = "Milkshake 355 kcal";
                            _prize = 355;
                            break;
                        case '6':
                            _description = "Sundae Ice 275 kcal";
                            _prize = 275;
                            break;
                    }
                }
                else {
                    _description = "3x = WIN";
                }
            }
        }
        $("#score").html(_score.pad(6) + "<br />kcal");
        $("#win").html(_description);
    }

    start();
});