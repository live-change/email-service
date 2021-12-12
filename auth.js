const definition = require('./definition.js')

const User = definition.foreignModel('user', 'User')

const Email = definition.model({
  name: 'Email',
  userItem: {
    userReadAccess: () => true
  },
  indexes: {
    byEmail: {
      property: 'email'
    }
  }
})

definition.trigger({
  name: "checkNewEmail",
  properties: {
    email: {
      type: String
    }
  },
  async execute({ email }, context, emit) {
    const emailData = await Email.get(email)
    if(emailData) throw 'taken'
    return true
  }
})

definition.trigger({
  name: "createEmail",
  properties: {
    email: {
      type: String
    }
  },
  async execute(props, context, emit) {
  }
})

module.exports = { Email }
