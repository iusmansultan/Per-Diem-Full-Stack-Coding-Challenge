# Square Menu App

A mobile-friendly web application that connects to the Square Catalog API and displays a restaurant's menu items   filtered by location and menu category.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![Square API](https://img.shields.io/badge/Square-API-00d632)

## Features

- **Location Selection**: Choose from available restaurant locations
- **Category Navigation**: Filter menu items by category with horizontal scrollable tabs
- **Menu Display**: View items with images, descriptions, and pricing
- **Search**: Client-side search filtering for menu items
- **Dark Mode**: Toggle between light, dark, and system themes
- **Responsive Design**: Mobile-first design that works on all devices
- **Caching**: In-memory caching to reduce API calls
- **Error Handling**: Comprehensive error states with retry functionality

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API**: Square Catalog & Locations APIs
- **Testing**: Jest, React Testing Library, Playwright

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Square Developer Account

### Square API Setup

1. Create a free account at [Square Developer](https://developer.squareup.com)
2. Create an application in the Developer Dashboard
3. Use the **Sandbox** environment for testing
4. Copy your Sandbox Access Token

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd square-menu-app
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
SQUARE_ACCESS_TOKEN=your_sandbox_access_token_here
SQUARE_ENVIRONMENT=sandbox
PORT=3000
CACHE_TTL=300
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### GET /api/locations
Fetches all active locations from Square.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "LOCATION_ID",
      "name": "Main Street Restaurant",
      "address": {
        "addressLine1": "123 Main St",
        "city": "San Francisco",
        "state": "CA"
      },
      "timezone": "America/Los_Angeles",
      "status": "ACTIVE"
    }
  ]
}
```

### GET /api/catalog?location_id=LOCATION_ID
Fetches catalog items for a specific location.

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "categories": {
      "Burgers": [...],
      "Drinks": [...]
    }
  }
}
```

### GET /api/catalog/categories?location_id=LOCATION_ID
Fetches categories with item counts for a location.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "CATEGORY_ID",
      "name": "Burgers",
      "itemCount": 5
    }
  ]
}
```

## Testing

### Unit Tests
```bash
npm test
```

### Unit Tests with Coverage
```bash
npm run test:coverage
```

### E2E Tests
```bash
npm run test:e2e
```

### E2E Tests with UI
```bash
npm run test:e2e:ui
```

## Docker

### Build and Run with Docker Compose
```bash
# Create .env file with your Square credentials
cp .env.example .env

# Start the application
docker-compose up --build
```

### Build Docker Image Manually
```bash
docker build -t square-menu-app .
docker run -p 3000:3000 --env-file .env square-menu-app
```

## Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── locations/     # Locations endpoint
│   │   │   └── catalog/       # Catalog endpoints
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Main page
│   ├── components/            # React components
│   │   ├── CategoryTabs.tsx
│   │   ├── ErrorState.tsx
│   │   ├── LocationSelector.tsx
│   │   ├── MenuItem.tsx
│   │   ├── SearchBar.tsx
│   │   ├── ThemeProvider.tsx
│   │   └── ThemeToggle.tsx
│   ├── hooks/                 # Custom React hooks
│   │   └── useApi.ts
│   ├── lib/                   # Utility functions
│   │   ├── cache.ts          # In-memory cache
│   │   ├── errors.ts         # Error handling
│   │   ├── logger.ts         # Request logging
│   │   ├── square.ts         # Square API client
│   │   └── utils.ts          # Helper functions
│   ├── types/                 # TypeScript types
│   │   └── index.ts
│   └── __tests__/            # Unit tests
├── e2e/                       # E2E tests
├── public/                    # Static assets
├── .env.example              # Environment template
├── docker-compose.yml        # Docker Compose config
├── Dockerfile                # Docker build config
├── jest.config.js            # Jest configuration
├── playwright.config.ts      # Playwright configuration
├── tailwind.config.ts        # Tailwind configuration
└── tsconfig.json             # TypeScript configuration
```

## Architecture Decisions

### Next.js App Router
Chose Next.js 14 with App Router for:
- Unified frontend and backend in a single project
- API routes for secure Square API proxy
- Server-side rendering capabilities
- Easy deployment to Vercel

### In-Memory Caching
Implemented in-memory caching with TTL for:
- Reducing Square API calls
- Faster response times
- Simple implementation without external dependencies

**Trade-off**: Cache is not shared across serverless function instances. For production at scale, consider Redis.

### Mobile-First Design
- Designed for 375px viewport first
- Progressive enhancement for larger screens
- Touch-friendly UI elements
- Horizontal scrolling category tabs

### Error Handling Strategy
- Square API errors are mapped to clean API responses
- Frontend shows user-friendly error messages
- Retry functionality for failed requests
- Loading skeletons for better UX

## Assumptions & Limitations

1. **Single Currency**: Prices are formatted assuming USD. Multi-currency support would require additional logic.

2. **Image Handling**: Uses Next.js Image component with Square's S3 domains whitelisted. Placeholder shown for missing images.

3. **Pagination**: Backend handles Square API pagination transparently. For very large catalogs, consider implementing frontend pagination.

4. **Cache Invalidation**: Uses TTL-based expiration. For real-time updates, implement Square Webhooks.

5. **Authentication**: No user authentication implemented. All users see the same menu.

## Bonus Features Implemented

- ✅ Dark mode toggle
- ✅ Docker support (Dockerfile + docker-compose.yml)
- ✅ Search/filter bar for menu items
- ✅ Smooth animations and transitions
- ✅ Accessibility (ARIA labels, keyboard navigation)
- ✅ Loading skeletons
- ✅ Error states with retry

## License

MIT
# Per-Diem-Full-Stack-Coding-Challenge
