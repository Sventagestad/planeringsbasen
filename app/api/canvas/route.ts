import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { canvasId } = await request.json();
  const apiKey = process.env.CANVAS_API_KEY;
  const response = await fetch(
    `https://canvas.ltu.se/api/v1/courses?access_token=${apiKey}`
  );
  const data = await response.json();
  return NextResponse.json(data);
}
