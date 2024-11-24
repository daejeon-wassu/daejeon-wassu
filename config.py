import os

# 프로젝트 루트 디렉토리 절대 경로 설정
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, 'backend', 'model', 'clustered_data.csv')
MODEL_PATH = os.path.join(BASE_DIR, 'backend', 'model', 'kmeans_model.joblib')