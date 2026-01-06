import axios from "axios";
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
