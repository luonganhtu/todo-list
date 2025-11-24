# Todo List

A full-stack web application built with FastAPI REST Framework backend and React.js frontend for Todo List.

## Technology Stack

### Backend
- **Python**: 3.13.5
- **Database**: PostgreSQL
- **Environment Management**: python-dotenv

### Frontend
- **Node.js**: 23.5.0
- **React**: 19.2.0
- **TypeScript**
- **Tailwind CSS**


## Installation & Setup

### Backend Setup (FastAPI)

1. **Navigate to the backend directory:**
   ```bash
   cd todo-list-api
   ```

2. **Create and activate virtual environment:**
   ```bash
   # Windows
   virtualenv venv -p python3.13.5
   venv\Scripts\activate
   python -m pip install --upgrade pip

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   Copy the example environment file and configure your settings:
   ```bash
	create .env
	+ Add field 
	PROJECT_NAME=
	DATABASE_URL=
	SECRET_KEY=
	ALGORITHM=
	ACCESS_TOKEN_EXPIRE_MINUTES=
   ```
   Then edit `.env` with your actual database credentials and other settings.

5. **Run database migrations:**
   ```bash
	alembic upgrade head
   ```

6. **Start the FastAPI development server:**
   ```bash
   uvicorn src.main:app --reload
   ```
   The API will be available at `http://localhost:8000`

### Frontend Setup (React.js)

1. **Navigate to the frontend directory:**
   ```bash
   cd todo-list-ui
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
	```
	create file .env.development
	+ Add field
	VITE_APP_API_WEB_URL
	```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

