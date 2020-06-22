$(function() {
    var startHeight = $(window).height() - 100;
    $('document').ready(function() {
        $('#screen').height(startHeight);
    });

    function Mario() {
        this.imgSize = 80;
        this.actionSpeed = 120;
        this.moveSpeed = 3;
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
        this.moveFlg = false;
    }

    /**
     * 初期表示
     */
    Mario.prototype.init = function() {
        $('#mario').css({
            left: $(window).width() / 2 - this.imgSize / 2,
            top: startHeight - this.imgSize
        });
    };

    /**
     * 移動開始
     *
     * @param direction 方向 (left or right)
     */
    Mario.prototype.start = function(direction) {
        this.moveFlg = true;
        this.move();
        if (direction == 'right') {
            $('#mario').attr('src', this.imgRight[1]);
        } else if (direction == 'left') {
            $('#mario').attr('src', this.imgLeft[1]);
        }
    };

    /**
     * 方向転換処理
     *
     * @param direction 方向 (left or right)
     */
    Mario.prototype.turn = function(direction) {
        if (this.intervalMoveAction) {
            var m = $('#mario');
            if (direction == 'right') {
                m.attr('src', this.imgRight[0]);
            } else if (direction == 'left') {
                m.attr('src', this.imgLeft[0]);
            }
        }
    };

    /**
     * 移動処理
     */
    Mario.prototype.move = function() {
        if (!this.intervalMoveAction) {
            this.intervalMoveAction = setInterval(this.moveAction.bind(this), this.actionSpeed);
        }
        if (!this.intervalMovePosition) {
            this.intervalMovePosition = setInterval(this.movePosition.bind(this), this.moveSpeed);
        }
    };

    /**
     * 移動終了処理
     */
    Mario.prototype.stop = function() {
        clearInterval(this.intervalMoveAction);
        this.intervalMoveAction = null;
        clearInterval(this.intervalMovePosition);
        this.intervalMovePosition = null;

        var m = $('#mario');
        if (this.imgRight.indexOf(m.attr('src')) >= 0) {
            m.attr('src', this.imgRight[0]);
        } else {
            m.attr('src', this.imgLeft[0]);
        };
        this.moveFlg = false;
    };

    /**
     * マリオの手足を動作させる処理
     */
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

    /**
     * マリオの位置を移動する処理
     */
    Mario.prototype.movePosition = function() {
        var m = $('#mario');
        var rightEnd = $(window).width() - this.imgSize;
        if (this.imgRight.indexOf(m.attr('src')) >= 0) {
            // 右端より右には移動させない
            if (parseInt(m.css('left')) < rightEnd) {
                m.css({left: parseInt(m.css('left')) + 1});
            }
        } else {
            // 左端より左には移動させない
            if (parseInt(m.css('left')) > 0) {
                m.css({left: parseInt(m.css('left')) - 1});
            }
        }
    };

    var mario = new Mario();
    mario.init();

    $(document).on('mousedown', 'html', function(event) {
        // 中心より右でクリックした場合右、左でクリックした場合左に動く
        mario.start((event.clientX >= $(window).width() / 2) ? 'right' : 'left');
    });
    $(document).on('mousemove', 'html', function(event) {
        // マリオが右を向いているかつ中心より左でクリックした場合
        if (event.clientX >= $(window).width() / 2 && mario.imgLeft.indexOf($('#mario').attr('src')) >= 0) {
            mario.turn('right');
        // マリオが左を向いているかつ中心より右でクリックした場合
        } else if (event.clientX < $(window).width() / 2 && mario.imgRight.indexOf($('#mario').attr('src')) >= 0) {
            mario.turn('left');
        }
    });
    $(document).on('mouseup', 'html', function() {
        mario.stop();
    });

    // キーを押した記録を付ける
    // 両方のキーを押し続けてからすぐ離すとイベント発生が遅延する問題の対策の為
    var arr = [];
    $(document).on('keydown', 'html', function(event) {
        if (event.keyCode == 39) { // 右矢印キー
            if (arr.indexOf(event.keyCode) < 0) arr.push(event.keyCode); // 矢印キーを押した記録を付ける
            if (!mario.moveFlg) mario.start('right');
        } else if (event.keyCode == 37){ // 左矢印キー
            if (arr.indexOf(event.keyCode) < 0) arr.push(event.keyCode); // 矢印キーを押した記録を付ける
            if (!mario.moveFlg) mario.start('left');
        }
    });
    $(document).on('keyup', 'html', function(event) {
        var idx = arr.indexOf(event.keyCode);
        // 矢印キーを離すと、配列から除去する
        if (idx >= 0) arr.splice(idx, 1);

        if (mario.moveFlg) mario.stop();

        // 両方のキーを押し続けてからすぐ離すとイベント発生が遅延する問題の対策
        // 離した際イベントがまだ残っている場合、キーダウンのイベントを発火
        if (arr[0]) {
            var e = $.Event('keydown');
            e.keyCode = arr[0];
            $('html').trigger(e);
        }
    });
    alert("マリオ");
});
