export interface ScheduleEvent {

    courseCode: string;
    courseName: string;
    startTime: Date;
    endTime: Date;
    teacher: string;
    room?: string;
    isDistance: boolean;
    details?: string;

}