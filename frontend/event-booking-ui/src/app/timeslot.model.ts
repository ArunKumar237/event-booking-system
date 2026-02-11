export interface UserBasic {
  id: number;
  username: string;
}

export interface Timeslot {
  id: number;
  category: number;
  category_name: string;
  start_time: string;
  end_time: string;
  booked_by: UserBasic | null;
}
