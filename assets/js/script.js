var main = document.querySelector("main")
var startingEls = document.querySelector("section[id='start']")
var startBut = document.querySelector("button[id='start-but']")
var currentQuestion
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
var score = 0
var waiting = false
var questionCounter = 0

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
        answer.className = "btn answer"
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
    if (waiting) return

    var target = event.target

    if (target.matches(".answer")) {    
        waiting = true;
        
        if (parseInt(target.getAttribute("data-ques-id")) === questions[questionCounter - 1].correct) {
            currentQuestion.querySelector("p").textContent = "right"
            score++
        }
        else {
            currentQuestion.querySelector("p").textContent = "wrong"
            score--
        }

        setTimeout(function() {
            if (questionCounter + 1 > questions.length) {
                main.removeChild(currentQuestion)
                currentQuestion = createFinalTally()
                main.appendChild(currentQuestion)
                waiting = false
                questionCounter = 0
                score = 0
                return
            }
            else {
                main.removeChild(currentQuestion)
                currentQuestion = createQuestion()
                main.appendChild(currentQuestion)
                waiting = false
                return
            }
        }, 1000)
    }
    else if (target.matches(".go-back")) {
        var nameInput = document.querySelector("input[id='name-input']")

        console.log(nameInput.value)

        main.removeChild(currentQuestion)
        main.appendChild(startingEls)
        waiting = false
        return
    }
}
var createFinalTally = function() {
    var finalTally = document.createElement("div")
    finalTally.className = "final-tally"

    var finalTitle = document.createElement("h1")
    finalTitle.textContent = "All Done!"
    finalTally.appendChild(finalTitle)

    var finalScore = document.createElement("p")
    finalScore.textContent = "Your final score is: " + score
    finalTally.appendChild(finalScore)

    var inputPrompt = document.createElement("p")
    inputPrompt.textContent = "Enter your name to submit your score and try again."
    finalTally.appendChild(inputPrompt)

    var inputWrapper = document.createElement("div")
    inputWrapper.className = "inputWrapper"
    
    var nameInput = document.createElement("input")
    nameInput.id = "name-input"
    nameInput.placeholder = "Enter name here:"
    nameInput.type = "text"
    inputWrapper.appendChild(nameInput)

    var goBack = document.createElement("button")
    goBack.textContent = "Go Back"
    goBack.className = "btn go-back"
    inputWrapper.appendChild(goBack)

    finalTally.appendChild(inputWrapper)

    return finalTally
}

startBut.addEventListener("click", startButtonHandler)
main.addEventListener("click", answerHandler)