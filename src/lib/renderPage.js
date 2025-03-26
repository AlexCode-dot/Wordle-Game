export default async function renderPage(response, page, additionalData = {}) {
  response.render(page, {
    ...additionalData,
  })
}
