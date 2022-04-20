//These are the DOM queries for the elements that will be maintained globally.
//They are the main element, the anchor that show the scores, the timer, and the container of the starting elements respectively.
var main = document.querySelector("main")
var viewScores = document.querySelector("a")
var timerEl = document.querySelector("p[id='timer']")
var startingEls = document.querySelector("section[id='start']")
//This is the variable that holds on to whatever is the current element appended to the main element.
//It's used to add and remove elements from the main element.
var currentEls
//This is an array of objects that holds the question. Each object has a question, 4 answers, a number indicating which answer is correct.
var questions = [
    {
        question: "Which one of these is NOT a Javascript keyword?",
        1: "var",
        2: "const",
        3: "let",
        4: "val",
        correct: 4
    },
    {
        question: "Is Javascript good?",
        1: "Yes",
        2: "No",
        3: "Maybe so",
        4: "All of the above",
        correct: 3
    },
    {
        question: "Is it true that I couldn't think of any questions?",
        1: "Likely",
        2: "Of course Not",
        3: "I don't care",
        4: "Huh?",
        correct: 4
    },
    {
        question: "Which one of these is correct?",
        1: "This answer is correct",
        2: "The one above me is lying",
        3: "The one above me is lying",
        4: "I'm lying",
        correct: 1
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
//The quiz object is used to hold misc. logic variables that are used throughout the script.
var quiz = {
    //This is used by buttonHandler() to see if a button has already been pressed and its function is complete. It keeps the user from pressing too many buttons at once and breaking the logic. 
    waiting: false,
    //This keeps count of which question the player is on and is used to retrieve a question from the array, as well as determing actions based on which question the user is on.
    questionCounter: 0,
    //This is array is used to load and save the score in and out of local storage.
    scores: [],
    //This is used to keep track of the time and is used for scoring.
    time: 0,
    //This is assigned an interval by startButtonHandler which counts down the timer every second and performs sends the user to the final tally when the timer is 0 or less.
    timer: null
}

//This is the function assigned to the main element's click event and handles all of the button presses.
function buttonHandler(event) {
    //Checking the waiting variable is done before everything else in the function to ensure that nothing happens when it isn't supposed to.
    if (quiz.waiting) return

    //This is used to check what was clicked so the function can respond accordingly.
    var target = event.target

    //Each button is given an id to be used to decide which function to be called. This is the logic that check the target for each id.
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
        main.removeChild(currentEls)
        currentEls = null
        main.appendChild(startingEls)
    }
    //This is the function for the starting button.
    //The starting elements are removed from the main element. Then the next question is created and assigned to currentEls so that it can then be appended into the main element.
    //TimerEl is set to show 45, the time is set to 45, and the interval is set to timer to start the count down.
    function startButtonHandler() {
        startingEls.remove();
    
        currentEls = createQuestion()
        main.appendChild(currentEls)
    
        setTime(45)
    
        quiz.time = 45
        quiz.timer = setInterval(timerCountDown,1000)
    
        //This is the function that is called by the timer interval.
        //The time is decremented and then used to set TimerEl.
        //If time is less than or equal to 0, then the interval is cleared to prevent further repetitions.
        //CurrentEls is removed from main and then assigned the final tally to then be appended back into main. TimerEl is then set to 0.
        function timerCountDown() {
            quiz.time--
        
            setTime(quiz.time)
        
            if (quiz.time <= 0) {
                clearInterval(quiz.timer)
        
                main.removeChild(currentEls)
                currentEls = createFinalTally()
                main.appendChild(currentEls)

                setTime(0)
            }
        }
    }
    //This is the function for the answer buttons.
    //Waiting is set to true.
    //If the button's "data-answer-id" attribute is equal to the question's "data-correct" attribute, then the answer is correct
    //The feedback element is queried so it can be made visible and it's text set accordingly.
    function answerHandler() {
        quiz.waiting = true;
        
        if (parseInt(target.getAttribute("data-answer-id")) === currentEls.querySelector("h1").getAttribute("data-correct")) {
            var feedback = currentEls.querySelector(".feedback")
            feedback.style.visibility = "visible"
            feedback.textContent = "Right!"
        }
        else {
            var feedback = currentEls.querySelector(".feedback")
            feedback.style.visibility = "visible"
            feedback.textContent = "Wrong!"


            //If the answer is wrong the time is reduced by five.
            quiz.time = quiz.time - 5

            //Then if the time is equal to or less than zero, it sets waiting to false and returns here to prevent colliding with the timer logic.
            if (quiz.time <= 0) {
                quiz.waiting = false
                return
            }
        }
    
        //This anonymous function defined in a one second timeout checks to see if the questionCounter is bigger than the size of the questions array.
        //questionCounter increased by one because the counter starts at 0, but the length starts at 1.
        setTimeout(function() {
            if (quiz.questionCounter + 1 > questions.length) {
                //If bigger:
                //The timer interval is cleared.
                clearInterval(quiz.timer)

                //timerEl is set to 0.
                setTime(0)

                //currentEls is removed from main, assigned the final tally, and then appended back into main.
                main.removeChild(currentEls)
                currentEls = createFinalTally()
                main.appendChild(currentEls)

                //Waiting is then set to false and the questionCounter is set to zero before returning.
                quiz.waiting = false
                quiz.questionCounter = 0
                return
            }
            else {
                //Otherwise:
                //currentEls is removed from main.
                main.removeChild(currentEls)

                //currentEls is then asigned the next question, and appended to main.
                currentEls = createQuestion()
                main.appendChild(currentEls)

                //Waiting is set to false before returning.
                quiz.waiting = false
                return
            }
        }, 500)
    }
    //This is the function for the go back button.
    //The value of the "name-input" element is queried and assigned to name.
    //If the input had no value, then name defualts to "Anonymous". 
    //name is then used to save the score.
    //currentEls is removed from main, assigned null, and then startingEls is appended to main.
    //waiting is set to false and questionCounter is set to 0 before returning.
    function goBackHandler() {
        var name = document.querySelector("input[id='name-input']").value
    
        if(!name) name = "Anonymous"
    
        saveScore(name)
    
        main.removeChild(currentEls)
        currentEls = null
        main.appendChild(startingEls)
    
        quiz.waiting = false
        quiz.questionCounter = 0

        return
    }
    //This is the function that creates and returns each question to be appended to main.
    //Before the question is appended to the questionWrapper, it's "data-correct" attribute is set to the correct property of the current question.
    //For buttons are created in a for loop and in each pass has its "data-answer-id" set to x + 1.
    //feedback is created and before is appended to questionWrapper, it's visibility is set to "hidden",
    function createQuestion() {
        var questionWrapper = document.createElement("div")
        questionWrapper.className = "content"
    
        var question = document.createElement("h1")
        question.textContent = questions[quiz.questionCounter].question
        question.setAttribute("data-correct", questions[quiz.questionCounter].correct)
        questionWrapper.appendChild(question)
    
        var answerWrapper = document.createElement("div")
        answerWrapper.className = "answer-wrapper"
    
        for (var x = 0; x < 4; x++) {
            var answer = document.createElement("button")
            answer.textContent = questions[quiz.questionCounter][`${x + 1}`]
            answer.setAttribute("data-answer-id", x + 1)
            answer.className = "answer"
            answerWrapper.appendChild(answer)
        }
        questionWrapper.appendChild(answerWrapper)
    
        var feedback = document.createElement("p")
        feedback.textContent = "feedback"
        feedback.className = "feedback"
        feedback.style.visibility = "hidden"
        questionWrapper.appendChild(feedback)
    
        quiz.questionCounter++
    
        return questionWrapper;
    }
    //This function creates and returns the elements in the final tally.
    //The text of finalScore is affected by what the time is at the time of creation, thus showing the user their score.
    function createFinalTally() {
        var finalTally = document.createElement("div")
        finalTally.className = "content"
    
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
        inputWrapper.className = "input-wrapper"
        
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
//This is the function that shows the user the saved scores.
//The interval is cleared and the time is set to 0 to prevent the timer from continuing.
//If currentEls is not null then its removed from main, otherwise startingEls is removed from main.
//The scores are loaded. If the scores are null then only a label is appended to content.
//Otherwise, the scores are created based on how many scores there are, and the text content of the elements are set to the names and scores that are saved.
function viewScoresHandler(event) {
    event.preventDefault()
    
    clearInterval(quiz.timer)
    setTime(0)

    if(currentEls) {
        main.removeChild(currentEls)
    }
    else {
        main.removeChild(startingEls)
    }

    loadScores()

    currentEls = document.createElement("div")
    currentEls.className = "content"

    if (!quiz.scores) {
        var label = document.createElement("p")
        label.textContent = "There are no scores."
        currentEls.appendChild(label)
    }
    else {
        quiz.scores.forEach(element => {
            var container = document.createElement("div")
            container.className = "score-container"
            
            var name = document.createElement("p")
            name.textContent = "Name: " + element.savName
            container.appendChild(name)

            var score = document.createElement("p")
            score.textContent = "Score: " + element.savScore
            container.appendChild(score)

            currentEls.appendChild(container)
        });
    }
    var button = document.createElement("button")
    button.textContent = "Go Back"
    button.id = "return"
    currentEls.appendChild(button)

    main.appendChild(currentEls)
}
//This is the function that saves a name and the current time to local storage
//The current scores are loaded. If the scores are null, then the scores are assigned an empty array, and the name and time are added.
//Otherwise the name and time are pushed to the end of the list.
function saveScore(name) {
    loadScores()

    if (!quiz.scores) {
        quiz.scores = []
        quiz.scores.push({
            savName: name,
            savScore: quiz.time
        })
    }
    else {
        quiz.scores.push({
            savName: name,
            savScore: quiz.time
        })
    }

    localStorage.setItem("scores", JSON.stringify(quiz.scores))
}
//This is the function that loads the scores from local storage.
//If the scores are empty then scores is assigned null and the function returns.
//Otherwise the scores are parsed into the scores array.
function loadScores() {
    quiz.scores = localStorage.getItem("scores")
    if(!quiz.scores) {
        quiz.scores = null
        return
    }

    quiz.scores = JSON.parse(quiz.scores)
}
//This function sets text content of timerEl to replace the end with the parameter.
function setTime(time) {
    timerEl.textContent = "Time: " + time
}

main.addEventListener("click", buttonHandler)
viewScores.addEventListener("click", viewScoresHandler)