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

  async createCalenderEvent(event: ScheduleEvent): Promise<void> {
    const userID = await this.getUserID();
    await axios.post(
      `${canvasConfig.baseUrl}/calendar_events`,
      {
        "calendar_event[context_code]": `user_${userID.toString()}`,
        "calendar_event[title]": event.courseName,
        "calendar_event[start_at]": event.startTime.toISOString(),
        "calendar_event[end_at]": event.endTime.toISOString(),
        "calendar_event[description]": event.details ?? "",
        "calendar_event[location_name]": event.room ?? "Distans",
      },
      {
        headers: {
          Authorization: `Bearer ${canvasConfig.token}`,
        },
      }
    );
  }
}
