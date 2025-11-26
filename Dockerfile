# --- STAGE 1: Builder (เหมือนเดิม) ---
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# -------------------------------------

# --- STAGE 2: Production (Final Image) ---
FROM node:20-alpine

WORKDIR /app

# 1. คัดลอก package.json จาก Builder Stage ที่สำเร็จแล้ว
COPY --from=builder /app/package.json ./

# 2. ติดตั้ง production dependencies
RUN npm install --omit=dev

# 3. คัดลอก Build Output ('dist' folder)
COPY --from=builder /app/dist ./dist

# 4. สร้างโฟลเดอร์ prisma ในคอนเทนเนอร์และคัดลอก schema.prisma
RUN mkdir prisma
COPY prisma/schema.prisma ./prisma/ 

# 5. เปิดเผย (Expose) พอร์ต
EXPOSE 8080

# 6. คำสั่งเริ่มต้นรัน
CMD ["node", "dist/server.js"]