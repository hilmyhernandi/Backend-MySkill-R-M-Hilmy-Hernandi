import cors from "cors";

export const corsOptions: cors.CorsOptions = {
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};
