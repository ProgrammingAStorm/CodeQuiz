var main = document.querySelector("main")
var viewScores = document.querySelector("a")
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
    else if (target.matches("#go-back")) {
        goBackHandler()
    }
    else if (target.matches("#return")) {
        main.removeChild(currentQuestion)
        currentQuestion = null
        main.appendChild(startingEls)
    }

    function startButtonHandler() {
        startingEls.remove();
    
        currentQuestion = createQuestion()
        main.appendChild(currentQuestion)
    
        setTime(45)
    
        quiz.time = 45
        quiz.timer = setInterval(timerCountDown,1000)
        quiz.waiting = false
    
        function timerCountDown() {
            quiz.time--
        
            setTime(quiz.time)
        
            if (quiz.time <= 0) {
                clearInterval(quiz.timer)
        
                main.removeChild(currentQuestion)
                currentQuestion = createFinalTally()
                main.appendChild(currentQuestion)

                setTime(0)
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
            quiz.time = quiz.time - 5

            if (quiz.time <= 0) {
                return
            }
        }
    
        setTimeout(function() {
            if (quiz.questionCounter + 1 > questions.length) {
                clearInterval(quiz.timer)

                setTime(0)

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
        currentQuestion = null
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
        goBack.className = "btn"
        goBack.id = "go-back"
        inputWrapper.appendChild(goBack)
    
        finalTally.appendChild(inputWrapper)
    
        return finalTally
    }
}
function viewScoresHandler(event) {
    event.preventDefault()
    
    clearInterval(quiz.timer)
    setTime(0)

    if(currentQuestion) {
        main.removeChild(currentQuestion)
    }
    else {
        main.removeChild(startingEls)
    }

    loadScores()

    currentQuestion = document.createElement("div")
    if (!quiz.scores) {

        var label = document.createElement("p")
        label.textContent = "There are no scores."
        currentQuestion.appendChild(label)
    }
    else {
        quiz.scores.forEach(element => {
            var container = document.createElement("div")
            
            var name = document.createElement("p")
            name.textContent = "Name: " + element.savName
            container.appendChild(name)

            var score = document.createElement("p")
            score.textContent = "Score: " + element.savScore
            container.appendChild(score)

            currentQuestion.appendChild(container)
        });
    }
    var button = document.createElement("button")
    button.textContent = "Go Back"
    button.id = "return"
    currentQuestion.appendChild(button)

    main.appendChild(currentQuestion)
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
function setTime(time) {
    timerEl.textContent = "Time: " + time
}

main.addEventListener("click", buttonHandler)
viewScores.addEventListener("click", viewScoresHandler)