/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/
const startingWords = [
  'college',
  'student',
  'project',
  'design',
  'coding',
  'website',
  'computer',
  'keyboard',
  'internet',
  'browser'
]

const maximumStrikes = 3
const startingPasses = 3

function scrambleWord(word) {
  let scrambled = shuffle(word)

  // Prevent the shuffled word from looking exactly the same
  if (scrambled === word) {
    scrambled = word.slice(1) + word[0]
  }

  return scrambled
}

function App() {
  // Get any previously saved words
  const savedWords = localStorage.getItem('words')

  let firstWords

  if (savedWords) {
    firstWords = JSON.parse(savedWords)
  } else {
    firstWords = shuffle(startingWords)
  }

  const savedPoints = localStorage.getItem('points')
  const savedStrikes = localStorage.getItem('strikes')
  const savedPasses = localStorage.getItem('passes')

  const [words, setWords] = React.useState(firstWords)

  const [points, setPoints] = React.useState(
    savedPoints ? Number(savedPoints) : 0
  )

  const [strikes, setStrikes] = React.useState(
    savedStrikes ? Number(savedStrikes) : 0
  )

  const [passes, setPasses] = React.useState(
    savedPasses !== null ? Number(savedPasses) : startingPasses
  )

  const [guess, setGuess] = React.useState('')
  const [message, setMessage] = React.useState(
    'Type your answer and press Enter.'
  )

  const [scrambledWord, setScrambledWord] = React.useState(
    firstWords.length > 0 ? scrambleWord(firstWords[0]) : ''
  )

  // Save the game whenever something changes
  React.useEffect(function () {
    localStorage.setItem('words', JSON.stringify(words))
    localStorage.setItem('points', points)
    localStorage.setItem('strikes', strikes)
    localStorage.setItem('passes', passes)
  }, [words, points, strikes, passes])

  const gameOver =
    words.length === 0 || strikes >= maximumStrikes

  function makeGuess(event) {
    event.preventDefault()

    const playerAnswer = guess.trim().toLowerCase()
    const correctAnswer = words[0].toLowerCase()

    if (playerAnswer === '') {
      setMessage('Please enter a word.')
      return
    }

    if (playerAnswer === correctAnswer) {
      const remainingWords = words.slice(1)

      setPoints(points + 1)
      setWords(remainingWords)
      setMessage('Correct! You earned one point.')

      if (remainingWords.length > 0) {
        setScrambledWord(scrambleWord(remainingWords[0]))
      }
    } else {
      setStrikes(strikes + 1)
      setMessage('Incorrect. Try the same word again.')
    }

    setGuess('')
  }

  function passWord() {
    if (passes > 0) {
      const remainingWords = words.slice(1)

      setPasses(passes - 1)
      setWords(remainingWords)
      setMessage('You passed that word.')

      if (remainingWords.length > 0) {
        setScrambledWord(scrambleWord(remainingWords[0]))
      }
    }
  }

  function restartGame() {
    const newWords = shuffle(startingWords)

    setWords(newWords)
    setPoints(0)
    setStrikes(0)
    setPasses(startingPasses)
    setGuess('')
    setMessage('A new game has started.')
    setScrambledWord(scrambleWord(newWords[0]))
  }

  return (
    <main className="game">
      <div className="game-box">
        <h1>Word Scramble</h1>
        <p className="instructions">
          Unscramble the word before reaching three strikes.
        </p>

        <div className="scores">
          <p>Points: {points}</p>
          <p>Strikes: {strikes} / {maximumStrikes}</p>
          <p>Passes: {passes}</p>
        </div>

        {!gameOver ? (
          <div>
            <p className="words-left">
              Words remaining: {words.length}
            </p>

            <h2 className="scrambled-word">
              {scrambledWord}
            </h2>

            <form onSubmit={makeGuess}>
              <label htmlFor="guess">Your answer:</label>

              <input
                id="guess"
                type="text"
                value={guess}
                onChange={function (event) {
                  setGuess(event.target.value)
                }}
                autoComplete="off"
              />

              <button type="submit">
                Guess
              </button>
            </form>

            <button
              type="button"
              className="pass-button"
              onClick={passWord}
              disabled={passes === 0}
            >
              {passes === 0 ? 'No Passes Left' : 'Pass'}
            </button>
          </div>
        ) : (
          <div className="game-over">
            <h2>Game Over</h2>

            {words.length === 0 ? (
              <p>You completed all the words!</p>
            ) : (
              <p>You reached the maximum number of strikes.</p>
            )}

            <p>Your final score is {points}.</p>

            <button
              type="button"
              onClick={restartGame}
            >
              Play Again
            </button>
          </div>
        )}

        <p className="message">{message}</p>
      </div>
    </main>
  )
}

const root = ReactDOM.createRoot(
  document.getElementById('root')
)

root.render(<App />)