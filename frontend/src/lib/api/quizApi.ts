import { apiClient }  from './client';


export const createQuiz = async (data: { contentId: string; numQuestions?: number }) => {
  const response = await apiClient.post("/quiz/generate-quiz", data);
  return response.data;
};

export const fetchAllQuizzes = async () => {
  const response = await apiClient.get("/quiz/fetch-all-quizzes");
  return response.data;
};

export const fetchQuizById = async (quizId: string) => {
  const response = await apiClient.get(`/quiz/fetch-quiz/${quizId}`);
  return response.data;
};

export const submitQuiz = async (data: { quizId: string; answers: string[] }) => {
  const response = await apiClient.post("/quiz/submit-quiz", data);
  return response.data;
};

export const fetchQuizResults = async (quizId: string) => {
  const response = await apiClient.get(`/quiz/results/${quizId}`);
  return response.data;
};

