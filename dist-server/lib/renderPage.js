'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.default = renderPage
const menu = [
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
async function renderPage(response, page, additionalData = {}) {
  response.render(page, {
    menuItems: menu.map((item) => ({
      label: item.label,
      link: item.link,
      active: item.id === page,
    })),
    ...additionalData,
  })
}
