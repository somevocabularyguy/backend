interface DecodedAuth {
  userId: string;
}

interface DecodedSignIn {
  email: string;
}

interface FeedbackData {
  feedbackType: string;
  feedbackText: string;
  files: File[];
}

export { DecodedAuth, DecodedSignIn, FeedbackData };