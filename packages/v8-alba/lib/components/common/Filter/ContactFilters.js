import { registerComponent } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
// import {
//   ButtonDropdown,
//   ButtonGroup,
//   CustomInput,
//   DropdownItem,
//   DropdownMenu,
//   DropdownToggle
// } from 'reactstrap'
// import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Dropdown from 'react-bootstrap/Dropdown'
// import DropdownButton from 'react-bootstrap/DropdownButton'
import Form from 'react-bootstrap/Form'
import styled from 'styled-components'
import withFilters from '../../../modules/hocs/withFilters.js'

// DropdownItemStatic:
// I simply copied pertinent-seeming styles generated by a DropdownItem,
// but there is no "flash" of primary color when you check a box.
const DropdownItemStatic = styled.div`
  border-bottom: 1px solid #c2cfd6;
  padding: 10px 20px;
  white-space: nowrap;
`

// Set initial state. Just options I want to keep.
// See https://github.com/amannn/react-keep-state
let keptState = {
  titleColor: 'secondary',
  updatedColor: 'secondary',
  locationColor: 'secondary'
}

class ContactFilters extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      dropdownShow: new Array(3).fill(false),
      ...keptState
    }
    // this.toggle = this.toggle.bind(this)
    // this.handleClickContactTitle = this.handleClickContactTitle.bind(this)
    // this.handleClickContactLocation = this.handleClickContactLocation.bind(this)
    // this.handleClickDropdownTitle = this.handleClickDropdownTitle.bind(this)
    // this.handleChange = this.handleChange.bind(this)
  }

  componentWillUnmount () {
    // Remember state for the next mount
    keptState = {
      titleColor: this.state.titleColor,
      updatedColor: this.state.updatedColor,
      locationColor: this.state.locationColor
    }
  }

  // TODO: these 3 handlers are too simple, doesn't set colors back to 'secondary' except when 'All' is clicked
  // TODO: DRY these various handlers
  handleChange = (event)=> {
    const i = parseInt(event.target.id, 10)
    if (event.target.name === 'contactTitle') {
      this.props.actions.toggleContactTitleFilter(i)
      this.setState({ titleColor: 'danger' })
    }
    if (event.target.name === 'contactUpdated') {
      const all = event.target.labels[0].innerHTML.indexOf('All') !== -1
      this.props.actions.toggleContactUpdatedFilter(i)
      if (all) {
        this.setState({ updatedColor: 'secondary' })
      } else {
        this.setState({ updatedColor: 'danger' })
      }
    }
    if (event.target.name === 'contactLocation') {
      this.props.actions.toggleContactLocationFilter(i)
      this.setState({ locationColor: 'danger' })
    }
  }

  handleClickContactLocation = (event) => {
    const all = event.target.innerHTML.indexOf('All') !== -1
    const none = event.target.innerHTML.indexOf('None') !== -1
    const toggle = event.target.innerHTML.indexOf('Toggle') !== -1
    const length = this.props.contactLocationFilters.length
    if (toggle) {
      for (let i = 0; i < length; i++) {
        this.props.actions.toggleContactLocationFilter(i)
      }
    } else { // for All and for None
      for (let i = 0; i < length; i++) {
        if ((this.props.contactLocationFilters[i].value && none) || (!this.props.contactLocationFilters[i].value && !none)) {
          this.props.actions.toggleContactLocationFilter(i)
        }
      }
    }
    if (all) {
      this.setState({ locationColor: 'secondary' })
    }
    if (none) {
      this.setState({ locationColor: 'danger' })
    }
  }

  handleClickContactTitle = (event) => {
    event.stopPropagation()
    console.log('hCCT!')

    let dropdownShow = Array(3).fill(false)
    dropdownShow[0] = true
    this.setState({ dropdownShow })

    const all = event.target.innerHTML.indexOf('All') !== -1
    const none = event.target.innerHTML.indexOf('None') !== -1
    const toggle = event.target.innerHTML.indexOf('Toggle') !== -1
    const length = this.props.contactTitleFilters.length
    if (toggle) {
      for (let i = 0; i < length; i++) {
        this.props.actions.toggleContactTitleFilter(i)
      }
    } else if (all || none) {
      for (let i = 0; i < length; i++) {
        if ((this.props.contactTitleFilters[i].value && none) || (!this.props.contactTitleFilters[i].value && !none)) {
          this.props.actions.toggleContactTitleFilter(i)
        }
      }
    }
    if (all) {
      this.setState({ titleColor: 'secondary' })
    }
    if (none) {
      this.setState({ titleColor: 'danger' })
    }
  }

  handleClickDropdownTitle = (event) => {
    event.stopPropagation()
    console.log('hCDT!')
    this.toggle(0)
  }

  handleClickDropdownUpdated = (event) => {
    event.stopPropagation()
    console.log('hCDU!')
    this.toggle(1)
  }

  handleFormCheckClick = (event) => {
    event.stopPropagation()
    console.log('hFCC!')
  }

  toggle = (i) => {
    const newArray = this.state.dropdownShow.map((element, index) => { return (index === i ? !element : false) })
    this.setState({
      dropdownShow: newArray
    })
  }

  toggleCallback = (isOpen, event, metadata) => {
    console.log('toggleCallback')
    console.log('isOpen:', isOpen)
    console.log('event:', event)
    console.log('metadata:', metadata)
  }

  render () {
    return (
      <div className='float-right'>
        <Dropdown onToggle={this.toggleCallback}>
          <Dropdown.Toggle
            id="dropdown-title"
            onClick={this.handleClickDropdownTitle}
            variant={this.state.titleColor}
          >
            Title
          </Dropdown.Toggle>
          <Dropdown.Menu show={this.state.dropdownShow[0]}>
            <Dropdown.Header>Filter contacts by title</Dropdown.Header>
            <DropdownItemStatic>
              {this.props.contactTitleFilters.map((contact, index) =>
                <Form.Check
                  checked={contact.value}
                  id={`${index}-title`}
                  key={`${contact.contactTitle}`}
                  label={`${contact.contactTitle}`}
                  name='contactTitle'
                  onChange={this.handleChange}
                  onClick={this.handleFormCheckClick}
                />
              )}
            </DropdownItemStatic>
            <Dropdown.Item onClick={this.handleClickContactTitle}>All</Dropdown.Item>
            <Dropdown.Item onClick={this.handleClickContactTitle}>None</Dropdown.Item>
            <Dropdown.Item onClick={this.handleClickContactTitle}>Toggle</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown>
          <Dropdown.Toggle
            id='dropdown-last-updated'
            onClick={this.handleClickDropdownUpdated}
            variant={this.state.updatedColor}
          >
            Last updated
          </Dropdown.Toggle>
          <Dropdown.Menu show={this.state.dropdownShow[1]}>
            <Dropdown.Header>Filter contacts by last updated</Dropdown.Header>
            <DropdownItemStatic>
              {this.props.contactUpdatedFilters.map((filter, index) =>
                <Form.Check
                  checked={filter.value}
                  id={`${index}-updated`}
                  key={`${filter.contactUpdated}`}
                  label={`${filter.contactUpdated}`}
                  name='contactUpdated'
                  onChange={this.handleChange}
                  onClick={this.handleFormCheckClick}
                  type='radio'
                />
              )}
            </DropdownItemStatic>
          </Dropdown.Menu>
        </Dropdown>
          {/* <DropdownButton title='Last updated' className={vertical ? 'mb-2' : 'ml-2'}>
            <Dropdown.Item header>Filter contacts by last updated</Dropdown.Item>
            <Dropdown.Item>
              {this.props.contactUpdatedFilters.map((filter, index) =>
                <CustomInput type='radio' name='contactUpdated'
                  id={`${index}-updated`} key={`${filter.contactUpdated}`} label={`${filter.contactUpdated}`}
                  checked={filter.value} onChange={this.handleChange} />
              )}
            </Dropdown.Item>
          </DropdownButton>
          <DropdownButton className={vertical ? 'mb-2' : 'ml-2'} isOpen={this.state.dropdownShow[2]} toggle={() => { this.toggle(2) }}>
            <DropdownToggle caret color={this.state.locationColor}>
              Location
            </DropdownToggle>
            <DropdownMenu>
              <Dropdown.Item header>Filter contacts by location</Dropdown.Item>
              <Dropdown.Item>
                {this.props.contactLocationFilters.map((contact, index) =>
                  <CustomInput type='checkbox' name='contactLocation'
                    id={`${index}-location`} key={`${contact.contactLocation}`} label={`${contact.contactLocation}`}
                    checked={contact.value} onChange={this.handleChange} />
                )}
              </Dropdown.Item>
              <Dropdown.Item onClick={this.handleClickContactLocation} toggle={false}>All</Dropdown.Item>
              <Dropdown.Item onClick={this.handleClickContactLocation} toggle={false}>None</Dropdown.Item>
              <Dropdown.Item onClick={this.handleClickContactLocation} toggle={false}>Toggle</Dropdown.Item>
            </DropdownMenu>
          </DropdownButton> */}
      </div>
    )
  }
}

ContactFilters.propTypes = {
  vertical: PropTypes.bool
}

registerComponent('ContactFilters', ContactFilters, withFilters)
