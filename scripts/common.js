var commonMethod = {
    //初始化数组
    initArr: function(arrLength) {
        var arr = [];
        for (var i = 0; i < arrLength; i++) {
            arr[i] = [];
            for (var j = 0; j < arrLength; j++) {
                arr[i][j] = 0;
            }
        }
        return arr;
    },
    //判断输赢
    judge: function(flag, x, y, _this, arrLength) {
        var n1 = 0,//左右
            n2 = 0,//上下
            n3 = 0,//左上到右下方
            n4 = 0, // 右上到左下
            result;
        //从落子的位置向八个方向寻找，相同颜色的棋子n*自加，如果不是相同颜色的棋子或没棋子，就跳出循环
        //往左
        for (var i = x; i >= 0; i--) {
            if (_this.chessArr[i][y] !== flag) {
                break;
            }
            n1++;
        }
        //往右
        for (var i = x + 1; i < arrLength; i++) {
            if (_this.chessArr[i][y] !== flag) {
                break;
            }
            n1++;
        }
        //往上
        for (var i = y; i >= 0; i--) {
            if (_this.chessArr[x][i] !== flag) {
                break;
            }
            n2++;
        }
        //往下
        for (var i = y + 1; i < arrLength; i++) {
            if (_this.chessArr[x][i] !== flag) {
                break;
            }
            n2++;
        }
        //往左上
        for (var i = x, j = y; i >= 0, j >= 0; i--, j--) {
            if (i < 0 || j < 0 || _this.chessArr[i][j] !== flag) {
                break;
            }
            n3++;
        }
        //往右下
        for (var i = x + 1, j = y + 1; i < arrLength, j < arrLength; i++, j++) {
            if (i >= arrLength || j >= arrLength || _this.chessArr[i][j] !== flag) {
                break;
            }
            n3++;
        }
        //右上
        for (var i = x, j = y; i >= 0, j < arrLength; i--, j++) {
            if (i < 0 || j >= 15 || _this.chessArr[i][j] !== flag) {
                break;
            }
            n4++;
        }
        //左下
        for (var i = x + 1, j = y - 1; i < arrLength, j >= 0; i++, j--) {
            if (i >= arrLength || j < 0 || _this.chessArr[i][j] !== flag) {
                break;
            }
            n4++;
        }

        result = [n1, n2, n3, n4];
        return result;
    },
    outputResult: function(_this, flag, argArr) {
        //如果有输赢则输出
        var str;
        if (argArr[0] > 4 || argArr[1] > 4 || argArr[2] > 4 || argArr[3] > 4) {
            if (flag === 1) { //白棋
                str = tipBlackWin;
            } else if (flag === 2) { //黑棋
                str = tipWhiteWin;
            }
            _this.resultTips.innerHTML = str;
            _this.isWin = true;
            _this.resetAble = false;
        }
    }

}