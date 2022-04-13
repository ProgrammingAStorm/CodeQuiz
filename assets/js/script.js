var main = document.querySelector("main")
var startingEls = document.querySelector("section[id='start']")
var startBut = document.querySelector("button[id='start-but']")
var questionCounter = 0
var questions = [
    {
        question: "Lorem Ipsum",
        1: "yes",
        2: "no",
        3: "maybe so",
        4: "all of the above",
        correct: 4
    },
    {
        question: "Lorem Ipsum",
        1: "yes",
        2: "no",
        3: "maybe so",
        4: "all of the above",
        correct: 4
    }
]
var currentQuestion

var startButtonHandler = function() {
    startingEls.remove();

    currentQuestion = createQuestion()
    main.appendChild(currentQuestion)
}
var createQuestion = function() {
    var questionWrapper = document.createElement("div")
    questionWrapper.className = "question-wrapper"

    var question = document.createElement("h1")
    question.textContent = questions[questionCounter].question
    question.setAttribute("data-correct", questions[questionCounter].correct)
    questionWrapper.appendChild(question)

    var answerWrapper = document.createElement("div")
    answerWrapper.className = "answer-wrapper"

    for (var x = 0; x < 4; x++) {
        var answer = document.createElement("button")
        answer.textContent = questions[questionCounter][`${x + 1}`]
        answer.setAttribute("data-ques-id", x + 1)
        answer.className = "btn"
        answerWrapper.appendChild(answer)
    }
    questionWrapper.appendChild(answerWrapper)

    var feedback = document.createElement("p")
    feedback.textContent = "feedback"
    questionWrapper.appendChild(feedback)

    questionCounter++

    return questionWrapper;
}
var answerHandler = function(event) {
    var target = event.target

    if (target.matches(".btn")) {
        if (questionCounter > questions.length) {
            main.removeChild(currentQuestion)
            currentQuestion = createQuestion()
            main.appendChild(currentQuestion)
        }
        else {
            main.removeChild(currentQuestion)
        }
    }
}

startBut.addEventListener("click", startButtonHandler)
main.addEventListener("click", answerHandler)