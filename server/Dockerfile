# 1. 베이스 이미지 설정 (Node.js 20 Alpine)
FROM node:20-alpine

# 작업 디렉토리 생성 및 설정
WORKDIR /usr/src/app

# 2. 레이어 캐시 활용: package.json과 package-lock.json 먼저 복사
COPY package*.json ./

# 프로덕션 의존성만 설치 및 node 사용자 권한 부여
RUN npm ci --omit=dev && chown -R node:node /usr/src/app

# 3. 소스 코드 복사 (node 사용자 소유)
COPY --chown=node:node . .

# 4. 기본 포트 환경변수 설정 및 포트 노출
ENV PORT=4000
EXPOSE 4000

# 5. 보안을 위해 비루트(node) 사용자로 전환
USER node

# 6. 서버 실행 명령어
CMD ["node", "server.js"]
