/*import axios from "axios";
import { ScheduleEvent } from "@/app/domain/ScheduleEvent";
import { canvasConfig } from "@/app/Config/canvas.config";

export class CanvasService {
  async getUserID(): Promise<string> {
    const response = await axios.get(
      `${canvasConfig.baseUrl}/users/self?access_token=${canvasConfig.token}`
    );
    return response.data.id;
  }

  async createCalenderEvent(reservation: ScheduleEvent): Promise<void> {
    const userID = await this.getUserID();
    await axios.post(
      `${canvasConfig.baseUrl}/calendar_events`,
      {
        "calendar_event[context_code]": `user_${userID.toString()}`,
        "calendar_event[title]": reservation.title,
        "calendar_event[start_at]": reservation.start_at.toISOString(),
        "calendar_event[end_at]": reservation.end_at.toISOString(),
        "calendar_event[description]": reservation.description ?? "",
        "calendar_event[location_name]": reservation.location_name ?? "",
      },
      {
        headers: {
          Authorization: `Bearer ${canvasConfig.token}`,
        },
      }
    );
  }
}
'/
 */
import { ScheduleEvent } from "@/app/domain/ScheduleEvent";

export class CanvasService {
    async getUserID(): Promise<string> {
        const res = await fetch("/api/canvas/userid", {
            method: "GET",
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Failed to get userID (${res.status}): ${text}`);
        }

        const data = (await res.json()) as { userID: string };
        return data.userID;
    }

    async createCalenderEvent(reservation: ScheduleEvent): Promise<void> {
        const res = await fetch("/api/canvas/calendar-events", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: reservation.title,
                description: reservation.description ?? "",
                start_at: reservation.start_at.toISOString(),
                end_at: reservation.end_at.toISOString(),
                location_name: reservation.location_name ?? "",
            }),
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Failed to create calendar event (${res.status}): ${text}`);
        }
    }
}
