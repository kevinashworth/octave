import { registerFragment } from 'meteor/vulcan:core'

registerFragment(/* GraphQL */`
  fragment UsersMinimumInfo on User {
    _id
    slug
    username
    displayName
    emailHash
    avatarUrl
    pageUrl
  }
`)

registerFragment(/* GraphQL */`
  fragment UsersProfile on User {
    ...UsersMinimumInfo
    createdAt
    isAdmin
    bio
    htmlBio
    twitterUsername
    website
    groups
    # vulcan:posts
    postCount
    # vulcan:comments
    commentCount
  }
`)
