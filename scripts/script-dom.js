var chessGame = {
    chessFlag: 1, //1代表黑棋下的棋子，2代表白棋下的棋子
    isWin: false, //判断是否结束，true结束，false没有结束
    chessArr: [], //棋盘数组，0代表没有走过，1为黑棋走过，2为白棋走过
    chessPathArr: [], //记录棋路
    sideLength: 12, //棋盘边长格子数
    resultTips: document.getElementById("result_tips"),
    btnStart: document.getElementById("btn-start"),
    btnReset: document.getElementById("btn-reset"),
    goToDom: document.getElementById("go-to"),
    chessBoard: document.getElementById("chess-board"), // 获取棋盘对象

    //初始化
    init: function() {
        var _this = this;
        var currentX,currentY;
        var totalNodes = Math.pow(_this.sideLength, 2);
        var chessNodes = _this.chessBoard.children; //棋子位置节点
        _this.goToDom.innerHTML = tipGoToCanvas;
        _this.resultTips.innerHTML = tipGameStart;
        _this.chessArr = commonMethod.initArr(_this.sideLength);
        //鼠标点击棋盘
        _this.chessBoard.addEventListener("click", function(e) {
            // 先判断游戏是否结束
            if (_this.isWin) {
                _this.resultTips.innerHTML = tipGameOver;
                return false;
            }

            //根据点击的元素的坐标data 记录当前落子位置
            currentX = parseInt(e.target.dataset.x);
            currentY = parseInt(e.target.dataset.y);
            //边界上不能落子
            if (currentX !== -1 && currentX !== -1) {
                //进行判断该位置是否已经显示过棋子或者在边框上上
                var targetClass = e.target.getAttribute("class");
                if (_this.chessArr[currentX][currentY] || targetClass !== "chess-middle") {
                    _this.resultTips.innerHTML = tipNoHere;
                    return false;
                }
                //更新棋盘状态
                _this.chessArr[currentX][currentY] = _this.chessFlag;
                //判断结果
                var resultArr = commonMethod.judge(_this.chessFlag, currentX, currentY, _this, _this.sideLength);
                //输出结果
                commonMethod.outputResult(_this, _this.chessFlag, resultArr);
                //更新棋路记录
                _this.chessPathArr.push({
                    flag: _this.chessFlag,
                    x: currentX,
                    y: currentY
                });

                // 判断是显示黑子还是白子
                if (_this.chessFlag === 1) {
                    //画白子
                    e.target.setAttribute("style", "background:url(imgs/black.png) no-repeat 4px 4px;");
                    if (!_this.isWin) {
                        _this.chessFlag = 2; //将标志置为2,白棋执子
                        _this.resultTips.innerHTML = tipWhiteTurn;
                    }
                } else {
                    //画黑子
                    e.target.setAttribute("style", "background:url(imgs/white.png) no-repeat 4px 4px;");
                    if (!_this.isWin) {
                        _this.chessFlag = 1; //将标志置为1,黑棋执子
                        _this.resultTips.innerHTML = tipBlackTurn;
                    }
                }

                if (_this.chessPathArr.length === totalNodes) {
                    _this.resultTips.innerHTML = tipChessDraw;
                }
            }
        });
        //重新开始
        _this.btnStart.addEventListener("click", function() {
            //重置所有参数和提示，清除所有棋子
            _this.chessFlag = 1;
            _this.isWin = false;
            _this.chessPathArr = [];
            _this.chessArr = commonMethod.initArr(15);
            //清楚所有棋子
            for(var i = 0; i < chessNodes.length; i++) {
                chessNodes[i].removeAttribute("style");
            }
            //重置提示信息
            _this.resultTips.innerHTML = tipGameStart;
        });
        //悔棋/撤销
        _this.btnReset.addEventListener("click", function(){
            if (_this.chessPathArr.length !== 0 && !_this.isWin) {
                //获取悔棋的位置
                var lastStepObj = _this.chessPathArr.pop();
                // 算撤销棋子所在的元素位置，x和y是从0开始的，所以各+1
                var curPosition = (lastStepObj.x + 1) * (_this.sideLength + 1) + (lastStepObj.x + 1) + (lastStepObj.y + 1);
                //清楚悔棋的子
                chessNodes[curPosition].removeAttribute("style");
                //重置棋子标记
                _this.chessArr[lastStepObj.x][lastStepObj.y] = 0;
                _this.chessFlag = lastStepObj.flag;
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
    }

}

window.onload = chessGame.init();