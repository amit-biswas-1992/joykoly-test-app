# Profile Implementation for Mobile App

This document describes the profile functionality implemented for the Joykoly Academy mobile app, based on the existing web version.

## Features Implemented

### 1. Profile Types (`types/profile.ts`)
- Complete TypeScript interfaces for all profile-related data
- Social links, academic records, achievements, addresses
- User preferences and purchase history types

### 2. Profile Components

#### ProfileAvatar (`components/profile/ProfileAvatar.tsx`)
- Avatar display with fallback initials
- Image picker functionality (placeholder implementation)
- Editable avatar with camera icon overlay
- Multiple size variants (sm, md, lg)

#### ProfileCard (`components/profile/ProfileCard.tsx`)
- Main profile information display
- Academic stats and progress indicators
- Profile completion percentage
- Quick stats for subjects, achievements, and goals

#### SubjectBadge (`components/profile/SubjectBadge.tsx`)
- Display subjects as badges
- Editable badges with remove functionality
- Multiple variants (default, secondary, outline)

#### AchievementCard (`components/profile/AchievementCard.tsx`)
- Display individual achievements
- Category-based styling
- Date formatting for Bengali locale

#### AcademicRecordCard (`components/profile/AcademicRecordCard.tsx`)
- Display academic history records
- GPA and exam information
- Institution and board details

### 3. Profile Pages

#### Main Profile Page (`app/(drawer)/(tabs)/profile.tsx`)
- Complete profile view with all sections
- Pull-to-refresh functionality
- Editable sections for subjects and goals
- Academic history and achievements display
- Purchase history section

#### Profile Settings Page (`app/(drawer)/(tabs)/profile-settings.tsx`)
- Tabbed interface for different settings categories
- Personal information editing
- Academic information management
- Address management with Bangladeshi divisions/districts
- Avatar upload functionality

### 4. User Service (`services/user.service.ts`)
- Complete API service methods for profile operations
- Avatar upload, subject/goal management
- Academic records and achievements management
- Social links and address management
- Purchase history retrieval

### 5. Mock Data (`data/mock-profile.ts`)
- Sample profile data for testing
- Sample purchases data
- Bengali language content examples

## Key Features

### Bengali Language Support
- All UI text in Bengali
- Proper NCTB (National Curriculum and Textbook Board) terms
- Bengali date formatting

### Mobile-Optimized UI
- Native React Native components
- Expo vector icons for cross-platform compatibility
- Touch-friendly interface elements
- Pull-to-refresh functionality

### Profile Management
- Complete CRUD operations for profile data
- Avatar management with image picker
- Academic record tracking
- Achievement management
- Address management with Bangladeshi geography

### Data Persistence
- API integration ready
- Optimistic UI updates
- Error handling with user-friendly messages

## Usage

### Basic Profile Display
```typescript
import { ProfileCard } from '~/components/profile/ProfileCard';

<ProfileCard 
  profile={profileData} 
  onEdit={() => setEditing(true)}
/>
```

### Profile Settings
```typescript
import ProfileSettings from '~/app/(drawer)/(tabs)/profile-settings';

// Navigate to profile settings page
```

### User Service Usage
```typescript
import { userService } from '~/services/user.service';

// Get profile data
const result = await userService.getProfile();

// Update profile
const updateResult = await userService.updateProfile(profileData);

// Add favorite subject
await userService.addFavoriteSubject('গণিত');
```

## API Endpoints Expected

The implementation expects the following API endpoints:

- `GET /api/v1/profiles/user` - Get user profile
- `PUT /api/v1/profiles/user` - Update user profile
- `POST /api/v1/profiles/user/avatar` - Upload avatar
- `POST /api/v1/profiles/user/subjects` - Add favorite subject
- `DELETE /api/v1/profiles/user/subjects` - Remove favorite subject
- `POST /api/v1/profiles/user/goals` - Add study goal
- `DELETE /api/v1/profiles/user/goals` - Remove study goal
- `GET /api/v1/user/purchases` - Get purchase history

## Styling

The implementation uses:
- NativeWind for styling (Tailwind CSS for React Native)
- Consistent color scheme with dark mode support
- Bengali typography considerations
- Mobile-first responsive design

## Future Enhancements

1. Image picker integration with expo-image-picker
2. Offline data caching
3. Profile sharing functionality
4. Advanced privacy settings
5. Profile analytics and insights
6. Integration with social features

## Testing

Use the mock data in `data/mock-profile.ts` for testing the profile functionality without backend integration.

```typescript
import { mockProfileData } from '~/data/mock-profile';

// Use mock data for development
const [profile, setProfile] = useState(mockProfileData);
```
