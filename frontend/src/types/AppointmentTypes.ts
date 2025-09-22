export interface AppointmentTypes {
    _id: string;
    name?: string;
    user?: {
    _id: string;
    userName: string;
    email: string;
    };
    email: string;
    type: string;
    time: string;
    date: string;
    status: string;
}