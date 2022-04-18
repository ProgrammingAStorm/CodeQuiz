var main = document.querySelector("main")
var startingEls = document.querySelector("section[id='start']")
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
var quiz = {
    score: 0,
    waiting: false,
    questionCounter: 0,
    scores: []
}

function buttonHandler(event) {

    if (quiz.waiting) return

    var target = event.target

    if (target.matches("#start-but")) {
        startButtonHandler()
    }
    else if (target.matches(".answer")) {    
        answerHandler(target)
    }
    else if (target.matches(".go-back")) {
        goBackHandler()
    }

    function answerHandler() {
        quiz.waiting = true;
            
        if (parseInt(target.getAttribute("data-ques-id")) === questions[quiz.questionCounter - 1].correct) {
            currentQuestion.querySelector("p").textContent = "right"
            quiz.score++
        }
        else {
            currentQuestion.querySelector("p").textContent = "wrong"
            quiz.score--
        }
    
        setTimeout(function() {
            if (quiz.questionCounter + 1 > questions.length) {
                main.removeChild(currentQuestion)

                currentQuestion = createFinalTally()
                main.appendChild(currentQuestion)

                quiz.waiting = false
                quiz.questionCounter = 0
                return
            }
            else {
                main.removeChild(currentQuestion)

                currentQuestion = createQuestion()
                main.appendChild(currentQuestion)

                quiz.waiting = false
                return
            }
        }, 1000)
    }
}
function startButtonHandler() {
    startingEls.remove();

    currentQuestion = createQuestion()
    main.appendChild(currentQuestion)

    quiz.waiting = false
}
function createQuestion() {
    var questionWrapper = document.createElement("div")
    questionWrapper.className = "question-wrapper"

    var question = document.createElement("h1")
    question.textContent = questions[quiz.questionCounter].question
    question.setAttribute("data-correct", questions[quiz.questionCounter].correct)
    questionWrapper.appendChild(question)

    var answerWrapper = document.createElement("div")
    answerWrapper.className = "answer-wrapper"

    for (var x = 0; x < 4; x++) {
        var answer = document.createElement("button")
        answer.textContent = questions[quiz.questionCounter][`${x + 1}`]
        answer.setAttribute("data-ques-id", x + 1)
        answer.className = "btn answer"
        answerWrapper.appendChild(answer)
    }
    questionWrapper.appendChild(answerWrapper)

    var feedback = document.createElement("p")
    feedback.textContent = "feedback"
    questionWrapper.appendChild(feedback)

    quiz.questionCounter++

    return questionWrapper;
}
function createFinalTally() {
    var finalTally = document.createElement("div")
    finalTally.className = "final-tally"

    var finalTitle = document.createElement("h1")
    finalTitle.textContent = "All Done!"
    finalTally.appendChild(finalTitle)

    var finalScore = document.createElement("p")
    finalScore.textContent = "Your final quiz.score is: " + quiz.score
    finalTally.appendChild(finalScore)

    var inputPrompt = document.createElement("p")
    inputPrompt.textContent = "Enter your name to submit your quiz.score and try again."
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
function goBackHandler() {
    var name = document.querySelector("input[id='name-input']").value

    if(!name) name = "Anonymous"

    saveScore(name)

    main.removeChild(currentQuestion)
    main.appendChild(startingEls)

    quiz.waiting = false
    quiz.score = 0
    return
}

main.addEventListener("click", buttonHandler)