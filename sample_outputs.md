# Peblo Notes - Sample Outputs

## 1. Database Schema
Here is the core Prisma schema powering the application:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String
  notes     Note[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Note {
  id             String   @id @default(cuid())
  title          String
  content        String
  tags           String?  // Stored as JSON array
  isPublic       Boolean  @default(false)
  shareId        String?  @unique
  
  // AI Generated Fields
  summary        String?
  actionItems    String?  // Stored as JSON array
  suggestedTitle String?

  userId         String
  user           User     @relation(fields: [userId], references: [id])
  
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

## 2. Example API Responses

### Generate AI Insights (`POST /api/notes/:id/ai`)
**Request Content:**
```markdown
Discussed the new dark mode color palette. We agreed to stick with deep blacks (#050505) and use violet as the primary accent color. Sarah will prepare the Figma mockups by Friday. Mike needs to review the accessibility contrast ratios.
```

**AI Generated Response (`note` object updated):**
```json
{
  "note": {
    "id": "cm3q123",
    "title": "Design Sync",
    "summary": "Design sync meeting notes deciding on a dark mode palette with a violet accent.",
    "actionItems": "[\"Sarah to prepare Figma mockups by Friday\", \"Mike to review accessibility contrast ratios\"]",
    "suggestedTitle": "Dark Mode Design Sync"
  }
}
```

### Productivity Insights (`GET /api/insights`)
**Response:**
```json
{
  "totalNotes": 12,
  "recentlyEdited": 5,
  "aiNotesCount": 8,
  "mostUsedTags": [
    { "name": "product", "count": 6 },
    { "name": "meeting", "count": 4 },
    { "name": "engineering", "count": 2 }
  ]
}
```

## 3. Screenshots & Video Walkthrough
*(Candidate note: Please run `npm run dev` and record your 5-10 minute Loom/screen recording navigating the features, then link it here).*
