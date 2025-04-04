import express from 'express'
import initGame from '../services/initGame.js'
import wordFeedBack from '../services/wordFeedback.js'

const router = express.Router()

let gameData = '' //Simulate database data

export default function apiRoutes(api) {
  router.post('/games', async (req, res, next) => {
    try {
      const { wordLength, noLetterDuplicate } = req.body

      const gameSettings = {
        wordLength: Number(wordLength),
        noLetterDuplicate: Boolean(noLetterDuplicate),
      }

      const gameStatus = await initGame(api, gameSettings)

      if (!gameStatus.gameStarted) {
        return res.status(400).json({ message: gameStatus.message, gameStarted: false })
      }

      req.session.game = {
        correctWord: gameStatus.correctWord,
        startTime: Date.now(),
        rules: gameSettings
      };
      console.log(req.session)

      //gameData = gameStatus.correctWord //Simulate database data

      res.status(201).json({
        wordLength: gameStatus.wordLength,
        gameStarted: gameStatus.gameStarted,
      })
    } catch (err) {
      next(err)
    }
  })

  router.get('/words/lengths', async (req, res, next) => {
    try {
      const words = await api.loadWords()
      const wordLengths = [...new Set(words.map((word) => word.length))]
      wordLengths.sort((a, b) => a - b)
      res.json(wordLengths)
    } catch (err) {
      next(err)
    }
  })

  router.post('/games/guesses', (req, res, next) => {
    try {
      const { guessedWord } = req.body

      if (!guessedWord || typeof guessedWord !== 'string') {
        return res.status(400).json({ error: 'Invalid input. A valid guessed word (string) is required.' })
      }

      const correctWord = req.session.game.correctWord //Simulate database data
      const feedback = wordFeedBack(guessedWord, correctWord)
      res.json(feedback)
    } catch (err) {
      next(err)
    }
  })

  router.get('/games/correct-word', async (req, res, next) => {
    try {
      res.json(gameData) //Simulate database data
    } catch (err) {
      next(err)
    }
  })

  router.post('/submit-score', async (req, res) => {
    const { name, guessCount } = req.body;
  
    const { correctWord, rules, startTime } = req.session.game;
  
    if (!correctWord || !rules || !startTime) {
      return res.status(400).json({ error: 'Missing session data' });
    }
  
    const timeTakenMs = Date.now() - startTime;
    const minutes = Math.floor(timeTakenMs / 60000); // 1 minute = 60000 milliseconds
  const seconds = Math.floor((timeTakenMs % 60000) / 1000); // remaining seconds
  
  // Format minutes and seconds as 'mm:ss'
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;


    // Create the result object to store in the database
    const score = {
      name,
      guessCount,
      correctWord,
      timeTaken: formattedTime,
      rules, // e.g., noLetterDuplicate, wordLength
    };

    const newScore = new api.HighScore(score);
  
    try {
      // Save the score in the database
      await newScore.save();
  
      // Destroy the session after saving the score
      req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
          return res.status(500).json({ error: 'Failed to destroy session.' });
        }
  
        console.log('Session after destroy:', req.session);

        // Send success response
        res.json({ success: true });
      });
    } catch (err) {
      console.error('Error saving score:', err);
      res.status(500).json({ error: 'Failed to submit score.' });
    }
  });
  

  return router
}
