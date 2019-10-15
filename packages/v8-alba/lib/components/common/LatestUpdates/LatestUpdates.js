import { Components, registerComponent, withAccess, withMulti } from 'meteor/vulcan:core'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Card, CardBody, CardFooter, CardHeader, Col, Row } from 'reactstrap'
import Contacts from '../../../modules/contacts/collection.js'
import Offices from '../../../modules/offices/collection.js'
import Projects from '../../../modules/projects/collection.js'
import PastProjects from '../../../modules/past-projects/collection.js'
import moment from 'moment'
import { DATE_FORMAT_SHORT_FRIENDLY } from '../../../modules/constants.js'

class LatestContactUpdates extends Component {
  render () {
    if (this.props.loading) {
      return (<div><Components.Loading /></div>)
    }

    const contacts = this.props.results || []

    return (
      <Row>
        {contacts.map(contact => {
          const isItNew = moment(contact.updatedAt).isBefore(moment(contact.createdAt).add(1, 'day'))
          let displayHtml = isItNew
            ? '<b>New!</b> Contact added '
            : 'Contact updated '
          displayHtml += moment(contact.updatedAt).format(DATE_FORMAT_SHORT_FRIENDLY)
          return (
            <Col xs='12' sm='6' md='4' key={contact._id}>
              <Card className='card-accent-warning'>
                <CardHeader>
                  <b><Link to={`/contacts/${contact._id}/${contact.slug}`}>{contact.displayName}</Link></b>
                  <small className='float-right'>{contact.theAddress.location}</small>
                </CardHeader>
                <CardBody>
                  {contact.title}<br />
                  {contact.projects ? contact.projects.length + ' Projects' : null}
                </CardBody>
                <CardFooter>
                  <small className='text-muted' dangerouslySetInnerHTML={{ __html: displayHtml }} />
                </CardFooter>
              </Card>
            </Col>
          )
        })}
      </Row>
    )
  }
}

LatestContactUpdates.propTypes = {
  results: PropTypes.array
}

const contactsOptions = {
  collection: Contacts,
  fragmentName: 'ContactsSingleFragment',
  limit: 6
}

registerComponent({
  name: 'LatestContactUpdates',
  component: LatestContactUpdates,
  hocs: [[withMulti, contactsOptions]]
})

class LatestOfficeUpdates extends Component {
  render () {
    if (this.props.loading) {
      return (<div><Components.Loading /></div>)
    }

    const offices = this.props.results || []

    return (
      <Row>
        {offices.map(office => {
          const isItNew = moment(office.updatedAt).isBefore(moment(office.createdAt).add(1, 'day'))
          let displayHtml = isItNew
            ? '<b>New!</b> Office added '
            : 'Office updated '
          displayHtml += moment(office.updatedAt).format(DATE_FORMAT_SHORT_FRIENDLY)
          return (
            <Col xs='12' sm='6' md='4' key={office._id}>
              <Card className='card-accent-primary'>
                <CardHeader>
                  <b><Link to={`/offices/${office._id}/${office.slug}`}>{office.displayName}</Link></b>
                </CardHeader>
                <CardBody>
                  {office.theCity} {office.theState}<br />
                  {office.projects ? office.projects.length + ' Projects' : null}
                </CardBody>
                <CardFooter>
                  <small className='text-muted' dangerouslySetInnerHTML={{ __html: displayHtml }} />
                </CardFooter>
              </Card>
            </Col>
          )
        })}
      </Row>
    )
  }
}

LatestOfficeUpdates.propTypes = {
  results: PropTypes.array
}

const officesOptions = {
  collection: Offices,
  fragmentName: 'OfficesSingleFragment',
  terms: { view: 'officesByUpdated' },
  limit: 6
}

registerComponent({
  name: 'LatestOfficeUpdates',
  component: LatestOfficeUpdates,
  hocs: [[withMulti, officesOptions]]
})

class LatestProjectUpdates extends Component {
  render () {
    if (this.props.loading) {
      return (<div><Components.Loading /></div>)
    }

    const projects = this.props.results || []

    return (
      <Row>
        {projects.map(project => {
          const isItNew = moment(project.updatedAt).isBefore(moment(project.createdAt).add(1, 'day'))
          let displayHtml = isItNew
            ? '<b>New!</b> Project added '
            : 'Project updated '
          displayHtml += moment(project.updatedAt).format(DATE_FORMAT_SHORT_FRIENDLY)
          return (
            <Col xs='12' sm='6' md='4' key={project._id}>
              <Card className='card-accent-danger'>
                <CardHeader>
                  <b><Link to={`/projects/${project._id}/${project.slug}`}>{project.projectTitle}</Link></b>
                </CardHeader>
                <CardBody>
                  {project.projectType.indexOf('TV') === 0 || project.projectType.indexOf('Pilot') === 0
                    ? `${project.projectType} • ${project.network}` : `${project.projectType}`}<br />
                  {project.status}<br />
                  {project.castingCompany}<br />
                </CardBody>
                <CardFooter>
                  <small className='text-muted' dangerouslySetInnerHTML={{ __html: displayHtml }} />
                </CardFooter>
              </Card>
            </Col>
          )
        })}
      </Row>
    )
  }
}

LatestProjectUpdates.propTypes = {
  results: PropTypes.array
}

const projectsOptions = {
  collection: Projects,
  fragmentName: 'ProjectsSingleFragment',
  limit: 6
}

registerComponent({
  name: 'LatestProjectUpdates',
  component: LatestProjectUpdates,
  hocs: [[withMulti, projectsOptions]]
})

class LatestPastProjectUpdates extends Component {
  render () {
    if (this.props.loading) {
      return (<div><Components.Loading /></div>)
    }

    const pastProjects = this.props.results || []

    return (
      <Row>
        {pastProjects.map(project =>
          <Col xs='12' sm='6' md='4' key={project._id}>
            <Card className='card-accent-secondary'>
              <CardHeader>
                <b><Link to={`/past-projects/${project._id}/${project.slug}`}>{project.projectTitle}</Link></b>
              </CardHeader>
              <CardBody>
                {project.projectType.indexOf('TV') === 0 || project.projectType.indexOf('Pilot') === 0
                  ? `${project.projectType} • ${project.network}` : `${project.projectType}`}<br />
                {project.status}<br />
                {project.castingCompany}<br />
              </CardBody>
              <CardFooter>
                <small className='text-muted'>Past Project as of {moment(project.updatedAt).format(DATE_FORMAT_SHORT_FRIENDLY)}</small>
              </CardFooter>
            </Card>
          </Col>
        )}
      </Row>
    )
  }
}

LatestPastProjectUpdates.propTypes = {
  results: PropTypes.array
}

const pastProjectsOptions = {
  collection: PastProjects,
  fragmentName: 'PastProjectsSingleFragment',
  limit: 6
}

registerComponent({
  name: 'LatestPastProjectUpdates',
  component: LatestPastProjectUpdates,
  hocs: [[withMulti, pastProjectsOptions]]
})

class LatestUpdates extends Component {
  render () {
    return (
      <div className='animated fadeIn'>
        <Components.HeadTags title='V8 Alba: Latest Updates' />
        <Components.LatestContactUpdates />
        <Components.LatestOfficeUpdates />
        <Components.LatestProjectUpdates />
        <Components.LatestPastProjectUpdates />
      </div>
    )
  }
}

const accessOptions = {
  groups: ['members', 'admins'],
  redirect: '/login'
}

registerComponent({
  name: 'LatestUpdates',
  component: LatestUpdates,
  hocs: [[withAccess, accessOptions]]
})
