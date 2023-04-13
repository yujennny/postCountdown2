import axios from "axios";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

function App() {
  const [question, setQuestion] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [errorMess, setErrorMes] = useState("Welcome!");
  const [possibleAns, setPossibleAns] = useState([]);
  const [loading, setLoading] = useState(false);

  async function combineAllAnswers(incorrectAnswers, correctAnswer) {
    let allAnswers = [];
    incorrectAnswers.incorrect_answers.map((incorrectAnswer) => {
      allAnswers.push(incorrectAnswer);
    });

    allAnswers.push(correctAnswer);
    setPossibleAns(allAnswers);
  }

  //Make api call to trivia api
  async function getTriviaData() {
    //Set loading boolean to true so that we know to show loading text
    setLoading(true);

    //Make trivia api call using axios
    const resp = await axios.get(
      "https://opentdb.com/api.php?amount=1&category=19&type=boolean"
    );
    setQuestion(resp.data.results);
    setCorrectAnswer(resp.data.results[0].correct_answer);
    //Combines correct and incorrect answers into single array
    await combineAllAnswers(
      resp.data.results[0],
      resp.data.results[0].correct_answer
    );

    setLoading(false);
  }

  useEffect(() => {
    getTriviaData();
  }, []);

  function verifyAnswer(selectedAnswer) {
    //If the selected answer equals the correct answer, then we get the next trivia quesiton and increase the current points by 1
    if (selectedAnswer === correctAnswer) {
      getTriviaData();
      setErrorMes("Great job! ");
    } else {
      //If the selected answer does not equal the correct answer, decreaes the current points by 1

      setErrorMes("Incorrect. Try again! ");
    }
  }

  //Converts html code to regular characters
  function convert(question) {
    return question
      .replace(/(&quot\;)/g, '"')
      .replace(/(&rsquo\;)/g, '"')
      .replace(/(&#039\;)/g, "'")
      .replace(/(&amp\;)/g, '"')
      .replace(/(&ocirc\;)/g, "ô");
  }

  return (
    <div className="App">
      <header className="App-header">
        {loading ? (
          "Fetching questions... "
        ) : (
          <div>
            <br />
            <div>
              <Typography variant="h5" color="primary">
                Math Trivia Game! :D
              </Typography>
              <Typography variant="h6" color="blue">
                {errorMess}
              </Typography>
              <Typography variant="h8" color="primary">
                Next Question:
              </Typography>
            </div>
            {question.map((triviaData, index) => (
              <div key={index}>
                <div>{convert(triviaData.question)}</div>
                <br />
                <div>
                  {possibleAns.map((answer, index) => (
                    <div key={index}>
                      <Button
                        variant="outlined"
                        color="success"
                        size="small"
                        key={index}
                        onClick={() => verifyAnswer(answer)}
                      >
                        {answer}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
