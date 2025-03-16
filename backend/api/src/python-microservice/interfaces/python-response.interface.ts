export interface PythonResponse {
  result: Array<{
    inn: string;
    processed: boolean;
  }>;
}
