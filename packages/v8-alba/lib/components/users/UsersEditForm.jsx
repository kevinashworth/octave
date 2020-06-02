import { Components, registerComponent, withCurrentUser, withMessages, withSingle2 } from 'meteor/vulcan:core'
import { FormattedMessage, intlShape } from 'meteor/vulcan:i18n'
import Users from 'meteor/vulcan:users'
import { STATES } from 'meteor/vulcan:accounts'
import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
// import gql from 'graphql-tag'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

// const theFragment = gql`
//   fragment MyUsersEditFragment on User {
//     _id
//     displayName
//     email
//     username
//     twitterUsername
//     bio
//     website
//     notifications_comments
//     notifications_posts
//     notifications_replies
//     notifications_users
//     isAdmin
//     groups
//     slug
//   }
// `

const UsersEditForm = (props, context) => {
  const { document: user, currentUser, flash, history, loading, toggle } = props
  if (loading) {
    return <Components.Loading />
  }
  if (!Users.canUpdate({ collection: Users, document: user, user: currentUser })) {
    return <FormattedMessage id='app.noPermission' />
  }
  return (
    <div className='animated fadeIn page users-edit-form'>
      <Components.HeadTags title={`V8: ${context.intl.formatMessage({ id: 'users.edit_account' })}`} />
      <Card className='card-accent-success'>
        <Card.Body>
          <Card.Title>{`${context.intl.formatMessage({ id: 'cards.edit' })} “${user.displayName}”`}</Card.Title>
          <hr />
          <Components.SmartForm
            documentId={user._id}
            collection={Users}
            fields={[
              'displayName',
              'email',
              'username',
              'twitterUsername',
              'bio',
              'website',
              'notifications_comments',
              'notifications_posts',
              'notifications_replies',
              'notifications_users',
              'isAdmin',
              'groups',
              'slug'
            ]}
            successCallback={user => {
              if (toggle) {
                toggle()
              } else if (user.slug) {
                history.push(`/users/${user.slug}`)
              } else {
                history.push('/admin')
              }
              flash({
                id: 'users.edit_success',
                properties: { name: Users.getDisplayName(user) },
                type: 'success'
              })
            }}
            cancelCallback={document => {
              if (toggle) {
                toggle()
              } else {
                history.push(`/users/${user.slug}`)
              }
            }}
            showRemove
          />
          <hr />
          <Row>
            <Col>
              <Components.ModalTrigger
                title={<FormattedMessage id='accounts.change_password' />}
                component={
                  <Button variant='warning'>
                    <FormattedMessage id='accounts.change_password' />
                  </Button>
                }
              >
                <Components.AccountsLoginForm formState={STATES.PASSWORD_CHANGE} />
              </Components.ModalTrigger>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  )
}

UsersEditForm.propTypes = {
  terms: PropTypes.object, // a user is defined by its unique _id or its unique slug
  flash: PropTypes.func
}

UsersEditForm.contextTypes = {
  intl: intlShape
}

UsersEditForm.displayName = 'UsersEditForm'

const options = {
  collection: Users,
  fragmentName: 'UsersProfile'
}

registerComponent({
  name: 'UsersEditForm',
  component: UsersEditForm,
  hocs: [withMessages, withCurrentUser, withRouter, [withSingle2, options]]
})
