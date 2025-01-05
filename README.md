# TennisTorch 🎾

TennisTorch is an AI-powered tennis analytics platform that provides insights and answers questions about tennis matches and statistics.

## Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn
- OpenAI API key
- Pinecone API key

## Project Structure

```
tennistorch/
├── backend/           # FastAPI backend
│   ├── app/          # Main application code
│   ├── scripts/      # Data ingestion scripts
│   └── requirements.txt
└── frontend/         # Next.js frontend
    ├── src/
    └── package.json
```

## Local Development Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Copy `.env.example` to `.env` in the backend directory and fill in your values:
```bash
cp .env.example .env
```

Required environment variables:
```
OPENAI_API_KEY=your_openai_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX_NAME=your_pinecone_index_name
```

### Data Ingestion

The system uses ATP tennis match data for analysis. To ingest the data:

1. Navigate to the backend directory:
```bash
cd backend
```

2. Ensure your virtual environment is activated and run:
```bash
python scripts/ingest_atp_data.py
```

This script will:
- Download the ATP tennis match dataset from Jeff Sackmann's repository
- Process and clean the match data
- Create vector embeddings for semantic search
- Store the embeddings in your Pinecone vector database

The ingestion process might take 15-30 minutes depending on your system. Progress will be displayed in the console.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Copy `.env.example` to `.env.local` and update the values:
```bash
cp .env.example .env.local
```

For local development, use:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Running Locally

### Start the Backend

1. From the backend directory with your virtual environment activated:
```bash
uvicorn app.api.main:app --reload
```
The backend will be available at `http://localhost:8000`

2. Verify the backend is running by visiting:
- `http://localhost:8000/docs` - API documentation
- `http://localhost:8000/health` - Health check endpoint

### Start the Frontend

1. From the frontend directory:
```bash
npm run dev
# or
yarn dev
```
The frontend will be available at `http://localhost:3000`

## Deployment

### Backend Deployment (Vercel)

1. Create a new project on Vercel
2. Connect your GitHub repository
3. Set the following configuration:
   - Framework Preset: Other
   - Root Directory: backend
   - Build Command: pip install -r requirements.txt
   - Output Directory: .
   - Install Command: pip install -r requirements.txt
   - Development Command: uvicorn app.api.main:app --host 0.0.0.0 --port $PORT

4. Add the following environment variables in Vercel:
   - OPENAI_API_KEY
   - PINECONE_API_KEY
   - PINECONE_ENVIRONMENT
   - PINECONE_INDEX_NAME

### Frontend Deployment (Vercel)

1. Create a new project on Vercel
2. Connect your GitHub repository
3. Set the following configuration:
   - Framework Preset: Next.js
   - Root Directory: frontend
   - Build Command: next build
   - Output Directory: .next
   - Install Command: npm install
   - Development Command: npm run dev

4. Add the following environment variable in Vercel:
   - NEXT_PUBLIC_API_URL (set to your deployed backend URL)

## Features

- Interactive chat interface for tennis-related queries
- Historical match data analysis
- Player statistics and insights
- Real-time data processing

## Troubleshooting

### Backend Issues

1. **Pinecone Setup**
   - Ensure you've created an index in Pinecone with dimension 1536 (OpenAI's embedding size)
   - The index name should match your PINECONE_INDEX_NAME environment variable
   - Verify your Pinecone environment matches your API key

2. **Data Ingestion Issues**
   - If data ingestion fails, check your internet connection as it needs to download the tennis dataset
   - Ensure you have at least 2GB of free disk space for the dataset
   - The script creates a log file in the backend directory - check it for detailed error messages

3. **OpenAI API Issues**
   - Verify your OpenAI API key has sufficient credits
   - If you get rate limit errors, the script will automatically retry with exponential backoff

### Frontend Issues

1. **API Connection**
   - If the frontend can't connect to the backend, verify:
     - Backend is running and accessible
     - Your environment variables are correctly set
     - CORS is properly configured for your deployment

2. **Build Issues**
   - Clear your Next.js cache: `rm -rf .next`
   - Ensure all dependencies are installed: `npm install` or `yarn install`

## Development Notes

- The backend uses FastAPI's automatic API documentation. Visit `/docs` to explore available endpoints
- The tennis data is sourced from [Jeff Sackmann's tennis_atp repository](https://github.com/JeffSackmann/tennis_atp)
- Vector embeddings are created using OpenAI's text-embedding-ada-002 model
- The frontend is built with Next.js 14 and uses the App Router 