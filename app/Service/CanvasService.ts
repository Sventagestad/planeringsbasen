import axios from "axios";
import { ScheduleEvent } from "@/app/domain/ScheduleEvent";
import { canvasConfig } from "@/app/Config/canvas.config";

export class CanvasService {
    async createCalenderEvent(
        courseID: number,
        event: ScheduleEvent
    ): Promise<void> {
        await axios.post(
            `${canvasConfig.baseUrl}/calendar_events`,
            {
                "calendar_event[context_code]": `course_${courseID}`,
                "calendar_event[title]": event.courseName,
                "calendar_event[start_at]": event.startTime.toISOString(),
                "calendar_event[end_at]": event.endTime.toISOString(),
                "calendar_event[description]": event.details ?? "",
                "calendar_event[location_name]": event.room ?? "Distans"
            },
            {
                headers: {
                    Authorization: `Bearer ${canvasConfig.token}`
                }
            }



        )
    }


}