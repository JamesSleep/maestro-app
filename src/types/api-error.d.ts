export interface ApiError {
  error: string;
  message: string | string[];
  statusCode: number;
  success: boolean;
  timestamp: Date;
}
