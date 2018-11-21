import { Components, registerComponent, withCurrentUser, withSingle } from 'meteor/vulcan:core'
import React from 'react'
import { Link } from 'react-router'
import PropTypes from 'prop-types'
import { Card, CardBody, CardHeader, CardText } from 'reactstrap'
import { dangerouslyCreateAddress } from '../../modules/helpers.js'
import Offices from '../../modules/offices/collection.js'

const OfficeMini = (props) => {
  if (props.loading) {
    return (<div><Components.Loading /></div>)
  }
  if (!props.document) {
    return (<div><Components.FormattedMessage id='app.404' /></div>)
  }

  const office = props.document
  const officeName = props.officeName ? props.officeName : office.displayName

  return (
    <Card className='card-accent-primary'>
      <CardHeader tag='h6'><Link to={`/offices/${office._id}`}>{officeName}</Link></CardHeader>
      <CardBody>
        {office.addresses &&
          office.addresses.map(address => {
            return (
              <CardText dangerouslySetInnerHTML={dangerouslyCreateAddress(address)} />
            )
          })
        }
      </CardBody>
    </Card>
  )
}

OfficeMini.propTypes = {
  documentId: PropTypes.string.isRequired
}

const options = {
  collection: Offices,
  fragmentName: 'OfficesSingleFragment'
}

registerComponent('OfficeMini', OfficeMini, withCurrentUser, [withSingle, options])
