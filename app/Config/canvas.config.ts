import dotenv from "dotenv";
dotenv.config();

export const canvasConfig = {
  baseUrl: process.env.CANVAS_BASE_URL ?? "https://canvas.ltu.se/api/v1",
  token: process.env.CANVAS_TOKEN as string,
};
