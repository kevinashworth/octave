import { Components, registerComponent, withMessages } from 'meteor/vulcan:core'
import { FormattedMessage } from 'meteor/vulcan:i18n'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Card, CardBody, Col, Row } from 'reactstrap'

class EmailDetail extends PureComponent {
  sendVerificationEmail = () => {
    Meteor.call(
      'sendVerificationEmail',
      {
        userId: this.props.user._id,
        email: this.props.user.email
      },
      (error, results) => {
      if (error) {
        console.error('sendVerificationEmail error:', error)
        this.props.flash(error.reason, 'error')
        return
      }
      // console.info('sendVerificationEmail results:', rmapEmailsCurrentUseresults)
      this.props.flash({
        id: 'users.verify_email_sent',
        properties: { address: this.props.user.email },
        type: 'primary'
      })
    })
  }


  render () {
    const { user } = this.props
    if (!user) {
      return <FormattedMessage id='app.missing_document' />
    }
    return (
      <Card>
        <CardBody>
          <Row>
            <Col xs>
              <strong>{user.email}&nbsp;</strong>
              {user.email && <span className='text-success'>&nbsp;(<FormattedMessage id='users.primary_email' />)&nbsp;</span> }
            </Col>
          </Row>
          <Row>
            <Col>
              <ul className='custom-list'>
                <li>{user.emails[0].verified
                  ? <FormattedMessage id='users.verified' />
                  : <>
                      <span className='text-warning'>
                        <strong><FormattedMessage id='users.unverified' /></strong>&nbsp;
                      </span>
                      &nbsp;
                      <a href='#' onClick={this.sendVerificationEmail}>
                        <FormattedMessage id='users.verify_email' />
                      </a>
                    </>}
                </li>
              </ul>
            </Col>
          </Row>
        </CardBody>
      </Card>
    )
  }
}

EmailDetail.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    emails: PropTypes.array
  })
}

registerComponent({
  name: 'EmailDetail',
  component: EmailDetail,
  hocs: [withMessages]
})
