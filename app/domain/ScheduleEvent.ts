export interface ScheduleEvent {
  contextCode: string;
  title: string;
  description?: string;
  start_at: Date;
  end_at: Date;
  location_name?: string;
  all_day?: boolean;
}
