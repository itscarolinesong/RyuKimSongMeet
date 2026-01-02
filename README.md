# RyuKimSongMeet

A timezone-aware scheduling tool designed for small friend groups across different time zones.

## Features

- **Automatic Timezone Conversion**: All availability is converted to UTC and displayed in each participant's local timezone
- **Smart Overlap Detection**: Finds optimal meeting times when the most participants are available
- **Easy Calendar Integration**: One-click export to Google Calendar, Outlook, Yahoo, or download .ics files
- **Mobile Friendly**: Responsive design that works on all devices
- **No Login Required**: Simple, straightforward scheduling without account creation

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Date/Time**: Luxon for timezone handling
- **State Management**: Zustand
- **Hosting**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd RyuKimSongMeet
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### 1. Setup Participants

- Add each person who will attend the meeting
- Select their timezone from the dropdown
- The system supports major timezones worldwide, with focus on Korea (KST) and US timezones

### 2. Add Availability

- Select a participant
- Choose the day of week and time range when they're available
- Times are entered in the participant's local timezone
- Add multiple availability blocks as needed

### 3. Find Optimal Times

- Set the date range to search within
- Click "Find Optimal Times"
- The system will show the best meeting times ranked by:
  - Number of available participants (higher is better)
  - Earlier times (when scores are equal)

### 4. Export to Calendar

Once you've selected a time, export it to your preferred calendar:
- Google Calendar
- Outlook
- Yahoo Calendar
- Download .ics file (works with Apple Calendar and others)

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main scheduling interface
├── components/            # React components
│   ├── AvailabilityInput.tsx
│   ├── AvailabilityList.tsx
│   ├── CalendarExport.tsx
│   ├── MeetingSuggestions.tsx
│   └── UserManager.tsx
├── lib/
│   ├── store/            # Zustand state management
│   │   └── meetingStore.ts
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   └── utils/            # Utility functions
│       ├── calendar.ts   # Calendar export (.ics generation)
│       ├── overlap.ts    # Overlap detection algorithm
│       ├── scheduler.ts  # Main scheduling engine
│       └── timezone.ts   # Timezone conversion utilities
└── public/               # Static assets
```

## Core Algorithms

### Timezone Conversion

All availability blocks are converted from local time to UTC for storage and computation. Display times are converted back to the viewer's timezone.

### Overlap Detection

Uses a sweep line algorithm to efficiently find all time periods when multiple users are available:

1. Create time points for all availability start/end times
2. Sort chronologically
3. Track active users at each point
4. Record periods when enough users overlap

### Meeting Suggestions

Generates candidate time slots within overlapping periods and ranks them by:
- Number of available participants
- Adherence to "reasonable hours" preferences
- Earlier times preferred

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Deploy with default settings

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Self-hosted with Docker

## Future Enhancements

- [ ] Shareable meeting links
- [ ] Persistent storage (Supabase/Firebase)
- [ ] Email notifications
- [ ] Recurring meeting patterns
- [ ] Conflict highlighting
- [ ] Multi-language support

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
