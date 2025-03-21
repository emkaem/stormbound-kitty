import s from '../../integration/dryRunner/selectors'
import getRawCardData from '~/helpers/getRawCardData'

const drawHand = ids => {
  Cypress.log({
    name: `DRAW_HAND`,
    message: `Draw cards ${ids
      .map(id => `‘${getRawCardData(id).name}’ (${id})`)
      .join(', ')} as initial hand`,
    consoleProps: () => ({ ids }),
  })

  ids.forEach(id => {
    if (!id.includes('_')) {
      id = id + '_0'
    }
    cy.get(s.DECK_CARD, { log: false })
      .filter('[data-testid*="' + id + '"]', { log: false })
      .find('button', { log: false })
      .first({ log: false })
      .click({ log: false })
  })
}

export default drawHand
