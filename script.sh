#!/bin/bash

echo "🚀 Setup Agenda App..."

# Crea directory principale
mkdir -p agenda-app
cd agenda-app

echo "📦 Creazione Backend NestJS..."
# Backend
mkdir -p backend/src/events/schemas
cd backend

# package.json backend
cat > package.json << 'EOF'
{
  "name": "agenda-backend",
  "version": "1.0.0",
  "scripts": {
    "start": "nest start",
    "start:dev": "nest start --watch",
    "build": "nest build"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/mongoose": "^10.0.2",
    "mongoose": "^8.0.3",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@types/node": "^20.3.1",
    "typescript": "^5.1.3"
  }
}
EOF

# Dockerfile backend
cat > Dockerfile << 'EOF'
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "start"]
EOF

# tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false
  }
}
EOF

# nest-cli.json
cat > nest-cli.json << 'EOF'
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src"
}
EOF

# main.ts
cat > src/main.ts << 'EOF'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT || 3001);
  console.log('🚀 Backend running on port 3001');
}
bootstrap();
EOF

# app.module.ts
cat > src/app.module.ts << 'EOF'
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/agenda'),
    EventsModule,
  ],
})
export class AppModule {}
EOF

# event.schema.ts
cat > src/events/schemas/event.schema.ts << 'EOF'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Event extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  time: string;

  @Prop({ required: true, enum: ['meeting', 'interview'] })
  type: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);
EOF

# events.service.ts
cat > src/events/events.service.ts << 'EOF'
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './schemas/event.schema';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}

  async findAll(): Promise<Event[]> {
    return this.eventModel.find().sort({ date: 1, time: 1 }).exec();
  }

  async create(eventData: Partial<Event>): Promise<Event> {
    const event = new this.eventModel(eventData);
    return event.save();
  }

  async delete(id: string): Promise<Event> {
    return this.eventModel.findByIdAndDelete(id).exec();
  }
}
EOF

# events.controller.ts
cat > src/events/events.controller.ts << 'EOF'
import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Post()
  create(@Body() eventData: any) {
    return this.eventsService.create(eventData);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.eventsService.delete(id);
  }
}
EOF

# events.module.ts
cat > src/events/events.module.ts << 'EOF'
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Event, EventSchema } from './schemas/event.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }])],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
EOF

cd ..

echo "🎨 Creazione Frontend React..."
# Frontend
mkdir -p frontend/src
cd frontend

# package.json frontend
cat > package.json << 'EOF'
{
  "name": "agenda-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.3",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.27",
    "tailwindcss": "^3.3.3",
    "vite": "^4.4.5"
  }
}
EOF

# Dockerfile frontend
cat > Dockerfile << 'EOF'
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

# nginx.conf
cat > nginx.conf << 'EOF'
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    location /api {
        proxy_pass http://backend:3001;
    }
}
EOF

# vite.config.js
cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
EOF

# tailwind.config.js
cat > tailwind.config.js << 'EOF'
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
EOF

# postcss.config.js
cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
EOF

# index.html
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Agenda</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
EOF

# main.jsx
cat > src/main.jsx << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

# index.css
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}
EOF

# App.jsx
cat > src/App.jsx << 'EOF'
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, X, Trash2 } from 'lucide-react';

const API_URL = '/api/events';

function App() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentEvent, setCurrentEvent] = useState({ 
    title: '', 
    date: '', 
    time: '', 
    type: 'meeting' 
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error('Errore nel caricamento:', error);
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async () => {
    if (currentEvent.title && currentEvent.date && currentEvent.time) {
      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(currentEvent),
        });
        const newEvent = await res.json();
        setEvents([...events, newEvent]);
        setCurrentEvent({ title: '', date: '', time: '', type: 'meeting' });
        setShowModal(false);
      } catch (error) {
        console.error('Errore nel salvataggio:', error);
      }
    }
  };

  const deleteEvent = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setEvents(events.filter(e => e._id !== id));
    } catch (error) {
      console.error('Errore nella cancellazione:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-2xl text-indigo-600">Caricamento...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-500 p-3 rounded-xl">
                <Calendar className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">My Agenda</h1>
                <p className="text-gray-500 text-sm">Gestisci eventi e colloqui</p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
            >
              <Plus size={20} />
              Nuovo
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {events.map(event => (
            <div
              key={event._id}
              className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`p-3 rounded-lg ${
                    event.type === 'meeting' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    {event.type === 'meeting' ? (
                      <Calendar className="text-blue-600" size={24} />
                    ) : (
                      <Clock className="text-green-600" size={24} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800">{event.title}</h3>
                    <div className="flex gap-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(event.date).toLocaleDateString('it-IT')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {event.time}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        event.type === 'meeting' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {event.type === 'meeting' ? 'Evento' : 'Colloquio'}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteEvent(event._id)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Calendar className="mx-auto text-gray-300 mb-4" size={64} />
            <p className="text-gray-500 text-lg">Nessun evento in agenda</p>
            <p className="text-gray-400 text-sm mt-2">Clicca su "Nuovo" per aggiungere un evento</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Nuovo Evento</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titolo</label>
                <input
                  type="text"
                  value={currentEvent.title}
                  onChange={(e) => setCurrentEvent({...currentEvent, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Es: Riunione importante"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                <input
                  type="date"
                  value={currentEvent.date}
                  onChange={(e) => setCurrentEvent({...currentEvent, date: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ora</label>
                <input
                  type="time"
                  value={currentEvent.time}
                  onChange={(e) => setCurrentEvent({...currentEvent, time: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                <select
                  value={currentEvent.type}
                  onChange={(e) => setCurrentEvent({...currentEvent, type: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  <option value="meeting">Evento</option>
                  <option value="interview">Colloquio</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                Annulla
              </button>
              <button
                onClick={addEvent}
                className="flex-1 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-all shadow-md"
              >
                Salva
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
EOF

cd ..

echo "🐳 Creazione Docker Compose..."
# docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  mongodb:
    image: mongo:7
    container_name: agenda-mongo
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    environment:
      MONGO_INITDB_DATABASE: agenda

  backend:
    build: ./backend
    container_name: agenda-backend
    restart: always
    ports:
      - "3001:3001"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/agenda
      - PORT=3001
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    container_name: agenda-frontend
    restart: always
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  mongo-data:
EOF

# README.md
cat > README.md << 'EOF'
# 📅 My Agenda App

Applicazione agenda leggera e veloce per gestire eventi e colloqui.

## 🚀 Avvio Rapido

```bash
docker-compose up --build
```

Apri: http://localhost:3000

## 🛑 Stop

```bash
docker-compose down
```
EOF

echo ""
echo "✅ Setup completato!"
echo ""
echo "📁 Struttura creata in: ./agenda-app"
echo ""
echo "🚀 Per avviare l'app:"
echo "   cd agenda-app"
echo "   docker-compose up --build"
echo ""
echo "🌐 App disponibile su: http://localhost:3000"