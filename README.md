# Binaried Blog

Binaried Blog is a modern, responsive, developer-focused full-stack blogging platform. It is built with a Node.js + Express backend, Mongoose + MongoDB database layer, and a structured Angular frontend utilizing reactive form validations, state signals, and component routing.

---

## Getting Started & Setup

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **MongoDB** (Running locally on `mongodb://127.0.0.1:27017` or configured via `.env`)

### Project Structure
```
binaried-blog/
├── client/     # Angular Frontend application
└── server/     # Express + MongoDB Backend server
```

### Backend Setup
1. Navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in a `.env` file inside the `server/` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/binaried-blog
   JWT_SECRET=your_jwt_secret_key_here
   ```
4. Start the server in development mode:
   ```bash
   npm run dev
   ```
   The backend will start at `http://localhost:5000`.

### Frontend Setup
1. Navigate to the `client/` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Compile and serve the Angular client locally:
   ```bash
   npm start
   ```
   Open `http://localhost:4200` in your browser to view the application.

---

## AI Tools Used and Where
This project was developed through pair programming using:
- **Antigravity (IDE Subagent)**: Handled file operations, codebase indexing, automated script creation, and workspace execution tasks.
- **Gemini 3.5 Flash**: Utilized as the primary reasoning model for structural planning, writing clean component patterns, and generating test scripts.

---

## What We Built

### 1. Express Backend Skeleton (`/server`)
- Setup an Express API server with CORS integration and JSON request parsing.
- Implemented Mongoose schemas for `User` and `Post` entities.
- Configured password encryption using `bcryptjs` and pre-save database hooks.
- Designed JSON Web Token (JWT) generator utilities.
- Created routing routers for `/api/auth` (register, login, user profile `/me`) and `/api/posts` (GET posts, GET post by ID, POST post, PUT post, DELETE post).

### 2. Angular Client Application (`/client`)
- Set up a clean Angular workspace with standalone component configurations.
- Designed a premium glassmorphic navbar layout with dynamic navigation links based on user authentication state.
- Implemented `AuthService` using Angular Signals to manage login/register requests and store JWT tokens in `localStorage`.
- Built `authGuard` functional router guards to secure protected routes.
- Created `PostService` containing full CRUD request utilities.
- Implemented beautiful reactive pages for:
  - **Login / Register**: Complete with real-time reactive validation styling and error displays.
  - **Post Feed (Homepage)**: A CSS Grid layout showing article metadata cards, author initials as initials-avatars, and loading/empty/error states.
  - **Post Detail**: Displays full text block parsed paragraphs, author bio tags, and ownership-based edit/delete action items.
  - **Post Form**: A single form handling both publishing and updating posts dynamically.

---

## Key Technical Challenges

### PowerShell Script Execution Restrictions on Windows
During the npm package installations and framework initialization phases on Windows, we encountered security exceptions stating:
`File ...\npm.ps1 cannot be loaded because running scripts is disabled on this system.`
Since Windows execution policies restricted script compilation inside PowerShell, we bypassed this issue by executing all Node/Angular CLI tasks inside cmd wrappers using the `cmd /c` command execution prefix. This allowed us to install packages, initialize Angular, and verify bundle generation without needing local system administration interventions.

### Mongoose Pre-Save Middleware Next Signature Error
When implementing Mongoose middleware to hash user passwords on save:
```javascript
UserSchema.pre('save', async function(next) { ... next(); })
```
We encountered an internal database error: `next is not a function`. 
In modern versions of Mongoose (v5.x+), async functions returning promises automatically complete the pre-save hook and must not define or call the legacy `next` parameter callback. We resolved this signature mismatch by shifting to the standard async promise return pattern, omitting the `next` parameter entirely.

---

## Future Improvements
- **Text Search Querying**: Add filters to search articles by tags or text keywords in title/content.
- **Role-Based Permissions**: Restrict creation of new articles to users signed up as `'author'`, displaying appropriate access banners.
- **Image Upload Integration**: Implement Cloudinary or local disk storage integrations for uploading article cover images.
- **Rich-text Markdown Editor**: Embed a markdown editor inside the Post Form to support code syntax highlighting.
