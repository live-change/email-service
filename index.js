const app = require("@live-change/framework").app()

const definition = require('./definition.js')

require('./send.js')
require('./auth.js')

definition.processor(function(service, app) {
  service.validators.email = require('./emailValidator.js')
})

definition.action({
  name: "sendContactFormMail",
  properties: {
    from: { type: String, validation: ['nonEmpty'] },
    name: { type: String, validation: ['nonEmpty']},
    subject: { type: String, validation: ['nonEmpty'] },
    text: { type: String, validation: ['nonEmpty'] },
    html: { type: String },
  },
  async execute({ from, name, subject, text, html }, { client, service }, emit) {
    if(!html) {
      const encodedStr = text.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
        return '&#'+i.charCodeAt(0)+';'
      })
      const multiline = encodedStr.replace(/\n/gi, /*'↵*/'<br>')
      const withLinks = multiline.replace(
          /(?![^<]*>|[^<>]*<\/)((https?:)\/\/[a-z0-9&#%=.\/?_,-]+)/gi, '<a href="$1" target="_blank">$1</a>')
      html = withLinks
    }

    await service.trigger({
      type:"sendEmailMessage",
      email: {
        from: `${name} <${process.env.CONTACT_FORM_FROM_EMAIL}>`,
        to: `${ process.env.CONTACT_FORM_TARGET_NAME} <${process.env.CONTACT_FORM_TARGET_EMAIL}>`,
        subject: subject,
        text,
        html,
        replyTo: `${name} <${from}>`
      }
    })
  }
})


module.exports = definition
