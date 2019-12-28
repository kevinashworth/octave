import { registerComponent, Components } from 'meteor/vulcan:core'
import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Form, Input, InputGroup, InputGroupAddon } from 'reactstrap'
import algoliasearch from 'algoliasearch/lite'
import { connectHits, connectPoweredBy, connectSearchBox, connectStateResults, Highlight, InstantSearch, SearchBox, Snippet } from 'react-instantsearch-dom'

const searchClient = algoliasearch('14RUP1OK0B', '2cd70a6b9a01c10aeaee6f6f11105f46')

const PoweredBy = ({ url }) => <a href={url} target='_blank' rel='noopener noreferrer'>Algolia</a>

const CustomPoweredBy = connectPoweredBy(PoweredBy)

// const SearchBox = ({ currentRefinement, refine }) => {
//   const onClick = () => refine('')
//   return (
//     <Form noValidate action='' role='search' inline={true}>
//       <InputGroup>
//         <Input placeholder='Search all of V8&hellip;'
//           type='search'
//           value={currentRefinement}
//           onChange={event => refine(event.currentTarget.value)}
//         />
//         <InputGroupAddon addonType='append'>
//           <Button onClick={onClick} close />
//         </InputGroupAddon>
//       </InputGroup>
//     </Form>
//   )
// }

// const CustomSearchBox = connectSearchBox(SearchBox);

const Hits = ({ hits }) => {
  return (
    <>
      <DropdownToggle nav></DropdownToggle>
      <DropdownMenu>
        <DropdownItem header>Search powered by <CustomPoweredBy /></DropdownItem>
        {hits.length === 0
          ? <DropdownItem>No search results</DropdownItem>
          : hits.map((hit) => {
              let history = useHistory()
              return (
                <DropdownItem key={hit.objectID} onClick={() => history.push(`${hit.url}`)}>
                  <Components.ErrorBoundary>
                    <Link to={hit.url}><Highlight attribute='name' hit={hit} /></Link><br />
                    <small className='text-muted'><Snippet attribute='body' hit={hit} /></small>
                  </Components.ErrorBoundary>
                </DropdownItem>
              )
            }
          )}
        </DropdownMenu>
    </>
  )
}

const CustomHits = connectHits(Hits)

const Content = connectStateResults(
  ({ searchResults, searchState }) =>
    searchState && searchState.query
    ? <CustomHits />
    : null
)

const Algolia = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const onSearchStateChange = searchState => {
    if (searchState.query.length) {
      setDropdownOpen(true)
    }
  }
  const toggle = () => setDropdownOpen(!isDropdownOpen)

  return (
    <InstantSearch
      searchClient={searchClient} indexName='dev_v8-alba-mlab'
      onSearchStateChange={onSearchStateChange}>
      <Dropdown isOpen={isDropdownOpen} direction='right' toggle={toggle} history={history}>
        <SearchBox translations={{ placeholder: 'Search all of V8…' }} />
        <Content history={history}/>
      </Dropdown>
    </InstantSearch>
  )
}

registerComponent('Search', Algolia)
