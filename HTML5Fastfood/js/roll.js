function roll(stringParm) {

    var _canvas = document.createElement("canvas");
    _canvas.height = 300;
    _canvas.width = 100;
    var _context = _canvas.getContext("2d");

    var _y = 0;
    var _yadd = 0;
    var _isStopped = true;
    var _result = '0';
    var _visibleImages = [];
    var _index = 0;
    var _winLine = 0;

    var createImage = function (src) {
        var img = new Image();
        img.src = src;
        return img;
    }

    var _overlayTopImage = createImage("images/overlay_top.png");
    var _overlayBottomImage = createImage("images/overlay_bottom.png");

    var _imagesString = stringParm.split(',');
    var _images = new Array();
    for (var i = 0; i < _imagesString.length; i++) {
        _images.push(createImage("images/" + _imagesString[i] + ".png"));
    }

    this.Result = function () {
        return _result;
    }

    this.Stop = function () {
        _isStopped = true;
    }

    this.Start = function () {
        _result = '0';
        _isStopped = false;
        _yadd = 25;
        _y = -_images[0].height;
    }
    
    this.Draw = function () {

        _context.clearRect(0, 0, _canvas.width, _canvas.height);

        _y = _y + _yadd;

        if (_y >= 0) {
            if (_isStopped) {
                _yadd = 0;
            }
            _y = -_images[0].height;

            _index--;
            if (_index < 0)
                _index = _imagesString.length - 1;
            var index0 = _index - 1;
            if (index0 < 0)
                index0 = _imagesString.length - 1;
            var index3 = _index + 2;
            if (index3 > _imagesString.length - 1) {
                index3 = 0;
            }
            var index2 = _index + 1;
            if (index2 > _imagesString.length - 1) {
                index2 = 0;
                index3 = 1;
            }
            _winLine = index2;
            
            _visibleImages[0] = _images[index0];
            _visibleImages[1] = _images[_index];
            _visibleImages[2] = _images[index2];
            _visibleImages[3] = _images[index3];
        }        

        for (var i = 0; i < _visibleImages.length; i++) {
            var y = _y + (i * _visibleImages[i].height);
            _context.drawImage(_visibleImages[i], 0, y);
            if (y == _canvas.height / 3 && _yadd == 0 && _isStopped) {
                _result = _imagesString[_winLine];
            }
        }

        _context.drawImage(_overlayTopImage, 0, 0);
        _context.drawImage(_overlayBottomImage, 0, 200);

        return _canvas;
    }
}