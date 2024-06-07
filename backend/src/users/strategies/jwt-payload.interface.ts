export interface JwtPayload {
  userId: number;
  role: string;
  email: string;
  // Дополнительные поля, если необходимо
}
