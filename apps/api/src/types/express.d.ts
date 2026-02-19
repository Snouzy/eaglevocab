declare namespace Express {
  interface Request {
    user?: {
      id: string;
      name: string;
      email: string;
    };
    sessionData?: {
      id: string;
      token: string;
      userId: string;
      expiresAt: Date;
    };
  }
}
