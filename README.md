# binaried-blog

A modern blog application with a Node.js + Express backend and MongoDB database.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB

### Backend Setup
1. Navigate to `/server`:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/binaried-blog
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   The server will start on port `5000` (or the configured `PORT`).
5. Verify health:
   ```bash
   curl http://localhost:5000/api/health
   ```
