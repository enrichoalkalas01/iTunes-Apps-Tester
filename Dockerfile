# Gunakan node:16-alpine sebagai base image
FROM node:16-alpine

# Set working directory di dalam container
WORKDIR /app

# Copy package.json dan package-lock.json ke dalam container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua file yang dibutuhkan ke dalam container
COPY . .

# Build aplikasi React
RUN npm run build

# Port yang digunakan oleh aplikasi React
EXPOSE 3000

# Command untuk menjalankan aplikasi
CMD ["npm", "start"]
