import { registerComponent, Components, withAccess } from 'meteor/vulcan:core'
import React, { forwardRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Media from 'react-media'
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import algoliasearch from 'algoliasearch/lite'
import { Configure, connectHits, connectSearchBox, connectStateResults, Highlight, InstantSearch, PoweredBy, Snippet } from 'react-instantsearch-dom'

// eslint-disable-next-line react/display-name
const CustomToggle = forwardRef(({ children }, ref) => (
  <span ref={ref}>
    {children}
  </span>
))

const popperConfig = {
  modifiers: [{
    name: 'offset',
    options: {
      offset: [0, 120]
    }
  }]
}

const applicationid = Meteor.settings.public.algolia.ApplicationID
const searchonlyapikey = Meteor.settings.public.algolia.SearchOnlyAPIKey
const algoliaindex = Meteor.settings.public.algolia.AlgoliaIndex
const searchClient = algoliasearch(applicationid, searchonlyapikey)

const Hits = ({ hits }) => {
  const history = useHistory()
  return (
    <>
      <Dropdown.Toggle as={CustomToggle} id='algolia-dropdown' />
      <Dropdown.Menu popperConfig={popperConfig}>
        <Dropdown.Header className='text-right'><PoweredBy /></Dropdown.Header>
        {hits.length === 0
          ? <Dropdown.Item disabled>No search results</Dropdown.Item>
          : hits.map((hit) => {
            const handleClick = (event) => {
              event.preventDefault()
              history.push(`${hit.url}`)
            }
            return (
              <Dropdown.Item key={hit.objectID} onClick={handleClick} href={hit.url} data-cy='search-result'>
                <Components.ErrorBoundary>
                  <Highlight attribute='name' hit={hit} />{' '}
                  <small className='text-muted'><Snippet attribute='body' hit={hit} /></small>
                </Components.ErrorBoundary>
              </Dropdown.Item>
            )
          })}
      </Dropdown.Menu>
    </>
  )
}

const CustomHits = connectHits(Hits)

const CustomSearchResults = connectStateResults(
  ({ searchState }) =>
    searchState && searchState.query
      ? <CustomHits />
      : null
)

const SearchBox = ({ currentRefinement, refine }) => {
  return (
    <InputGroup>
      <FormControl
        data-cy='search-input'
        onChange={event => refine(event.currentTarget.value)}
        placeholder='Search…'
        value={currentRefinement}
      />
      {currentRefinement &&
        <InputGroup.Append>
          <Button onClick={() => refine('')}><i className='fas fa-times' /></Button>
        </InputGroup.Append>}
    </InputGroup>
  )
}

const CustomSearchBox = connectSearchBox(SearchBox)

const Algolia = () => {
  const [show, setShow] = useState(false)
  const handleSearchStateChange = searchState => {
    if (searchState.query && searchState.query.length) {
      setShow(true)
    }
  }
  const toggle = () => setShow(!show)
  const breakpoints = [555, 720, 885, 1215]
  return (
    <InstantSearch
      indexName={algoliaindex}
      onSearchStateChange={handleSearchStateChange}
      searchClient={searchClient}
    >
      <Media
        queries={{
          xs: { maxHeight: breakpoints[0] },
          sm: { minHeight: breakpoints[0] + 1, maxHeight: breakpoints[1] },
          md: { minHeight: breakpoints[1] + 1, maxHeight: breakpoints[2] },
          lg: { minHeight: breakpoints[2] + 1, maxHeight: breakpoints[3] },
          xl: { minHeight: breakpoints[3] + 1 }
        }}
      >
        {matches => (
          <>
            {matches.xs && <Configure hitsPerPage={6} />}
            {matches.sm && <Configure hitsPerPage={9} />}
            {matches.md && <Configure hitsPerPage={12} />}
            {matches.lg && <Configure hitsPerPage={18} />}
            {matches.xl && <Configure hitsPerPage={24} />}
          </>
        )}
      </Media>
      <CustomSearchBox />
      <Dropdown show={show} drop='right' onToggle={toggle}>
        <CustomSearchResults />
      </Dropdown>
    </InstantSearch>
  )
}

const accessOptions = {
  groups: ['participants', 'editors', 'admins']
}

registerComponent({
  name: 'Search',
  component: Algolia,
  hocs: [[withAccess, accessOptions]]
})
