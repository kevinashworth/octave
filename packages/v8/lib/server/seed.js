/* Seed the database with some dummy content. */

import { Promise } from 'meteor/promise'
import Users from 'meteor/vulcan:users'
import { newMutation } from 'meteor/vulcan:core'
import Contacts from '../modules/contacts/collection.js'
import Offices from '../modules/offices/collection.js'
import Patches from '../modules/patches/collection.js'
import Projects from '../modules/projects/collection.js'
import PastProjects from '../modules/past-projects/collection.js'
import Statistics from '../modules/statistics/collection.js'
import { contacts } from './seeds/generated/contacts.js'
import { offices } from './seeds/generated/offices.js'
import { pastprojects } from './seeds/generated/pastprojects.js'
import { projects } from './seeds/generated/projects.js'
import { statistics } from './seeds/_statistics.js'

const createUser = async (username, email) => {
  const user = {
    username,
    email,
    isDummy: true
  }
  return newMutation({
    collection: Users,
    document: user,
    validate: false
  })
}

const createDummyUsers = async () => {
  // eslint-disable-next-line no-console
  console.log('// inserting dummy users…')
  return Promise.all([
    createUser('Bruce', 'dummyuser1@telescopeapp.org'),
    createUser('Julia', 'dummyuser3@telescopeapp.org')
  ])
}

const seedPatch = {
  _id: 'v4vAkMJ2EyqMmFKGw',
  patches: [
    {
      date: new Date('2020-01-03T21:08:58.333Z').toUTCString(),
      patch: { op: 'replace', path: '/addresses/0/street2', value: 'Stage 4, 5th Floor' }
    }
  ],
  collectionName: 'Offices'
}

// eslint-disable-next-line no-undef
Vulcan.removeGettingStartedContent = () => {
  Users.remove({ 'profile.isDummy': true })
  // eslint-disable-next-line no-console
  console.log('// Getting started content removed')
}

// eslint-disable-next-line no-undef
Meteor.startup(() => {
  if (Users.find().fetch().length === 0) {
    Promise.await(createDummyUsers())
  }
  const currentUser = Users.findOne() // just get the first user available
  if (Contacts.find().fetch().length === 0) {
    // eslint-disable-next-line no-console
    console.log('// creating dummy contacts')
    Promise.awaitAll(contacts.map(document => newMutation({
      action: 'contacts.new',
      collection: Contacts,
      document,
      currentUser,
      validate: false
    })))
  }
  if (Projects.find().fetch().length === 0) {
    // eslint-disable-next-line no-console
    console.log('// creating dummy projects')
    Promise.awaitAll(projects.map(document => newMutation({
      action: 'projects.new',
      collection: Projects,
      document,
      currentUser,
      validate: false
    })))
  }
  if (PastProjects.find().fetch().length === 0) {
    // eslint-disable-next-line no-console
    console.log('// creating dummy past-projects')
    Promise.awaitAll(pastprojects.map(document => newMutation({
      action: 'past-projects.create',
      collection: PastProjects,
      document,
      currentUser,
      validate: false
    })))
  }
  if (Offices.find().fetch().length === 0) {
    // eslint-disable-next-line no-console
    console.log('// creating dummy offices')
    Promise.awaitAll(offices.map(document => newMutation({
      action: 'offices.new',
      collection: Offices,
      document,
      currentUser,
      validate: false
    })))
  }
  if (Statistics.find().fetch().length === 0) {
    // eslint-disable-next-line no-console
    console.log('// creating dummy statistics')
    Promise.await(Statistics.insert(statistics))
  }
  if (Patches.find().fetch().length === 0) {
    // eslint-disable-next-line no-console
    console.log('// creating dummy patches')
    Promise.await(newMutation({
      action: 'patches.new',
      collection: Patches,
      document: seedPatch,
      currentUser,
      validate: false
    }))
  }
})
