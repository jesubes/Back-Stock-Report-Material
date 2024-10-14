# # FROM node:22.9.0-slim
# # WORKDIR /app
# # COPY . .
# # RUN npm i npm
# # CMD [ "npm", "run", "dev" ]

# FROM node:22-bullseye

# # Crear un directorio de trabajo
# WORKDIR /app

# # Copiar package.json y package-lock.json
# COPY package*.json ./

# RUN apt update && apt install -y chromium

# # Instalar las dependencias
# RUN npm install

# # Copiar el resto de los archivos de la aplicación
# COPY . .

# # Exponer el puerto en el que tu aplicación de backend escuchará
# EXPOSE 4000  
# # Cambia este puerto si tu backend usa uno diferente

# # Comando para iniciar tu aplicación
# CMD ["npm", "run", "start"]

FROM node:18-slim

# Instala las dependencias de Puppeteer
RUN apt-get update && apt-get install -y \
    wget \
    --no-install-recommends \
    && apt-get install -yq libgconf-2-4 \
    && apt-get install -y \
    libnss3 \
    libxss1 \
    libasound2 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libgbm1 \
    libnspr4 \
    libxcomposite1 \
    libxrandr2 \
    xdg-utils \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Instalar dependencias necesarias para Chromium
RUN apt-get update && apt-get install -y \
    chromium \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    --no-install-recommends

# Configurar Puppeteer para usar Chromium externo
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Instalar dependencias del proyecto
WORKDIR /app
COPY package*.json ./
RUN npm install

# Copiar el código de la aplicación
COPY . .

CMD ["node", "app.js"]