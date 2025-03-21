import React from 'react'
import { useFela } from 'react-fela'
import Image from 'next/image'
import FeedEntry from '~/components/FeedEntry'

export default React.memo(function FeedArtEntry(props) {
  const { css } = useFela()
  const [width, height] = props.dimensions.split('x').map(Number)
  const displayWidth = 450
  const displayHeight = Math.round((displayWidth / width) * height)

  return (
    <FeedEntry icon='image' date={props.date}>
      {props.author} has made some art.
      <details open className={css({ maxWidth: displayWidth + 'px' })}>
        <summary className={css({ marginBottom: 'var(--s-base)' })}>
          + Toggle art display
        </summary>
        <Image
          src={'/assets/images/art/' + props.image}
          alt={'Artwork by' + props.author}
          layout='intrinsic'
          width={displayWidth}
          height={displayHeight}
        />
      </details>
    </FeedEntry>
  )
})
