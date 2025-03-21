import React from 'react'
import querystring from 'querystring'
import { CollectionContext } from '~/components/CollectionProvider'
import BookmarkDeckButton from '~/components/BookmarkDeckButton'
import Decks from '~/components/Decks'
import EmptySearch from '~/components/EmptySearch'
import Page from '~/components/Page'
import ImportCollection from '~/components/ImportCollection'
import Info from '~/components/Info'
import LearnMoreIcon from '~/components/LearnMoreIcon'
import Only from '~/components/Only'
import Row from '~/components/Row'
import Spacing from '~/components/Spacing'
import FeaturedDecksFilters from '~/components/FeaturedDecksFilters'
import Title from '~/components/Title'
import useQueryParams from '~/hooks/useQueryParams'
import useNavigator from '~/hooks/useNavigator'
import sortFeaturedDecks from '~/helpers/sortFeaturedDecks'
import getDeckSearchDescription from '~/helpers/getDeckSearchDescription'
import getFactionFromDeckID from '~/helpers/getFactionFromDeckID'
import serialization from '~/helpers/serialization'

export default React.memo(function FeaturedDecks(props) {
  const query = useQueryParams()
  const navigator = useNavigator()
  const formRef = React.useRef(null)
  const { collection, hasDefaultCollection } =
    React.useContext(CollectionContext)
  const [tags, setTags] = React.useState(query.tags?.split(',') ?? [])
  const [faction, setFaction] = React.useState(query.faction || '*')
  const [author, setAuthor] = React.useState(query.author || '*')
  const [including, setIncluding] = React.useState(query.including || null)
  const [name, setName] = React.useState('')
  const [order, setOrder] = React.useState(
    hasDefaultCollection ? 'DATE' : 'FEASIBILITY'
  )
  const state = { tags, faction, author, including, name }

  const resetFilters = React.useCallback(() => {
    setFaction('*')
    setTags([])
    setAuthor('*')
    setName('')
    setIncluding(null)
  }, [])

  React.useEffect(() => {
    const parameters = { ...query }

    if (tags.length === 0) delete parameters.tags
    else parameters.tags = tags.join(',')

    if (faction === '*') delete parameters.faction
    else parameters.faction = faction

    if (author === '*') delete parameters.author
    else parameters.author = author

    if (including === null) delete parameters.including
    else parameters.including = including

    if (querystring.stringify(parameters) !== querystring.stringify(query)) {
      const path =
        Object.keys(parameters).length > 0
          ? '/deck/featured?' + querystring.stringify(parameters)
          : '/deck/featured'

      navigator.replace(path)
    }
  }, [navigator, query, tags, faction, author, including])

  const matchesFaction = React.useCallback(
    deck => faction === '*' || getFactionFromDeckID(deck.id) === faction,
    [faction]
  )

  const matchesTags = React.useCallback(
    deck => tags.length === 0 || tags.every(tag => deck.tags.includes(tag)),
    [tags]
  )

  const matchesAuthor = React.useCallback(
    deck => author === '*' || deck.author === author,
    [author]
  )

  const matchesName = React.useCallback(
    deck =>
      name === '' ||
      deck.name.toLowerCase().replace('’', "'").includes(name.toLowerCase()),
    [name]
  )

  const matchesIncluding = React.useCallback(
    deck =>
      !including ||
      serialization.deck
        .deserialize(deck.id)
        .map(card => card.id)
        .includes(including),
    [including]
  )

  const sortFn = sortFeaturedDecks({ hasDefaultCollection, collection }, order)
  const decks = React.useMemo(
    () =>
      props.decks
        .slice(0)
        // New decks are added at the end of the JSON file, but should be
        // displayed first, therefore we reverse the array before filtering and
        // sorting it.
        .reverse()
        .filter(matchesFaction)
        .filter(matchesTags)
        .filter(matchesAuthor)
        .filter(matchesName)
        .filter(matchesIncluding)
        .sort(sortFn),
    [
      props.decks,
      sortFn,
      matchesFaction,
      matchesTags,
      matchesAuthor,
      matchesName,
      matchesIncluding,
    ]
  )

  return (
    <Page
      title='Featured Decks'
      description={getDeckSearchDescription(state)}
      meta={decks.length === 1 ? '1 deck' : `${decks.length} decks`}
      action={{
        to: '/deck/collection',
        children: 'Your decks',
        icon: 'arrow-right',
      }}
    >
      <Row isDesktopOnly>
        <Row.Column width='1/3'>
          <Title>Filters</Title>

          <FeaturedDecksFilters
            {...state}
            order={order}
            decks={props.decks}
            updateTags={setTags}
            updateFaction={setFaction}
            updateAuthor={setAuthor}
            updateName={setName}
            updateIncluding={setIncluding}
            updateOrder={setOrder}
            resetFilters={resetFilters}
            formRef={formRef}
          />
          <Spacing top='LARGE'>
            {order === 'FEASIBILITY' && (
              <Only.CustomCollection>
                <Info icon='books' title='Your collection'>
                  <p>
                    Decks are ordered based on the cards in{' '}
                    <span className='Highlight'>your collection</span>. That
                    means decks you can make with your highest cards are at the
                    top of the list and decks containing cards you do not
                    possess are downranked.
                  </p>
                </Info>
              </Only.CustomCollection>
            )}
            <Only.Desktop>
              <Only.DefaultCollection>
                <Info
                  icon='books'
                  title={
                    <>
                      Your collection
                      <LearnMoreIcon anchor='#collection-benefits' />
                    </>
                  }
                  CTA={<ImportCollection />}
                >
                  <p>
                    If you have already created your collection, you can import
                    it so decks are sorted by how well they would perform based
                    on the level of your cards.
                  </p>
                </Info>
              </Only.DefaultCollection>
            </Only.Desktop>
          </Spacing>
        </Row.Column>
        <Row.Column width='2/3'>
          <Title>Decks</Title>
          {decks.length > 0 ? (
            <Decks
              decks={decks}
              withBookmarking
              showUpgrades
              actions={deck => [<BookmarkDeckButton key={deck.id} {...deck} />]}
            />
          ) : (
            <EmptySearch title='No Decks found' resetFilters={resetFilters} />
          )}
        </Row.Column>
      </Row>
    </Page>
  )
})
