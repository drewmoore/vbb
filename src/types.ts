export type ApiResponse<ResponseFormat> = {
  data?: ResponseFormat;

  error?: {
    status: number
  };
}