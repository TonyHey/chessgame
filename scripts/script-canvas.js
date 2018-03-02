var chessGame = {
    chessFlag: 1, //1代表hei棋下的棋子，2代表白棋下的棋子
    isWin: false, //判断是否结束，true结束，false没有结束
    step: 40, //设置每个格子的宽高都是40
    chessArr: [], //棋盘数组，0代表没有走过，1为黑棋走过，2为白棋走过
    chessPathArr: [], //记录棋路
    sideLength: 12, //棋盘边长格子数
    resultTips: document.getElementById("result_tips"),
    btnStart: document.getElementById("btn-start"),
    btnReset: document.getElementById("btn-reset"),
    goToDom: document.getElementById("go-to"),
    canvasDom: document.getElementById("canvasObj"), // 获取棋盘画布对象
    canvasTipDom: document.getElementById("canvasTip"), // 获取棋盘提示画布对象
    canvasChessDom: document.getElementById("canvasChess"), // 获取棋子画布对象
    offsetWidth: document.documentElement.clientWidth/2 - 260, // 棋盘居中的偏移量
    chessBlack: new Image(),//黑棋图片
    chessWhite: new Image(),//白棋图片
    tipImg: new Image, //位置提示框

    //初始化
    init: function() {
        var _this = this;
        _this.totalNodes = Math.pow(_this.sideLength, 2); //可下棋子总数
        _this.chessArr = commonMethod.initArr(_this.sideLength);
        _this.canvasObj = _this.canvasDom.getContext("2d");
        _this.canvasTipObj = _this.canvasTipDom.getContext("2d");
        _this.canvasChessObj = _this.canvasChessDom.getContext("2d");
        _this.chessBlack.src = "imgs/black.png";
        _this.chessWhite.src = "imgs/white.png";
        _this.tipImg.src = "imgs/tipPosition.png";
        _this.goToDom.innerHTML = tipGoToDom;
        _this.resultTips.innerHTML = tipGameStart;
        _this.drawLine();

        //鼠标指向棋盘棋盘，提示将下子位置
        _this.canvasChessDom.addEventListener("mousemove", function(e){
            // 先判断游戏是否结束
            if (_this.isWin) {
                return false;
            }
            //计算位置
            var drawPopsition = _this.calculatePopsition(e.clientX, e.clientY);
            var x = drawPopsition.x, y = drawPopsition.y;

            if (x < 0 || x > 11 || y < 0 || y > 11 //如果超出棋盘或者在棋盘边界直接返回
                || _this.chessArr[x][y] !== 0) {//进行判断该位置是否已经显示过棋子
                return false;
            }
            //画提示
            _this.drawChess(x, y);
        });
        _this.canvasChessDom.addEventListener("mouseout", function(){
            _this.canvasTipObj.clearRect(0, 0, 520, 520);
        });
        //鼠标点击棋盘, 下子
        _this.canvasChessDom.addEventListener("click", function(e) {
            // 先判断游戏是否结束
            if (_this.isWin) {
                _this.resultTips.innerHTML = tipGameOver;
                return false;
            }
            //计算位置, PS：后续学习发现 可以用e.offsetX, e.offsetY，减少计算
            var drawPopsition = _this.calculatePopsition(e.clientX, e.clientY);
            var currentX = drawPopsition.x, currentY = drawPopsition.y;

            if (currentX < 0 || currentX > 11 || currentX < 0 || currentY > 11 //如果超出棋盘或者在棋盘边界直接返回
                || _this.chessArr[currentX][currentY] !== 0) {//进行判断该位置是否已经显示过棋子
                _this.resultTips.innerHTML = tipNoHere;
                return false;
            }
            //画棋子
            _this.drawChess(currentX, currentY, _this.chessFlag);
            //判断输赢与否
            var resultArr = commonMethod.judge(_this.chessFlag, currentX, currentY, _this);
            commonMethod.outputResult(_this, _this.chessFlag, resultArr);

            if (!_this.isWin) {
                //记录当前棋步
                _this.chessPathArr.push({
                    flag: _this.chessFlag,
                    x: currentX,
                    y: currentY
                });
                //设置当前执子方及提示信息
                if (_this.chessFlag === 1) {
                    _this.chessFlag = 2; //将标志置为2,白棋执子
                    _this.resultTips.innerHTML = tipWhiteTurn;
                } else {
                    _this.chessFlag = 1; //将标志置为1,黑棋执子
                    _this.resultTips.innerHTML = tipBlackTurn;
                }
            }

            //判断和棋
            if (_this.chessPathArr.length === _this.totalNodes) {
                _this.resultTips.innerHTML = tipChessDraw;
                _this.isWin = true;
            }
        });
        //重新开始
        _this.btnStart.addEventListener("click", function() {
            //重置所有参数
            _this.chessFlag = 1;
            _this.isWin = false;
            _this.chessPathArr = [];
            _this.chessArr = commonMethod.initArr(13);
            //清除所有棋子
            _this.canvasChessObj.clearRect(0, 0, 520, 520);
            //重置提示信息
            _this.resultTips.innerHTML = tipGameStart;
        });
        //悔棋/撤销
        _this.btnReset.addEventListener("click", function(){
            if (_this.chessPathArr.length !== 0 && !_this.isWin) {
                //获取悔棋canvas坐标
                var lastStepObj = _this.chessPathArr.pop();
                var clearX = lastStepObj.x * _this.step + 25,
                    clearY = lastStepObj.y * _this.step + 25;
                //清除悔棋的子
                _this.canvasChessObj.clearRect(clearX, clearY, 30, 30);

                //重置棋子标记
                _this.chessArr[lastStepObj.x][lastStepObj.y] = 0;
                _this.chessFlag = lastStepObj.flag
                //更新提示
                if (_this.chessFlag === 1) {
                    _this.resultTips.innerHTML = tipBlackTurn;
                } else {
                    _this.resultTips.innerHTML = tipWhiteTurn;
                }
            } else if (_this.chessPathArr.length === 0){ //双方都悔到没有棋子了
                _this.resultTips.innerHTML = tipNoChess;
            }
        });
    },
    //计算落子位置
    calculatePopsition: function(eventX, eventY) {
        //判断棋子显示的地方，
        //canvas 对象单击事件的clientWidth&clientHeight和body一致，
        //所以减去水平居中偏移量 _this.offsetWidth & 上边距偏移量30(margin) + 20(padding) = 50
        var scrollTop = document.body.scrollTop;
        	x = (eventX - this.offsetWidth) / this.step,
            y = (eventY - 50 + scrollTop) / this.step,
            xr = (eventX - this.offsetWidth) % this.step,
            yr = (eventY - 50 + scrollTop) % this.step,
            stepHalf = this.step / 2;

        x = parseInt(x);
        y = parseInt(y);

        //取整并且跟据取余来判断鼠标点击就近的十字角落子
        if (xr <= stepHalf && yr <= stepHalf) {
            x--;
            y--;
        } else if (xr <= stepHalf) {
            x--;
        } else if (yr <= stepHalf) {
            y--;
        }
        var result = {x: x, y: y};
        return result;
    },
    //绘制棋盘
    drawLine: function() {
        for (var i = 0; i < this.canvasDom.width / this.step; i++) {
            // 画竖线
            this.canvasObj.moveTo((i + 1) * this.step, 0);
            this.canvasObj.lineTo((i + 1) * this.step, this.canvasDom.height);
            // 画横线
            this.canvasObj.moveTo(0, (i + 1) * this.step);
            this.canvasObj.lineTo(this.canvasDom.width, (i + 1) * this.step);
            this.canvasObj.stroke();
        }
    },
    //画棋子
    drawChess: function(x, y, chessFlag) {
        //根据x和y确定图片显示位置,让图片显示在十字线中间，因为格子大小为40，棋子大小为30，所以需要往右下移动40-30/2
        var drawX = x * this.step + 25,
            drawY = y * this.step + 25;
        //先清除提示框，再绘制新提示，黑子或白子
        this.canvasTipObj.clearRect(0, 0, 520, 520);
        if (chessFlag === 1) {
            //绘制白棋
            this.canvasChessObj.drawImage(this.chessBlack, drawX, drawY);
            this.chessArr[x][y] = 1;
        } else if (chessFlag === 2) {
            // 绘制黑棋
            this.canvasChessObj.drawImage(this.chessWhite, drawX, drawY);
            this.chessArr[x][y] = 2;
        } else {
            //提示框
            this.canvasTipObj.drawImage(this.tipImg, drawX, drawY + 2);
        }
    }

}

window.onload = chessGame.init();