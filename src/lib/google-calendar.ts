// Google Calendar API integration
import { google } from 'googleapis'

export class GoogleCalendarService {
  private oauth2Client: any
  private calendar: any

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    )
    this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client })
  }

  // Set credentials for authenticated user
  setCredentials(tokens: any) {
    this.oauth2Client.setCredentials(tokens)
  }

  // Get authorization URL
  getAuthUrl() {
    const scopes = ['https://www.googleapis.com/auth/calendar']
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    })
  }

  // Exchange code for tokens
  async getTokens(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code)
    this.oauth2Client.setCredentials(tokens)
    return tokens
  }

  // Get events from Google Calendar
  async getEvents(timeMin?: Date, timeMax?: Date) {
    try {
      const response = await this.calendar.events.list({
        calendarId: 'primary',
        timeMin: timeMin?.toISOString(),
        timeMax: timeMax?.toISOString(),
        maxResults: 100,
        singleEvents: true,
        orderBy: 'startTime',
      })

      return response.data.items || []
    } catch (error) {
      console.error('Error fetching events:', error)
      throw error
    }
  }

  // Create event in Google Calendar
  async createEvent(event: {
    summary: string
    description?: string
    start: { dateTime: string; timeZone?: string }
    end: { dateTime: string; timeZone?: string }
  }) {
    try {
      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      })

      return response.data
    } catch (error) {
      console.error('Error creating event:', error)
      throw error
    }
  }

  // Update event in Google Calendar
  async updateEvent(eventId: string, event: any) {
    try {
      const response = await this.calendar.events.update({
        calendarId: 'primary',
        eventId,
        resource: event,
      })

      return response.data
    } catch (error) {
      console.error('Error updating event:', error)
      throw error
    }
  }

  // Delete event from Google Calendar
  async deleteEvent(eventId: string) {
    try {
      await this.calendar.events.delete({
        calendarId: 'primary',
        eventId,
      })

      return true
    } catch (error) {
      console.error('Error deleting event:', error)
      throw error
    }
  }
}

// Helper function to sync local events with Google Calendar
export async function syncWithGoogleCalendar(
  localEvents: any[],
  googleCalendarService: GoogleCalendarService
) {
  try {
    // Get events from Google Calendar
    const googleEvents = await googleCalendarService.getEvents()
    
    // Merge and sync events
    const syncedEvents = localEvents.map(localEvent => {
      const googleEvent = googleEvents.find(
        (ge: any) => ge.id === localEvent.googleEventId
      )
      
      if (googleEvent) {
        return {
          ...localEvent,
          googleEvent: googleEvent,
          synced: true
        }
      }
      
      return {
        ...localEvent,
        synced: false
      }
    })

    return syncedEvents
  } catch (error) {
    console.error('Error syncing with Google Calendar:', error)
    throw error
  }
}
