import { google } from 'googleapis'
import { getAuthorizedClient } from './auth'

export async function createCalendarEvent({ summary, start, end, description }: { summary: string, start: string, end: string, description?: string }) {
  const auth = await getAuthorizedClient()
  const calendar = google.calendar({ version: 'v3', auth })

  const event = {
    summary,
    description,
    start: {
      dateTime: start,
      timeZone: 'UTC',
    },
    end: {
      dateTime: end,
      timeZone: 'UTC',
    },
  }

  const response = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
  })

  return response.data
}
