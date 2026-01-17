import os
import json
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

# 1. Directory Setup
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_DIR = os.path.join(BASE_DIR, "../templates")
STATIC_DIR = os.path.join(BASE_DIR, "../static")
PROGRAMS_FILE = os.path.join(BASE_DIR, "programs.json")

# 2. Memory Cache
cache = {"programs": []}

# 3. Lifespan logic: Runs once when Vercel boots the function
@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        if os.path.exists(PROGRAMS_FILE):
            with open(PROGRAMS_FILE, "r") as f:
                cache["programs"] = json.load(f).get("programs", [])
    except Exception as e:
        print(f"Startup error: {e}")
    yield

app = FastAPI(lifespan=lifespan)

# 4. Standard Setup
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
templates = Jinja2Templates(directory=TEMPLATE_DIR)

@app.get("/")
async def homepage(request: Request):
    # This serves from RAM. On Vercel, this makes your 'warm' requests 
    # feel snappy and responsive.
    return templates.TemplateResponse(
        "index.html",
        {"request": request, "programs": cache["programs"]}
    )