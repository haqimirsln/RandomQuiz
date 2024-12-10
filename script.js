let currentQuestion = 0;
let quizData = [];
let shuffledQuestions = [];
let score = 0; // Variable to keep track of the user's score

// Elements
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("next-button");
const restartButton = document.getElementById("restart-button");

// Fetch questions from the Open Trivia Database API
async function fetchQuestions() {
  try {
    const response = await fetch(
      "https://opentdb.com/api.php?amount=10&type=multiple"
    );
    const data = await response.json();
    if (data.results) {
      quizData = data.results;
      shuffledQuestions = shuffleArray([...quizData]);
      currentQuestion = 0;
      score = 0; // Reset score at the start of a new quiz
      loadQuestion();
    } else {
      console.error("No questions found");
    }
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
}

// Shuffle function to randomize quiz order
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Load the current question
function loadQuestion() {
  if (currentQuestion < shuffledQuestions.length) {
    const currentQuiz = shuffledQuestions[currentQuestion];
    questionElement.textContent = currentQuiz.question;
    optionsElement.innerHTML = "";

    const allOptions = [
      ...currentQuiz.incorrect_answers,
      currentQuiz.correct_answer,
    ];
    shuffleArray(allOptions);

    allOptions.forEach((option, index) => {
      const button = document.createElement("button");
      button.textContent = option;
      button.addEventListener("click", () =>
        selectAnswer(option, currentQuiz.correct_answer)
      );
      optionsElement.appendChild(button);
    });

    nextButton.classList.add("hidden");
  } else {
    questionElement.textContent = `Quiz Completed! 🎉 Your Score: ${score} out of ${shuffledQuestions.length}`;
    optionsElement.innerHTML = "";
    nextButton.classList.add("hidden");
    restartButton.classList.remove("hidden");
  }
}

// Handle answer selection
function selectAnswer(selectedOption, correctOption) {
  const buttons = optionsElement.querySelectorAll("button");
  buttons.forEach((button) => {
    button.disabled = true;
    if (button.textContent === correctOption) {
      button.classList.add("correct");
    } else if (button.textContent === selectedOption) {
      button.classList.add("wrong");
    }
  });

  if (selectedOption === correctOption) {
    score++; // Increment score if the answer is correct
  }

  nextButton.classList.remove("hidden");
}

// Event listeners for buttons
nextButton.addEventListener("click", () => {
  currentQuestion++;
  loadQuestion();
});

restartButton.addEventListener("click", () => {
  currentQuestion = 0;
  shuffledQuestions = shuffleArray([...quizData]);
  score = 0; // Reset score for the new quiz
  loadQuestion();
  restartButton.classList.add("hidden");
  nextButton.classList.add("hidden");
});

// Start the quiz when the page loads
fetchQuestions();
