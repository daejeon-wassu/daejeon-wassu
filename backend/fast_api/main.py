from fastapi import FastAPI
import uvicorn
from routers.recommendation import recommendation_router

app = FastAPI()

# 라우터 연결
app.include_router(recommendation_router, prefix="/fast_api")

# 기본 엔드포인트
@app.get("/")
def read_root():
    return {"message": "Welcome to the Travel Recommendation API"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)