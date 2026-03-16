# Drivod — Road Trip Planner

## File structure

```text
app/
  layout.tsx
  page.tsx
  globals.css
components/
  planner/
    planner-app.tsx
    planner-sidebar.tsx
    itinerary-board.tsx
    map-panel.tsx
    map-canvas.tsx
  ui/
    button.tsx
    input.tsx
    textarea.tsx
    card.tsx
lib/
  data/
    storage.ts
    trip-factory.ts
  hooks/
    use-trip-planner.ts
  types/
    trip.ts
  utils.ts
next.config.ts
package.json
tailwind.config.ts
tsconfig.json
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run dev server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000`.
4. Deploy to Vercel with default Next.js settings.

## Notes

- Frontend-only app with localStorage persistence.
- Includes seeded Rockies sample trip.
- Full-trip and day route modes supported.
- Route includes **only** itinerary items checked for map inclusion.

## Optional enhancements

- Add column resizing for panels.
- Add light theme toggle.
- Add true road-aware routing provider with retry/cache layer.
- Add offline local geocoding cache.
