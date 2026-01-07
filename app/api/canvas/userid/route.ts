import { NextResponse } from "next/server";
import { CanvasService } from "@/app/Service/CanvasService";
import { canvasConfig } from "@/app/Config/canvas.config";

/*export async function GET() {
  try {
    const canvasService = new CanvasService();
    const userID = await canvasService.getUserID();
    return NextResponse.json({ userID });
  } catch (error) {
    console.error("Error getting user ID:", error);
    return NextResponse.json(
      { error: "Failed to get user ID" },
      { status: 500 }
    );
  }
}
*/
export async function GET(request: Request) {

    {
        const response = await fetch(
            `${canvasConfig.baseUrl}/user/self?access_token=${canvasConfig.token}`);

        if (!response.ok) {
            return NextResponse.json(
                {error: "Failed to fetch Canvas user"},
                {status: response.status}
            );
        }

        const data = await response.json();

        return NextResponse.json(
            {userID: String(data.id)},
            {
                status: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                },
            }
        );

    }
}
