$(function() {
    var startHeight = $(window).height() - 100;
    $('document').ready(function() {
        $('#screen').height(startHeight);
    });

    function Mario() {
        this.imgSize = 80;
        this.actionSpeed = 150;
        this.moveSpeed = 5;
        this.imgRight = [
            'images/mario_1.png',
            'images/mario_2.png',
            'images/mario_3.png'
        ];
        this.imgLeft = [
            'images/mario_4.png',
            'images/mario_5.png',
            'images/mario_6.png'
        ];
    }
    // 初期表示
    Mario.prototype.init = function() {
        $('#mario').css({
            left: $(window).width() / 2 - this.imgSize / 2,
            top: startHeight - this.imgSize
        });
    };
    // 移動開始
    Mario.prototype.start = function(event) {
        this.move();
        if (event.clientX >= $(window).width() / 2) {
            $('#mario').attr('src', this.imgRight[1]);
        } else {
            $('#mario').attr('src', this.imgLeft[1]);
        }
    };
    // 方向転換処理
    Mario.prototype.turn = function(event) {
        if (this.intervalMoveAction) {
            var m = $('#mario');
            if (event.clientX >= $(window).width() / 2 && this.imgLeft.indexOf(m.attr('src')) >= 0) {
                m.attr('src', this.imgRight[0]);
            }
            if (event.clientX < $(window).width() / 2 && this.imgRight.indexOf(m.attr('src')) >= 0) {
                m.attr('src', this.imgLeft[0]);
            }
        }
    };
    // 移動処理
    Mario.prototype.move = function() {
        if (!this.intervalMoveAction) {
            this.intervalMoveAction = setInterval(this.moveAction.bind(this), this.actionSpeed);
        }
        if (!this.intervalMovePosition) {
            this.intervalMovePosition = setInterval(this.movePosition.bind(this), this.moveSpeed);
        }
    };
    // 移動終了処理
    Mario.prototype.stop = function() {
        clearInterval(this.intervalMoveAction);
        this.intervalMoveAction = null;
        clearInterval(this.intervalMovePosition);
        this.intervalMovePosition = null;

        var m = $('#mario');
        if (this.imgRight.indexOf(m.attr('src'))) {
            m.attr('src', this.imgRight[0]);
        } else {
            m.attr('src', this.imgLeft[0]);
        }
    };
    // マリオの手足を動作させる処理
    Mario.prototype.moveAction = function() {
        var m = $('#mario');
        var src = m.attr('src');
        var right = this.imgRight.indexOf(m.attr('src'));
        var left = this.imgLeft.indexOf(m.attr('src'));
        if (src == this.imgRight[0] || src == this.imgRight[2]) {
            m.attr('src', this.imgRight[1]);
        } else if (src == this.imgRight[1]) {
            m.attr('src', this.imgRight[2]);
        }
        if (src == this.imgLeft[0] || src == this.imgLeft[2]) {
            m.attr('src', this.imgLeft[1]);
        } else if (src == this.imgLeft[1]) {
            m.attr('src', this.imgLeft[2]);
        }
    };
    // マリオの位置を移動する処理
    Mario.prototype.movePosition = function() {
        var m = $('#mario');
        var rightEnd = $(window).width() - this.imgSize;
        if (this.imgRight.indexOf(m.attr('src')) >= 0) {
            if (parseInt(m.css('left')) < rightEnd) {
                m.css({left: parseInt(m.css('left')) + 1});
            }
        } else {
            if (parseInt(m.css('left')) > 0) {
                m.css({left: parseInt(m.css('left')) - 1});
            }
        }
    };

    var mario = new Mario();
    mario.init();

    $(document).on('mousedown', 'html', function(event) {
        mario.start(event);
    });
    $(document).on('mousemove', 'html', function(event) {
        mario.turn(event);
    });
    $(document).on('mouseup', 'html', function() {
        mario.stop();
    });
});
