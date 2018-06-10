//算式类
class BinaryOperation {
    constructor() {
        this.operandUpper = 100;
        this.operandLower = 0;
        this.valueUpper = 100;
        this.valueLower = 0;
        this.leftOperand = 0;
        this.rightOperand = 0;
        this.operator = "+";
        this.value = 0;
    }

    calculate() {
        console.log("override this function, function name calculate");
    }

    //检查算式是否符合要求
    checkingCalculation() {
        if (this.value <= this.valueUpper && this.value >= this.valueLower) {
            return true;
        }
        return false;
    }

    equals() {
        console.log("override this function, function name equals");
    }

    generateRandom() {
        let num = Math.floor((Math.random() * (this.operandUpper - this.operandLower + 1) + this.operandLower));
        return num;
    }

    generateBinaryOperation() {
        let failureCount = 0;
        while (true) {
            this.leftOperand = this.generateRandom();
            this.rightOperand = this.generateRandom();
            this.calculate();
            if (this.checkingCalculation() == true) {
                return this;
            } else {
                failureCount++;
                if (failureCount > 100) {
                    throw new Error("数字范围设置错误");
                }
            }
        }
    }

    present(num) {
        var rawHtml = "";
        rawHtml += "        <div class=\"question col-md-4\">\n" +
            "            <label for=\"question" + num + "\" class=\"col-4 text-right\">" + this.leftOperand + this.operator + this.rightOperand + "=" + "</label>\n" +
            "            <input type=\"text\" class=\"col-4 text-left\" id=\"question" + num + "\">\n" +
            "            <span class=\"col-1\">✓</span>\n" +
            "        </div>"
        return rawHtml;
    }
}

//加法算式类
class AddBinaryOperation extends BinaryOperation {
    constructor() {
        super();
        this.operator = "+";
    }

    calculate() {
        this.value = this.leftOperand + this.rightOperand;
    }

    equals(bo) {
        if (this.operator != bo.operator) {
            return false
        }
        if ((this.leftOperand != bo.leftOperand && this.leftOperand != this.rightOperand) ||
            this.rightOperand != bo.leftOperand && this.rightOperand != bo.rightOperand) {
            return false;
        }
        return true;
    }
}

//减法算式类
class SubBinaryOperation extends BinaryOperation {
    constructor() {
        super();
        this.operator = "-";
    }

    calculate() {
        this.value = this.leftOperand - this.rightOperand;
    }

    equals(bo) {
        if (this.operator != bo.operator) {
            return false
        }
        if ((this.leftOperand != bo.leftOperand) || (this.rightOperand != bo.rightOperand)) {
            return false;
        }
        return true;
    }
}

//乘法算式类
class MulBinaryOperation extends BinaryOperation {
    constructor() {
        super();
        this.operator = "×";
    }

    calculate() {
        this.value = this.leftOperand * this.rightOperand;
    }

    equals(bo) {
        if (this.operator != bo.operator) {
            return false
        }
        if ((this.leftOperand != bo.leftOperand && this.leftOperand != this.rightOperand) ||
            this.rightOperand != bo.leftOperand && this.rightOperand != bo.rightOperand) {
            return false;
        }
        return true;
    }
}

//除法算式类
class DivBinaryOperation extends BinaryOperation {
    constructor() {
        super();
        this.operator = "÷";
    }

    generateBinaryOperation() {
        let failureCount = 0;
        while (true) {
            this.leftOperand = this.generateRandom();
            this.rightOperand = this.generateRandom();
            while (this.leftOperand % this.rightOperand != 0 || this.leftOperand < this.rightOperand) {
                this.leftOperand = this.generateRandom();
                this.rightOperand = this.generateRandom();
            }
            this.calculate();
            if (this.checkingCalculation() == true) {
                return this;
            } else {
                failureCount++;
                if (failureCount > 100)
                    throw new Error("数字范围设置错误");
            }
        }
    }

    calculate() {
        this.value = this.leftOperand / this.rightOperand;
    }

    equals(bo) {
        if (this.operator != bo.operator) {
            return false
        }
        if ((this.leftOperand != bo.leftOperand) || (this.rightOperand != bo.rightOperand)) {
            return false;
        }
        return true;
    }
}

//练习类
class Exercise {
    constructor(num) {
        this.operandUpper = 100;
        this.operandLower = 0;
        this.valueUpper = 100;
        this.valueLower = 0;
        this.operationNumber = num;
        this.operationList = new Array();
    }

    //产生一个随机的算式对象
    generateBinaryExercise() {
        console.log("override this function, function name generateBinaryExercise");
    }

    //将算式对象添加到算式对象数组
    generateExercise() {
        let question = this.generateBinaryExercise();
        this.operationList.push(question);
        let fail = 0;
        for (let i = 1; i < this.operationNumber;) {
            let question = this.generateBinaryExercise();
            if (this.contains(question) == false) {
                i++;
                this.operationList.push(question);
            } else {
                fail++;
                //失败次数过多退出
                if (fail > 100) {
                    throw new Error("产生的试题过多，或者范围过小！");
                }
            }
        }
    }

    //检查算式是否重复
    contains(anOperation) {
        for (let i = 0; i < this.operationList.length; i++) {
            var tmp = this.operationList[i];
            if (anOperation.equals(tmp)) {
                return true;
            }
        }
        return false;
    }

    //展现
    present() {
        var rawHtml = "";
        for (let i = 0; i < this.operationList.length; i++) {
            rawHtml += this.operationList[i].present(i);
        }
        return rawHtml;
    }

    debugPresent() {
        for (let i = 0; i < this.operationList.length; i++) {
            console.log(this.operationList[i].leftOperand + this.operationList[i].operator + this.operationList[i].rightOperand + "=" + this.operationList[i].value);
        }
    }
}

//纯加法练习类
class AddExercise extends Exercise {
    constructor(num) {
        super(num);
    }

    generateBinaryExercise() {
        let operation;
        operation = new AddBinaryOperation();
        operation.operandUpper = this.operandUpper;
        operation.operandLower = this.operandLower;
        operation.valueLower = this.valueLower;
        operation.valueUpper = this.valueUpper;
        operation.generateBinaryOperation();
        return operation;
    }
}

//纯减法练习类
class SubExercise extends Exercise {
    constructor(num) {
        super(num);
    }

    generateBinaryExercise() {
        let operation;
        operation = new SubBinaryOperation();
        operation.operandUpper = this.operandUpper;
        operation.operandLower = this.operandLower;
        operation.valueLower = this.valueLower;
        operation.valueUpper = this.valueUpper;
        operation.generateBinaryOperation();
        return operation;
    }
}

//纯乘法练习类
class MulExercise extends Exercise {
    constructor(num) {
        super(num);
    }

    generateBinaryExercise() {
        let operation;
        operation = new MulBinaryOperation();
        operation.operandUpper = this.operandUpper;
        operation.operandLower = this.operandLower;
        operation.valueLower = this.valueLower;
        operation.valueUpper = this.valueUpper;
        operation.generateBinaryOperation();
        return operation;
    }
}

//纯除法练习类
class DivExercise extends Exercise {
    constructor(num) {
        super(num);
    }

    generateBinaryExercise() {
        let operation;
        operation = new DivBinaryOperation();
        operation.operandUpper = this.operandUpper;
        operation.operandLower = this.operandLower;
        operation.valueLower = this.valueLower;
        operation.valueUpper = this.valueUpper;
        operation.generateBinaryOperation();
        return operation;
    }
}

//加减混合练习类
class AddSubExercise extends Exercise {
    constructor(num) {
        super(num);
    }

    generateBinaryExercise() {
        let operation;
        if (Math.round(Math.random()) == 1) {
            operation = new AddBinaryOperation();
        } else {
            operation = new SubBinaryOperation();
        }
        operation.operandUpper = this.operandUpper;
        operation.operandLower = this.operandLower;
        operation.valueLower = this.valueLower;
        operation.valueUpper = this.valueUpper;
        operation.generateBinaryOperation();
        return operation;
    }
}

//乘除混合练习类
class MulDivExercise extends Exercise {
    constructor(num) {
        super(num);
    }

    generateBinaryExercise() {
        let operation;
        if (Math.round(Math.random()) == 1) {
            operation = new MulBinaryOperation();
        } else {
            operation = new DivBinaryOperation();
        }
        operation.operandUpper = this.operandUpper;
        operation.operandLower = this.operandLower;
        operation.valueLower = this.valueLower;
        operation.valueUpper = this.valueUpper;
        operation.generateBinaryOperation();
        return operation;
    }
}

//加减乘除混合联系类
class AllMixSubExercise extends Exercise {
    constructor(num) {
        super(num);
    }

    generateBinaryExercise() {
        let operation;
        let randomNum = Math.floor((Math.random() * 4));
        let funcArray = new Array
        (
            "AddBinaryOperation",
            "SubBinaryOperation",
            "MulBinaryOperation",
            "DivBinaryOperation"
        );
        operation = eval("new "+funcArray[randomNum] + "()");
        operation.operandUpper = this.operandUpper;
        operation.operandLower = this.operandLower;
        operation.valueLower = this.valueLower;
        operation.valueUpper = this.valueUpper;
        operation.generateBinaryOperation();
        return operation;
    }
}