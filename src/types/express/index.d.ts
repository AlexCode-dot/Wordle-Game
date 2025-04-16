import 'express-session'
import { SessionGame } from '../game'

declare module 'express-session' {
  interface Session {
    game: SessionGame
  }
}
