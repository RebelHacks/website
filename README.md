# RebelHacks Website

A monorepo containing a **Next.js** frontend and a **Symfony** backend that communicate via REST API.

## 📁 Project Structure

```
website/
├── frontend/          # Next.js 16 React application
│   ├── app/           # App router pages
│   ├── components/    # React components
│   ├── hooks/         # Custom React hooks
│   └── lib/           # Utilities and API client
│
├── backend/           # Symfony 7.2 PHP application
│   ├── src/
│   │   ├── Controller/    # API controllers
│   │   └── EventListener/ # CORS handling
│   └── public/        # Web entry point
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **PHP** 8.2+
- **Composer**
- **Symfony CLI** (optional, but recommended)

### 1. Start the Backend (Symfony)

```bash
cd backend

# Install dependencies
composer install

# Start the Symfony server (default: http://localhost:8000)
symfony server:start
# OR use PHP's built-in server:
php -S localhost:8000 -t public
```

The API will be available at `https://127.0.0.1:8000/api/`

### 2. Start the Frontend (Next.js)

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env .env
# Or manually create .env with:
# NEXT_PUBLIC_API_URL=https://127.0.0.1:8000/api

# Start the dev server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check / API status |
| GET | `/api/data` | Fetch sample items |
| GET | `/api/items/{id}` | Fetch single item by ID |
| POST | `/api/submit` | Submit form data |

### Example API Call

```typescript
import api from '@/lib/api';

// GET request
const data = await api.get('/data');

// POST request
const response = await api.post('/submit', { name: 'John', email: 'john@example.com' });
```

## 🎯 API Demo Page

Visit `http://localhost:3000/api-demo` to see a live demo of the frontend-backend integration.

## 📝 Environment Variables

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=https://127.0.0.1:8000/api
```

### Backend (`backend/.env.local`)

```env
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

## 🔧 Development Tips

### Running Both Servers

Open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend && symfony server:start
```

**Terminal 2 (Frontend):**
```bash
cd frontend && npm run dev
```

### CORS Configuration

The backend includes a `CorsListener` that automatically handles CORS headers. Configure allowed origins in the backend's `.env.local` file.

### Type Safety

The frontend includes TypeScript types in `frontend/lib/types.ts` that mirror the API responses. Keep these in sync with your Symfony entities/responses.

## 📦 Adding New API Endpoints

### 1. Create a Symfony Controller

```php
// backend/src/Controller/MyController.php
#[Route('/api/my-endpoint', name: 'my_endpoint', methods: ['GET'])]
public function myEndpoint(): JsonResponse
{
    return $this->json(['data' => 'Hello!']);
}
```

### 2. Add TypeScript Types

```typescript
// frontend/lib/types.ts
export interface MyEndpointResponse {
  data: string;
}
```

### 3. Use in React Component

```typescript
const { data } = useApi<MyEndpointResponse>('/my-endpoint');
```

## 🚢 Production Deployment

### Frontend
- Build: `npm run build`
- Deploy to Vercel, Netlify, or any static host

### Backend
- Set `APP_ENV=prod` in environment
- Run `composer install --no-dev --optimize-autoloader`
- Configure your web server (nginx/Apache) to point to `backend/public/`

## License

See [LICENSE](LICENSE) for details.
