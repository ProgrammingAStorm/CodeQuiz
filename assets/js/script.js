var main = document.querySelector("main")
var timerEl = document.querySelector("p[id='timer']")
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
    waiting: false,
    questionCounter: 0,
    scores: [],
    time: 0,
    timer: null
}

function buttonHandler(event) {
    if (quiz.waiting) return

    var target = event.target

    if (target.matches("#start-but")) {
        startButtonHandler()
    }
    else if (target.matches(".answer")) {    
        answerHandler()
    }
    else if (target.matches(".go-back")) {
        goBackHandler()
    }

    function startButtonHandler() {
        startingEls.remove();
    
        currentQuestion = createQuestion()
        main.appendChild(currentQuestion)
    
        timerEl.textContent = "Time: 45"
    
        quiz.time = 45
        quiz.timer = setInterval(timerCountDown,1000)
        quiz.waiting = false
    
        function timerCountDown() {
            quiz.time--
        
            timerEl.textContent = "Time: " + quiz.time
        
            if (quiz.time <= 0) {
                clearInterval(quiz.timer)
        
                main.removeChild(currentQuestion)
                currentQuestion = createFinalTally()
                main.appendChild(currentQuestion)
            }
        }
    }
    function answerHandler() {
        quiz.waiting = true;
            
        if (parseInt(target.getAttribute("data-ques-id")) === questions[quiz.questionCounter - 1].correct) {
            currentQuestion.querySelector("p").textContent = "right"
        }
        else {
            currentQuestion.querySelector("p").textContent = "wrong"
            quiz.waiting = false
            quiz.time = 0
            return
        }
    
        setTimeout(function() {
            if (quiz.questionCounter + 1 > questions.length) {
                clearInterval(quiz.timer)

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
        }, 500)
    }
    function goBackHandler() {
        var name = document.querySelector("input[id='name-input']").value
    
        if(!name) name = "Anonymous"
    
        saveScore(name)
    
        main.removeChild(currentQuestion)
        main.appendChild(startingEls)
    
        quiz.waiting = false
        quiz.questionCounter = 0

        return
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
        finalScore.textContent = "Your final score is: " + quiz.time
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
}
function saveScore(name) {
    loadScores()

    quiz.scores.push({
        savName: name,
        savScore: quiz.time
    })

    localStorage.setItem("scores", JSON.stringify(quiz.scores))
}
function loadScores() {
    quiz.scores = localStorage.getItem("scores")
    if(!quiz.scores) {
        quiz.scores = []
        return false
    }

    quiz.scores = JSON.parse(quiz.scores)
}

main.addEventListener("click", buttonHandler)