import { google } from 'googleapis'
import { getAuthorizedClient } from './auth'

export async function createGmailDraft({ to, subject, body }: { to: string, subject: string, body: string }) {
  const auth = await getAuthorizedClient()
  const gmail = google.gmail({ version: 'v1', auth })

  // Construct message
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`
  const messageParts = [
    `To: ${to}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    body,
  ]
  const message = messageParts.join('\n')

  // The body needs to be base64url encoded.
  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  const response = await gmail.users.drafts.create({
    userId: 'me',
    requestBody: {
      message: {
        raw: encodedMessage,
      },
    },
  })

  return response.data
}
