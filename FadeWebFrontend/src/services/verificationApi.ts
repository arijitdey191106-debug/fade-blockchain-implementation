import type { VerificationResponse } from '../types/verification';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export class APIError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
    this.name = 'APIError';
  }
}

export const verifyContent = async (contentUrl: string): Promise<VerificationResponse> => {
  if (!contentUrl) {
    throw new Error('Content URL is required');
  }

  const encodedUrl = encodeURIComponent(contentUrl);
  const endpoint = `${API_BASE_URL}/getVerificationContent/${encodedUrl}`;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      // Try to parse error message from backend
      let errorMessage = 'Verification request failed';
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMessage = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail);
        }
      } catch (e) {
        // Fallback to status text
        errorMessage = `Error ${response.status}: ${response.statusText}`;
      }
      throw new APIError(errorMessage, response.status);
    }

    const data: VerificationResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new Error(error instanceof Error ? error.message : 'Network error occurred. Please ensure the backend is running.');
  }
};
