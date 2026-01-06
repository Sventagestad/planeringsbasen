import { NextResponse } from "next/server";
import { canvasConfig } from "@/app/Config/canvas.config";

export async function GET(request: Request) {
  const response = await fetch(
    `${canvasConfig.baseUrl}/users/self?access_token=${canvasConfig.token}`
  );
  const data = await response.json();
  return NextResponse.json(data);
}
