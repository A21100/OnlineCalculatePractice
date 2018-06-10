window.onload = function () {
    var btnOnlineExercise = document.getElementById("btnOnlineExercise");
    btnOnlineExercise.onclick = function () {
        return clickGenerateExercise();
    }
}

function downloadExercise() {
    try {
        data = {
            content: [{
                columns: [
                    {text: ""},
                    {text: ""},
                    {text: ""}
                ]
            }],
            style: {}
        };
        var list = exercise.operationList;
        for (let i = 0, j = 0; i < list.length; i++, j++) {
            let item = list[i];
            data.content[0].columns[j].text += item.leftOperand + " " + item.operator + " " + item.rightOperand + " = \n";
            if (j == 2) {
                j = -1;
            }
        }
        pdfMake.createPdf(data).download("questions");
    } catch (error) {
        console.log(error.stack);
    }
}

function clickGenerateExercise() {
    var questionNumMin = parseInt(document.getElementById("question-num-min").value);
    var questionNumMax = parseInt(document.getElementById("question-num-max").value);
    var answerNumMin = parseInt(document.getElementById("answer-num-min").value);
    var answerNumMax = parseInt(document.getElementById("answer-num-max").value);
    var questionCount = parseInt(document.getElementById("question-count").value);
    var subBtnContainer = document.getElementById("subbutton-container");
    var settings = document.getElementById("exercise-settings");
    var questionsContainer = document.getElementById("questions");

    //表驱动
    var functionMap = new Map([
        ['all-add', 'genAllAddExercise'],
        ['all-sub', 'genAllSubExercise'],
        ['add-and-sub', 'genMixExercise']
    ]);
    var radioButtons = document.getElementsByClassName("type-select");
    var radioButtonValue;

    for (let i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked == true) {
            radioButtonValue = radioButtons[i].value;
        }
    }

    try {
        checkInput();
        eval(functionMap.get(radioButtonValue) + "(" + questionCount + ")");
        exercise.operandUpper = questionNumMax;
        exercise.operandLower = questionNumMin;
        exercise.valueUpper = answerNumMax;
        exercise.valueLower = answerNumMin;
        exercise.generateExercise();

        settings.hidden = true;
        var questions = exercise.present();
        questionsContainer.innerHTML = questions;
        subBtnContainer.innerHTML += "<button class=\"btn btn-primary btn-lg btn-block\" type=\"button\" id=\"btn-sub-exercise\">提交试题</button>";

        var btnSubExercise = document.getElementById("btn-sub-exercise");
        var btnDownload = document.getElementById("btn-download");
        btnSubExercise.onclick = function () {
            return clickCheckExercise();
        }
        btnDownload.style.display = "block";
        btnDownload.onclick = function () {
            return downloadExercise();
        }
    } catch (error) {
        alert(error);
    }

}

function clickCheckExercise() {
    var countRight = 0;
    var countFault = 0;
    var questions = document.getElementById("questions").children;
    var alertsContainner = document.getElementById("alerts-container");

    try {
        checkInput();
        for (let i = 0; i < questions.length; i++) {
            let item = questions[i];
            let rawAnswer = item.getElementsByTagName("input")[0].value;
            let answer = exercise.operationList[i].value;
            if (rawAnswer == answer) {
                countRight++;
                item.getElementsByTagName("span")[0].innerHTML = "✓";
                item.getElementsByTagName("span")[0].style.color = "limegreen";
                item.getElementsByTagName("span")[0].style.visibility = "visible";
            } else {
                countFault++;
                item.getElementsByTagName("span")[0].innerHTML = "✗";
                item.getElementsByTagName("span")[0].style.color = "red";
                item.getElementsByTagName("span")[0].style.visibility = "visible";

            }
        }
        if (countFault == 0) {
            alertsContainner.innerHTML += "        <div class=\"alert alert-success\" role=\"alert\">\n" +
                "            全对！\n" +
                "        </div>";
        } else {
            alertsContainner.innerHTML += "        <div class=\"alert alert-primary\" role=\"alert\">\n" +
                "            做对了 <strong>" + countRight + "</strong> 题，做错了 <strong>" + countFault + "<strong> 题。\n" +
                "        </div>";
        }
    } catch (error) {
        alert(error);
    }
}

function genMixExercise(count) {
    exercise = new Exercise(count);
    return exercise;
}

function genAllAddExercise(count) {
    exercise = new AddExercise(count);
    return exercise;
}

function genAllSubExercise(count) {
    exercise = new SubExercise(count);
    return exercise;
}

function isNumber(str) {
    if (str === "") {
        throw new Error("输入不能为空！");
    } else if (isNaN(str)) {
        console.log(str);
        throw new Error("输入的内容只能是数字。");
    }
}

function checkInput() {
    var inputs = document.getElementsByTagName("input");
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].getAttribute("type") === "text") {
            let str = inputs[i].value;
            isNumber(str);
        }
    }
}