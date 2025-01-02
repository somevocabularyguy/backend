interface DecodedAuth {
  userId: string;
}

interface DecodedSignIn {
  email: string;
}

interface WordData {
  id: string;
  notShownTimeSpent: number;
  shownTimeSpent: number;
  notShownSeen: number;
  shownSeen: number;
  lastViewed: number;
  learningScore: number
}

interface UserDataType {
  totalUseTime: number;
  languageArray: string[];
  hiddenWordIds: string[];
  customWordIds: string[];
  wordsData: WordData[]
}

interface FeedbackData {
  feedbackType: string;
  feedbackText: string;
  files: File[];
}



export { DecodedAuth, DecodedSignIn, FeedbackData, UserDataType };