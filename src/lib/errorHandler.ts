import { Response } from 'express'
import renderPage from './renderPage'

export function renderErrorPage(response: Response, status: number, errorType: string, message: string) {
  response.status(status)
  renderPage(response, 'error', {
    status,
    errorType,
    message,
  })
}
