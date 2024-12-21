# 🚀 Todo App - Full Stack Application

A complete task management solution built with React Native, Node.js, Express, and MySQL.

## 🔗 Repository Links
- [Proyect Repository](https://github.com/Xaviierkasvar/Full-Stack-Todo-Manager)

## 🛠️ Tech Stack
### Frontend (Mobile)
- React Native 0.76.5
- TypeScript
- React Navigation 7
- Axios
- i18n-js

### Backend
- Node.js
- Express
- MySQL
- TypeScript

## 📁 Project Structure

### Frontend Structure
```bash
todo-app-frontend/
├── src/
│   ├── components/       # Reusable components
│   │   └── TodoItem.tsx
│   ├── context/         # Context providers
│   │   ├── languageContext.tsx
│   │   └── themeContext.tsx
│   ├── i18n/           # Translations
│   │   └── translations.ts
│   ├── screens/        # Application screens
│   │   ├── TodoFormScreen.tsx
│   │   └── TodoListScreen.tsx
│   ├── services/       # API services
│   │   └── todoService.ts
│   └── types/          # TypeScript definitions
│       └── index.ts
└── App.tsx
```

### Backend Structure
```bash
todo-app-backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   └── env.config.ts
│   ├── controllers/     # Request handlers
│   │   ├── base.controller.ts
│   │   └── todo.controller.ts
│   ├── middlewares/     # Express middlewares
│   │   ├── error.middleware.ts
│   │   ├── validate.middleware.ts
│   │   └── async.middleware.ts
│   ├── services/        # Business logic
│   │   ├── base.service.ts
│   │   └── todo.service.ts
│   └── app.ts          # Application entry point
```

## 🌐 API Endpoints

```bash
Base URL: /api/v1

# Todo Endpoints
GET    /todos          # List todos (with pagination)
GET    /todos/:id      # Get specific todo
POST   /todos          # Create new todo
PUT    /todos/:id      # Update todo
DELETE /todos/:id      # Delete todo
```

## ✨ Features

### Frontend
- 📱 Modern UI with native components
- 🌙 Dynamic dark mode (system & manual toggle)
- 🌍 Multilanguage support (EN/ES)
- ♾️ Infinite scroll with lazy loading
- 🔄 Pull to refresh
- ⚡ Optimized performance
- 📝 CRUD operations for todos

### Backend
- 🚀 RESTful API architecture
- 📊 MySQL database integration
- 🔐 Error handling middleware
- 📝 Input validation
- 🔄 Async operations handling
- 📱 Mobile-friendly responses

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher
- MySQL 8.0 or higher
- Android Studio & SDK for mobile development
- iOS development tools (for Mac users)

### Frontend Installation

1. Clone the frontend repository
```bash
git clone https://github.com/Xaviierkasvar/todo-app-frontend.git
cd todo-app-frontend
```

2. Install dependencies
```bash
npm install
```

3. Start Metro
```bash
npm start
```

4. Run on Android or iOS
```bash
npm run android
# or
npm run ios
```

### Backend Installation

1. Clone the backend repository
```bash
git clone https://github.com/Xaviierkasvar/todo-app-backend.git
cd todo-app-backend
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
Create a `.env` file in the root directory:
```env
PORT=3000
DB_HOST=localhost
DB_USER=your_username
DB_PASS=your_password
DB_NAME=todo_db
```

4. Start the server
```bash
npm run dev
```

## 📱 Mobile App Features
- Create, read, update, and delete todos
- Dark/Light theme toggle
- Language switching (EN/ES)
- Infinite scroll for todo list
- Pull to refresh
- Form validation
- Error handling
- Loading states

## ⚙️ Backend Features
- RESTful API design
- MySQL database integration
- Error handling middleware
- Input validation
- Async operations handling
- Pagination support

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📝 License
This project is MIT licensed.

## 👤 Author
Francisco Javier Castillo barrios

## 🔧 Troubleshooting

### Common Mobile Issues
1. Metro bundler issues:
```bash
npm start --reset-cache
```

2. Android build errors:
```bash
cd android
./gradlew clean
```

3. Dependencies issues:
```bash
rm -rf node_modules
npm install
```

### Common Backend Issues
1. Database connection issues:
- Check MySQL service is running
- Verify credentials in .env file
- Ensure database exists

2. Port already in use:
```bash
lsof -i :3000
kill -9 PID
```