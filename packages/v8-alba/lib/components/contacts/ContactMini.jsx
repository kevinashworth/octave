import { Components, registerComponent, withCurrentUser, withSingle } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
// import { CardText } from 'reactstrap'
import Card from 'react-bootstrap/Card'

import Contacts from '../../modules/contacts/collection.js'

const ContactMini = (props) => {
  if (props.loading) {
    return <Components.Loading />
  }
  if (!props.document) {
    return <FormattedMessage id='app.404' />
  }

  const contact = props.document
  return (
    <Card.Text>
      <Link to={`/contacts/${contact._id}/${contact.slug}`}>
        {contact.firstName} {contact.middleName} <strong>{contact.lastName}</strong>
      </Link> ({contact.title})
    </Card.Text>
  )
}

ContactMini.propTypes = {
  documentId: PropTypes.string.isRequired
}

const options = {
  collection: Contacts,
  fragmentName: 'ContactsSingleFragment'
}

registerComponent({
  name: 'ContactMini',
  component: ContactMini,
  hocs: [
    withCurrentUser,
    [withSingle, options]
  ]
})
