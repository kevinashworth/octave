import { Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core'
import React from 'react'
import { Link } from 'react-router'
import PropTypes from 'prop-types'
import { Button, Card, CardBody, CardFooter, CardLink, CardText, CardTitle } from 'reactstrap'
import moment from 'moment'
import { DATE_FORMAT_SHORT } from '../../modules/constants.js'

const ContactModal = (props) => {
  if (props.loading) {
    return (<div><Components.Loading /></div>)
  }

  if (!props.document) {
    return (<div><Components.FormattedMessage id='app.404' /></div>)
  }

  const contact = props.document
  const displayDate =
      'Contact added ' + moment(contact.createdAt).format(DATE_FORMAT_SHORT) + ' / ' +
      'Last modified ' + moment(contact.updatedAt).format(DATE_FORMAT_SHORT)
  const createAddress = (address) => {
    let streetAddress = ''
    if (address.street1) {
      streetAddress = address.street1 + '<br/>'
    }
    if (address.street2 && address.street2.trim().length > 0) {
      streetAddress += address.street2 + '<br/>'
    }
    if (address.city) {
      streetAddress += address.city + ', '
    }
    if (address.state) {
      streetAddress += address.state
    }
    if (address.zip) {
      streetAddress += '  ' + address.zip
    }
    if (address.street1 && address.city && address.state) {
      streetAddress += `<br/><small><a href="https://maps.google.com/?q=${address.street1},${address.city},${address.state}" target="_maps">Open in Google Maps</a></small>`
    }
    return { __html: streetAddress }
  }

  return (
    <div className='animated fadeIn'>
      <Card className='card-accent-warning'>
        <CardBody>
          <CardText tag='div'>
            { contact.displayName }
            { contact.title && <div>{contact.title}</div> }
            { contact.gender && <div>{contact.gender}</div> }
            <hr />
            {contact.htmlBody
              ? <div dangerouslySetInnerHTML={{ __html: contact.htmlBody }} />
              : <div>{ contact.body }</div>
            }
          </CardText>
        </CardBody>
        {contact.addresses &&
        <CardBody>
          { contact.addresses[1] && <CardTitle>Addresses</CardTitle>}
          {contact.addresses.map((address, index) =>
            <CardText key={`address${index}`} dangerouslySetInnerHTML={createAddress(address)} />
          )}
        </CardBody>
        }
        {contact.projects &&
        <CardBody>
          <CardTitle>Projects</CardTitle>
          {contact.projects.map(project =>
            <CardText key={project.projectId}>
              <b><Link to={`/projects/${project.projectId}`}>{project.projectTitle}</Link></b>
              {project.titleForProject && ` (${project.titleForProject})`}
            </CardText>
          )}
        </CardBody>
        }
        {contact.links &&
        <CardBody>
          <CardText>
            {contact.links.map(link =>
              <Button className={`btn-${link.platformName.toLowerCase()} text-white`} key={link.profileLink}>
                <span><CardLink href={link.profileLink} target='_links'>{link.profileName}</CardLink></span>
              </Button>)}
          </CardText>
        </CardBody>
        }
        <CardFooter>
          <small className='text-muted'>{displayDate}</small>
        </CardFooter>
      </Card>
    </div>
  )
}

ContactModal.propTypes = {
  document: PropTypes.object.isRequired,
}

registerComponent('ContactModal', ContactModal, withCurrentUser)
