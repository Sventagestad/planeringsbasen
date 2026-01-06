import { NextResponse } from "next/server";
import { CanvasService } from "@/app/Service/CanvasService";

export async function GET() {
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
