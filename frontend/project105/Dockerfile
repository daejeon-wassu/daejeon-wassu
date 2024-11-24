# Stage 1: Next.js 애플리케이션 빌드 단계
FROM node:20.15.0 AS builder

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 애플리케이션 코드 복사
COPY . .

# Next.js 애플리케이션 빌드
RUN npm run build

# Stage 2: 빌드된 애플리케이션 실행 단계
FROM node:20.15.0

# 빌드 단계에서 생성된 파일 복사
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# 프로덕션 환경의 의존성만 설치
RUN npm install --production

# Next.js 애플리케이션 시작
CMD ["npm", "start"]
