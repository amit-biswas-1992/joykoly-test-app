export interface LibraryItem {
  id: string;
  title: string;
  type: 'live' | 'upcoming' | 'completed';
  thumbnail?: string;
  progress?: number;
  lastAccessed?: string;
  isCompleted?: boolean;
  category?: string;
  course?: string;
  duration?: number;
  totalMarks?: number;
  status?: string;
  score?: number;
  scheduledAt?: string;
  startTime?: string;
  endTime?: string;
}
