import os
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from database import create_tables
from routers import exercises, workout_types, workout_sessions, session_exercise, sets


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    yield


app = FastAPI(lifespan=lifespan)

cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(exercises.router, prefix="/api")
app.include_router(workout_types.router, prefix="/api")
app.include_router(workout_sessions.router, prefix="/api")
app.include_router(session_exercise.router, prefix="/api")
app.include_router(sets.router, prefix="/api")


@app.get("/api")
def root():
    return {"message": "LiftLog API"}


dist = (Path(__file__).parent.parent / "frontend" / "dist").resolve()
if dist.exists():
    app.mount("/assets", StaticFiles(directory=str(dist / "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def spa(full_path: str):
        if full_path == "api" or full_path.startswith("api/"):
            raise HTTPException(status_code=404)

        file_path = (dist / full_path).resolve()
        if file_path.is_relative_to(dist) and file_path.is_file():
            return FileResponse(file_path)

        return FileResponse(dist / "index.html")
