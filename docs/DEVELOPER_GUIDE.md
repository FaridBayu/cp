# Developer Guide

> Complete development documentation for UniCost contributors

---

## 📁 Project Structure

```
UniCost/
├── docs/                     # Documentation
│   ├── DEVELOPER_GUIDE.md   # This file
│   ├── API_CONTRACT.md      # API specification
│   └── ARCHITECTURE.md      # Architecture decisions
├── package.json              # Root workspace (concurrently scripts)
├── backend/
│   ├── package.json          # Backend dependencies
│   ├── server.js             # Entry point
│   ├── src/
│   │   ├── app.js            # Express app config
│   │   ├── routes/           # API routes
│   │   ├── controllers/      # Request handlers
│   │   ├── models/           # Database models
│   │   ├── services/         # Business logic (JISDOR, Regression, etc)
│   │   ├── middleware/       # Express middleware
│   │   └── validations/      # Joi schemas
│   └── samples/
│       └── .env.sample       # Environment template
└── frontend/
    ├── package.json          # Frontend dependencies
    ├── webpack.config.js     # Webpack configuration
    ├── DESIGN_SYSTEM.md      # Component library docs
    ├── src/
    │   ├── main.js           # Entry point
    │   ├── models/           # State management (MVP)
    │   ├── presenters/       # Business logic (MVP)
    │   ├── views/            # DOM rendering (MVP)
    │   ├── services/api/     # API client
    │   └── styles/           # Design system CSS
    └── public/
        └── index.html        # HTML template
```

---

## 🚀 Quick Start (Development)

### Prerequisites
- Node.js 22+
- MySQL 8+
- Git

### First Time Setup
```powershell
# 1. Clone repository
git clone https://github.com/Syhri/UniCost.git
cd UniCost

# 2. Install all dependencies (root, backend, frontend)
npm run install:all

# 3. Setup backend environment
cp backend/samples/.env.sample backend/.env
# Edit backend/.env with your database credentials:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=yourpassword
# DB_NAME=unicost
# PORT=3100

# 4. Create database
# Open MySQL and run:
# CREATE DATABASE unicost;
```

### Run Development Servers
```powershell
# Run backend + frontend together (RECOMMENDED)
npm run dev

# Or run separately:
npm run dev:backend   # Backend only (port 3100)
npm run dev:frontend  # Frontend only (port 8080)
```

### Access URLs
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3100/api/health

---

## 🎨 Frontend Development

### Architecture Pattern: MVP
```
Model (State) → Presenter (Logic) → View (DOM)
     ↑                                  ↓
     └────────── User Events ───────────┘
```

### Design System
See full documentation: [`frontend/DESIGN_SYSTEM.md`](../frontend/DESIGN_SYSTEM.md)

**Available Components:**
- Button (primary, secondary, danger)
- Form (input, textarea, select)
- Card (content containers)
- Table (data display)
- Layout (grid, flex utilities)

**CSS Variables:**
```css
/* Colors */
--color-primary: #007AFF;
--color-background: #FFFFFF;
--color-text: #000000;

/* Typography */
--font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
--font-size-base: 1rem;

/* Spacing */
--spacing-xs: 0.25rem;
--spacing-sm: 0.5rem;
--spacing-md: 1rem;
```

### Creating a New Page

1. **Create Model** (`src/models/FeatureStore.js`):
```javascript
class FeatureStore {
  constructor() {
    this.data = [];
    this.listeners = [];
  }
  
  subscribe(listener) {
    this.listeners.push(listener);
  }
  
  notify() {
    this.listeners.forEach(fn => fn(this.data));
  }
  
  setData(data) {
    this.data = data;
    this.notify();
  }
}
```

2. **Create View** (`src/views/pages/FeatureView.js`):
```javascript
class FeatureView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }
  
  render(data) {
    this.container.innerHTML = `
      <div class="card">
        <h2>${data.title}</h2>
      </div>
    `;
  }
  
  bindEvent(eventName, handler) {
    // Bind DOM events
  }
}
```

3. **Create Presenter** (`src/presenters/FeaturePresenter.js`):
```javascript
class FeaturePresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    
    this.model.subscribe(data => this.view.render(data));
  }
  
  async loadData() {
    const data = await api.get('/feature');
    this.model.setData(data);
  }
}
```

---

## 🔌 API Integration

### API Client Usage
```javascript
import ApiClient from './services/api/ApiClient.js';

const api = new ApiClient('http://localhost:3100');

// GET request
const products = await api.get('/products');

// POST request
const newProduct = await api.post('/products', {
  name: 'Product Name',
  category: 'Electronics',
  unit: 'pcs',
  base_price: 100000
});

// PATCH request
const updated = await api.patch('/products/1', {
  base_price: 120000
});

// DELETE request
await api.delete('/products/1');
```

### API Documentation
All API endpoints are documented in **[API_CONTRACT.md](./API_CONTRACT.md)**

---

## 🗄️ Backend Development

### Project Structure
```
backend/src/
├── app.js              # Express app configuration
├── config/             # Database & app config
├── controllers/        # Request handlers
├── models/             # Database models
├── services/           # Business logic
├── middleware/         # Express middleware
├── routes/             # API routes
└── validations/        # Joi validation schemas
```

### Creating a New Endpoint

1. **Create Validation Schema** (`src/validations/feature.schema.js`):
```javascript
const Joi = require('joi');

const createFeatureSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
});

module.exports = { createFeatureSchema };
```

2. **Create Model** (`src/models/Feature.model.js`):
```javascript
class Feature {
  static async findAll(db) {
    const [rows] = await db.query('SELECT * FROM features');
    return rows;
  }
  
  static async findById(db, id) {
    const [rows] = await db.query('SELECT * FROM features WHERE id = ?', [id]);
    return rows[0];
  }
  
  static async create(db, data) {
    const [result] = await db.query('INSERT INTO features SET ?', [data]);
    return this.findById(db, result.insertId);
  }
}

module.exports = Feature;
```

3. **Create Controller** (`src/controllers/Feature.controller.js`):
```javascript
const Feature = require('../models/Feature.model');

class FeatureController {
  static async getAll(req, res, next) {
    try {
      const features = await Feature.findAll(req.db);
      res.json({ success: true, data: features });
    } catch (error) {
      next(error);
    }
  }
  
  static async create(req, res, next) {
    try {
      const feature = await Feature.create(req.db, req.body);
      res.status(201).json({ success: true, data: feature });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = FeatureController;
```

4. **Create Routes** (`src/routes/Feature.routes.js`):
```javascript
const express = require('express');
const FeatureController = require('../controllers/Feature.controller');
const { createFeatureSchema } = require('../validations/feature.schema');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/', FeatureController.getAll);
router.post('/', validate(createFeatureSchema), FeatureController.create);

module.exports = router;
```

5. **Register Routes** (`src/routes/index.js`):
```javascript
const featureRoutes = require('./Feature.routes');
router.use('/features', featureRoutes);
```

---

## 🧪 Testing

### Backend Tests
```powershell
cd backend
npm test
```

### Example Test
```javascript
const request = require('supertest');
const app = require('../src/app');

describe('GET /api/products', () => {
  it('should return all products', async () => {
    const response = await request(app)
      .get('/api/products')
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data.products)).toBe(true);
  });
});
```

---

## 📝 Contributing

### Branch Naming
- `feature/<feature-name>` - New features
- `bugfix/<bug-name>` - Bug fixes
- `hotfix/<issue>` - Urgent fixes
- `docs/<topic>` - Documentation updates

### Commit Message Convention
```
<type>(<scope>): <subject>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes (formatting)
- refactor: Code refactoring
- test: Adding or updating tests
- chore: Maintenance tasks

Examples:
feat(products): add product filtering by category
fix(api): correct JISDOR date parsing
docs(readme): update installation steps
```

### Pull Request Process
1. Create feature branch from `main`
2. Make changes and commit
3. Push to your fork
4. Create Pull Request
5. Wait for code review
6. Merge after approval

---

## 🚀 Deployment

### Backend (Railway)
1. Push code to GitHub
2. Connect repository to Railway
3. Set environment variables:
   - `DB_HOST`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
   - `PORT`
   - `NODE_ENV=production`
4. Deploy automatically on push to `main`

### Frontend (Netlify)
1. Build production bundle:
   ```powershell
   cd frontend
   npm run build
   ```
2. Deploy `frontend/dist/` to Netlify
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Base directory: `frontend`

### Environment Variables

**Backend (.env):**
```env
NODE_ENV=development
PORT=3100

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=unicost
DB_PORT=3306

JISDOR_API_URL=https://api-bi.bank-indonesia.go.id
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:3100/api
```

---

## 🐛 Debugging

### Backend Debugging
```powershell
# Run with nodemon (auto-restart)
npm run dev

# View logs
# Logs will appear in terminal
```

### Frontend Debugging
```powershell
# Run dev server with HMR
npm run dev

# Open browser console (F12)
# All console.log will appear there
```

### Common Issues

**Issue:** `ECONNREFUSED` on backend
- **Solution:** Check if MySQL is running and credentials are correct in `.env`

**Issue:** Frontend can't reach backend
- **Solution:** Check CORS settings in `backend/src/app.js`

**Issue:** Webpack build fails
- **Solution:** Clear cache: `rm -rf node_modules .cache dist && npm install`

---

## 📚 Additional Resources

- [API Contract Documentation](./API_CONTRACT.md)
- [Frontend Design System](../frontend/DESIGN_SYSTEM.md)
- [Architecture Decision Records](./ARCHITECTURE.md)
- [Express.js Documentation](https://expressjs.com/)
- [Webpack Documentation](https://webpack.js.org/)

---

## 👥 Team Responsibilities

| Name | Role | Contact |
|------|------|---------|
| Syahril | Frontend Lead | - |
| Vivaldi | Backend - Products | - |
| Teguh | Backend - BoM & Audit | - |
| Farid | Backend - Estimation | - |
| Agung | Backend - Export & Jobs | - |

---

**Last Updated:** November 14, 2025
