import { Response } from 'express'
import { MenuItem, AdditionalData } from '../types'

const menu: MenuItem[] = [
  {
    label: 'PLAY',
    id: 'play',
    link: '/',
  },
  {
    label: 'LEADERBOARD',
    id: 'leaderboard',
    link: '/leaderboard',
  },
  {
    label: 'ABOUT US',
    id: 'about',
    link: '/about',
  },
]

export default async function renderPage(
  response: Response,
  page: string,
  additionalData: AdditionalData = {}
): Promise<void> {
  response.render(page, {
    menuItems: menu.map((item) => ({
      label: item.label,
      link: item.link,
      active: item.id === page,
    })),
    ...additionalData,
  })
}
