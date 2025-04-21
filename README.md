# Wordle Game

A fullstack TypeScript-based Wordle clone supporting multiple languages (English and Swedish),
dynamic word sources (local/remote), game state persistence via sessions,
and leaderboard scoring with MongoDB.

## Features

- Word guessing game with real-time feedback
- Selectable language (`English` / `Swedish`)
- Option to use local or remote word sources
- Backend rendered leaderboard
- Session-based game state and validation
- Secure score submission
- Tested with Jest and Cypress
- Deployable to platforms like Render

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
npm install
```

### 2. Setup .env

```bash
cp .env.example .env
```

## .env

SESSION_SECRET=your-session-secret
MONGO_URI=mongodb+srv://...

# (Optional) Choose data source for word lists: "local" or "remote"

WORD_SOURCE=local # or remote (if empty "local" is default)

# (Optional) Override default remote URLs

REMOTE_WORDS_EN=https://raw.githubusercontent.com/dwyl/english-words/master/words_dictionary.json
REMOTE_WORDS_SV=https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/sv/sv_50k.txt

### 3. Build and start

```bash
npm run build        # Builds frontend and backend
npm run build-and-start # Builds and starts the app
npm start # Start the app
```

### 4. Testing

```bash
npm test         # Runs Jest backend tests
npm run test:e2e # Runs Cypress end-to-end tests
npm run test:all # Runs both Jest + Cypress
```
