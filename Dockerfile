# --- Stage 1: Build Stage (ใช้ Node เวอร์ชันที่เหมาะสม) ---
FROM node:20-alpine AS build

# ตั้งค่า Working Directory
WORKDIR /app

# คัดลอก package files
COPY package*.json ./

# ติดตั้ง dependencies สำหรับ Production (ไม่ต้องใช้ devDependencies)
RUN npm install --only=production

# ติดตั้ง dependencies สำหรับ Development (เพื่อใช้ TypeScript และ Prisma ในการ Build)
RUN npm install

# คัดลอก Source Code
COPY . .

# สร้างไฟล์ Migration (Prisma)
# ต้องตั้งค่า DATABASE_URL ใน Render Environment
RUN npx prisma generate

# Build TypeScript เป็น JavaScript (ใช้ tsconfig.json)
RUN npm run build  # ต้องมี script "build" ใน package.json ที่แปลง TS เป็น JS ในโฟลเดอร์ dist/

# --- Stage 2: Production Stage (Image สุดท้าย) ---
FROM node:20-alpine

# ตั้งค่า Working Directory
WORKDIR /app

# คัดลอก dependencies ที่ติดตั้งไว้แล้วจาก Build Stage
COPY --from=build /app/node_modules /app/node_modules

# คัดลอกไฟล์ Build (JavaScript) และไฟล์อื่นๆ ที่จำเป็น
COPY --from=build /app/dist /app/dist
COPY --from=build /app/package.json /app/
COPY --from=build /app/prisma /app/prisma
COPY --from=build /app/index.html /app/

# เปิด Port ที่ Server Node.js ใช้
EXPOSE 3000

# คำสั่งรัน Server
CMD [ "node", "dist/server.js" ] 