# Joykoly Test App

A React Native mobile application for the Joykoly Academy learning platform, built with Expo and TypeScript.

## 🚀 Features

### 📱 Core Functionality
- **Dashboard**: View enrolled courses, live exams, practice exams, and recent results
- **Exam System**: Complete exam-taking experience with timer, progress tracking, and results
- **Course Management**: Browse and track progress of enrolled courses
- **Tab Navigation**: Dashboard, Store, Library, and Profile tabs

### 🎯 Exam Features
- **Live Exams**: Real-time exam taking with countdown timer
- **Practice Exams**: Self-paced practice sessions
- **Question Types**: Support for MCQ and written questions
- **Progress Tracking**: Visual progress indicators and question navigation
- **Results Analysis**: Detailed performance metrics and scoring

### 🛠 Technical Features
- **API Integration**: Axios-based API client with authentication
- **TypeScript**: Full type safety throughout the application
- **NativeWind**: Tailwind CSS styling for React Native
- **Error Handling**: Comprehensive error handling and loading states
- **Responsive Design**: Mobile-optimized UI components

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

## 🛠 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/amit-biswas-1992/joykoly-test-app.git
   cd joykoly-test-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

## 📁 Project Structure

```
joykoly-test-app/
├── app/                          # Expo Router app directory
│   ├── (drawer)/                # Drawer navigation
│   │   └── (tabs)/              # Tab navigation
│   │       ├── index.tsx        # Dashboard tab
│   │       ├── store.tsx        # Store tab
│   │       ├── library.tsx      # Library tab
│   │       └── profile.tsx      # Profile tab
│   └── exam/                    # Exam screens
│       └── [id].tsx            # Dynamic exam route
├── components/                   # Reusable components
│   ├── dashboard/               # Dashboard-specific components
│   │   ├── CourseCard.tsx
│   │   ├── ExamCard.tsx
│   │   └── DashboardView.tsx
│   └── exam/                    # Exam-specific components
│       ├── ExamQuestion.tsx
│       ├── ExamResults.tsx
│       └── ExamView.tsx
├── constants/                    # App constants
│   └── api-endpoints.ts         # API endpoint definitions
├── services/                     # API services
│   ├── api-client.ts            # Main API client
│   └── dashboard.service.ts     # Dashboard data services
└── lib/                         # Utility libraries
```

## 🔧 Configuration

### API Configuration
The app is configured to connect to the Joykoly Academy API. The API endpoints are defined in `constants/api-endpoints.ts`:

```typescript
export const API_BASE_URL = 'https://api.joykoly.com';
export const API_VERSION = 'v1';
```

### Authentication
The app uses a JWT token for authentication. The token is configured in `services/api-client.ts`.

## 📱 Screens

### Dashboard
- **My Courses**: List of enrolled courses with progress indicators
- **Live Exams**: Currently active exams
- **Practice Exams**: Available practice sessions
- **Upcoming Exams**: Scheduled exams
- **Recent Results**: Completed exam results

### Exam Taking
- **Question Navigation**: Previous/Next navigation with progress indicators
- **Timer**: Countdown timer for timed exams
- **Answer Selection**: MCQ and written question support
- **Auto-submit**: Automatic submission when time expires

### Results
- **Score Display**: Overall score and percentage
- **Performance Analysis**: Accuracy, speed, and detailed metrics
- **Action Buttons**: Retake, view answers, or return to dashboard

## 🎨 Styling

The app uses NativeWind (Tailwind CSS for React Native) for styling:

- **Consistent Design**: Modern, clean interface
- **Responsive Layout**: Mobile-optimized components
- **Color Scheme**: Blue primary color with semantic colors for status
- **Typography**: Clear hierarchy with proper font weights

## 🔌 API Integration

### Available Endpoints
- **Authentication**: Login, register, profile management
- **Courses**: Course listing, enrollment, progress tracking
- **Exams**: Exam listing, question fetching, submission
- **User**: Profile, dashboard, preferences

### Error Handling
- Network error handling with user-friendly messages
- Loading states for all API calls
- Retry mechanisms for failed requests

## 🚀 Development

### Available Scripts
```bash
npm start          # Start Expo development server
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run web        # Run on web browser
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
```

### Code Quality
- **ESLint**: Code linting with Expo configuration
- **Prettier**: Code formatting
- **TypeScript**: Type checking and safety

## 📦 Dependencies

### Core Dependencies
- **Expo**: React Native development platform
- **React Navigation**: Navigation library
- **Axios**: HTTP client for API calls
- **NativeWind**: Tailwind CSS for React Native
- **TypeScript**: Type safety

### UI Components
- **NativeWindUI**: Pre-built UI components
- **React Native Elements**: Additional UI components

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Repository**: https://github.com/amit-biswas-1992/joykoly-test-app
- **API Documentation**: [Joykoly Academy API](https://api.joykoly.com/docs)

## 📞 Support

For support, email support@joykoly.com or create an issue in this repository.

---

Built with ❤️ for Joykoly Academy
