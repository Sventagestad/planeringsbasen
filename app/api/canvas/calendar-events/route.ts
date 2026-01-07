import { NextResponse } from "next/server";
import { canvasConfig } from "@/app/Config/canvas.config";

type ScheduleEventDto = {
    title: string;
    description?: string | null;
    start_at: string;
    end_at: string;
    location_name?: string | null;
};

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function POST(request: Request) {
    const body = (await request.json()) as ScheduleEventDto;

    const userRes = await fetch(`${canvasConfig.baseUrl}/users/self`, {
        headers: {
            Authorization: `Bearer ${canvasConfig.token}`,
        },
    });

    if (!userRes.ok) {
        const text = await userRes.text();
        return NextResponse.json(
            { error: "Failed to fetch Canvas user", details: text },
            { status: userRes.status, headers: corsHeaders }
        );
    }

    const userData = await userRes.json();
    const userID = String(userData.id);

    const form = new URLSearchParams();
    form.set("calendar_event[context_code]", `user_${userID}`);
    form.set("calendar_event[title]", body.title);
    form.set("calendar_event[start_at]", body.start_at);
    form.set("calendar_event[end_at]", body.end_at);
    form.set("calendar_event[description]", body.description ?? "");
    form.set("calendar_event[location_name]", body.location_name ?? "");

    const createRes = await fetch(`${canvasConfig.baseUrl}/calendar_events`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${canvasConfig.token}`,
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: form.toString(),
    });

    if (!createRes.ok) {
        const text = await createRes.text();
        return NextResponse.json(
            { error: "Failed to create Canvas calendar event", details: text },
            { status: createRes.status, headers: corsHeaders }
        );
    }

    const created = await createRes.json();
    return NextResponse.json(
        { ok: true, created },
        { status: 200, headers: corsHeaders }
    );
}