import React from 'react'
import { useFela } from 'react-fela'
import Form from '~/components/QuestBuilderForm'
import Row from '~/components/Row'
import Title from '~/components/Title'
import Quest from '~/components/Quest'
import Page from '~/components/Page'
import serialization from '~/helpers/serialization'
import useNavigator from '~/hooks/useNavigator'

export default React.memo(function QuestBuilderRoot(props) {
  const { css } = useFela()
  const navigator = useNavigator()
  const { quest } = props
  const [currency, setCurrency] = React.useState(quest.currency || 'coins')
  const [amount, setAmount] = React.useState(quest.amount || 0)
  const [name, setName] = React.useState(quest.name || '')
  const [description, setDescription] = React.useState(quest.description || '')
  const [difficulty, setDifficulty] = React.useState(quest.difficulty || 1)

  const reset = React.useCallback(() => {
    setCurrency('coins')
    setAmount(0)
    setName('')
    setDescription('')
    setDifficulty(1)
  }, [])

  React.useEffect(() => {
    if (
      currency === 'coins' &&
      !amount &&
      !name &&
      !description &&
      difficulty === 1
    )
      navigator.replace('/quest')
    else
      navigator.replace(
        '/quest/' +
          serialization.quest.serialize({
            currency,
            amount,
            name,
            description,
            difficulty,
          })
      )
  }, [currency, amount, name, description, difficulty, navigator])

  return (
    <Page
      title='Create Your Quest'
      description='Design your very own Stormbound quest'
    >
      <div
        className={css({ maxWidth: '100%', width: '900px', margin: '0 auto' })}
      >
        <Row isDesktopOnly>
          <Row.Column>
            <Title>Your Quest</Title>
            <Quest
              currency={currency}
              amount={amount}
              name={name}
              description={description}
              difficulty={difficulty}
            />
          </Row.Column>
          <Row.Column>
            <Title>Settings</Title>
            <Form
              currency={currency}
              amount={amount}
              name={name}
              description={description}
              difficulty={difficulty}
              setCurrency={setCurrency}
              setAmount={setAmount}
              setName={setName}
              setDescription={setDescription}
              setDifficulty={setDifficulty}
              reset={reset}
            />
          </Row.Column>
        </Row>
      </div>
    </Page>
  )
})
