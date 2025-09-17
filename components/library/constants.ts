export enum ExamType {
  LIVE = 'live',
  UPCOMING = 'upcoming',
  COMPLETED = 'completed'
}

export const EXAM_TYPE_COLORS = {
  [ExamType.LIVE]: {
    primary: 'red-500',
    background: 'red-50',
    border: 'red-200',
    text: 'red-600',
    icon: 'red-500'
  },
  [ExamType.UPCOMING]: {
    primary: 'blue-500',
    background: 'blue-50',
    border: 'blue-200',
    text: 'blue-600',
    icon: 'blue-500'
  },
  [ExamType.COMPLETED]: {
    primary: 'green-500',
    background: 'green-50',
    border: 'green-200',
    text: 'green-600',
    icon: 'green-500'
  }
} as const;

export const EXAM_TYPE_ICONS = {
  [ExamType.LIVE]: 'flash',
  [ExamType.UPCOMING]: 'time',
  [ExamType.COMPLETED]: 'checkmark-circle'
} as const;
