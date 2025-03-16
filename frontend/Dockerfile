# --- Этап 1: Сборка ---
    FROM node:18-alpine AS builder

    WORKDIR /app
    
    # Копируем package.json и устанавливаем только нужные зависимости
    COPY package.json package-lock.json ./
    RUN npm ci --omit=dev
    
    # Копируем исходный код
    COPY . .
    
    # Собираем Next.js приложение
    RUN npm run build
    
    # --- Этап 2: Запуск (минимальный образ) ---
    FROM alpine:latest
    
    WORKDIR /app
    
    # Устанавливаем Node.js и необходимые утилиты
    RUN apk add --no-cache nodejs npm
    
    # Копируем только необходимые файлы из builder
    COPY --from=builder /app/.next .next
    COPY --from=builder /app/public public
    COPY --from=builder /app/package.json .
    COPY --from=builder /app/node_modules node_modules
    
    # Указываем порт
    EXPOSE 3000
    
    # Запускаем приложение
    CMD ["node_modules/.bin/next", "start"]
    