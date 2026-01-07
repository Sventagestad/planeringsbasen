import { NextResponse } from "next/server";
import { canvasConfig } from "@/app/Config/canvas.config";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function POST(request: Request) {
    const body = await request.json();
    return NextResponse.json({ ok: true, body }, { status: 200 });
}
export async function OPTIONS() {
    return NextResponse.json({}, { status: 200, headers: corsHeaders });
}


export async function GET(request: Request) {
  const response = await fetch(
    `${canvasConfig.baseUrl}/users/self?access_token=${canvasConfig.token}`
  );
  const data = await response.json();
    return NextResponse.json(data, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    });

}
