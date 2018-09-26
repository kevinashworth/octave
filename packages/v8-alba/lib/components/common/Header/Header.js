import { registerComponent } from 'meteor/vulcan:core'
import React, { PureComponent } from 'react'
import { NavbarBrand, NavbarToggler } from 'reactstrap'

class Header extends PureComponent {
  sidebarToggle (e) {
    e.preventDefault()
    document.body.classList.toggle('sidebar-hidden')
  }

  mobileSidebarToggle (e) {
    e.preventDefault()
    document.body.classList.toggle('sidebar-mobile-show')
  }

  render () {
    return (
      <header className='app-header navbar'>
        <NavbarToggler className='d-lg-none' onClick={this.mobileSidebarToggle}>
          <span className='navbar-toggler-icon' />
        </NavbarToggler>
        <NavbarBrand href='/'><img src='/img/favicon.png' height='40' /></NavbarBrand>
        <NavbarToggler className='d-md-down-none' onClick={this.sidebarToggle}>
          <span className='navbar-toggler-icon' />
        </NavbarToggler>
      </header>
    )
  }
}

registerComponent('Header', Header)
