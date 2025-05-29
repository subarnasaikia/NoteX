import { apiClient }  from './client';


export const createQuiz = async (data: { contentId: string; numQuestions?: number }) => {
  const response = await apiClient.post("/quiz/generate-quiz", data);
  return response.data;
};

export const fetchAllQuizzes = async () => {
  const response = await apiClient.get("/quiz/fetch-all-quizzes");
  return response.data;
};

