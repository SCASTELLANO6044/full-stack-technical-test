# Real-Time Log Processing Microservice

A powerful microservice for asynchronous log processing, built with **Next.js**, **BullMQ**, **Redis**, and **Supabase**. This service enables efficient log ingestion, parsing, and analysis with a priority-based queue system.

## 🚀 Features

- **Asynchronous Processing**: Offload intensive log parsing to background workers using BullMQ.
- **Priority Queue**: Smaller log files (< 1KB) are automatically prioritized for faster processing.
- **Deep Log Parsing**: Extracts timestamp, log level, message, and structured JSON payloads.
- **Automated Insights**:
  - **Error Tracking**: Automatically counts lines with `ERROR` level.
  - **Keyword Hits**: Configurable tracking for specific keywords (e.g., "timeout", "failed").
  - **IP Extraction**: Automatically identifies and stores IP addresses found in log payloads.
- **Persistent Storage**: All processed statistics and parsed entries are stored in Supabase.
- **RESTful API**: Simple endpoints for log submission and statistics retrieval.

## 🏗️ Architecture

1.  **Client**: Submits log files via the `/api/upload-logs` endpoint.
2.  **Next.js API**: Receives the file, saves it locally, and adds a job to the BullMQ queue with a calculated priority.
3.  **Redis**: Acts as the message broker, storing pending jobs for the worker.
4.  **Worker**: A BullMQ worker processes the log file, parses each line, extracts insights, and prepares data for storage.
5.  **Supabase**: Stores the final processed statistics and parsed log entries for long-term analysis.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Queue System**: [BullMQ](https://docs.bullmq.io/)
- **Store/Broker**: [Redis](https://redis.io/)
- **Database**: [Supabase](https://supabase.com/)
- **Client Libraries**: `ioredis`, `@supabase/supabase-js`
- **Styling**: Tailwind CSS

## 📋 Setup Instructions

### 1. Prerequisites
- **Node.js**: v18 or higher.
- **Redis**: A running Redis instance.
- **Supabase**: A project with a `log_stats` table.

### 2. Database Schema
Create a table named `log_stats` in your Supabase project with the following structure:
- `id`: uuid (primary key)
- `processed_at`: timestamptz (default: now())
- `job_id`: text
- `file_id`: text
- `file_name`: text
- `total_lines`: int4
- `error_count`: int4
- `keyword_hits`: jsonb
- `ip_addresses`: _text (array)
- `entries`: jsonb (optional, for storing parsed lines)

### 3. Environment Variables
Create a `.env` file in the root directory and configure the following:
```env
REDIS_HOST=localhost
REDIS_PORT=6379
SUPABASE_LINK=your_supabase_project_url
SUPABASE_API_KEY=your_supabase_anon_key
TRACKED_KEYWORDS=error,timeout,failed,unauthorized
```

### 4. Installation
```bash
npm install
```

### 5. Running the Application
Run the Next.js development server:
```bash
npm run dev
```

## 📡 API Endpoints

### `POST /api/upload-logs`
Uploads a log file for processing.
- **Body**: `multipart/form-data`
- **Key**: `file` (the .txt log file)
- **Response**: `{"jobId": "..."}`

### `GET /api/stats`
Retrieves a list of all processed log statistics.

### `GET /api/stats/[jobId]`
Retrieves statistics for a specific job.

---

*Built with ❤️ for efficient log management.*
