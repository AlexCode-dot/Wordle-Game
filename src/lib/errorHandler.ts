import { Response } from 'express'
import renderPage from './renderPage.js'

export function renderErrorPage(response: Response, status: number, errorType: string, message: string): void {
  response.status(status)
  renderPage(response, 'error', {
    status,
    errorType,
    message,
  })
}
