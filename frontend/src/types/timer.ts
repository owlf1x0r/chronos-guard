export interface SessionRecord {
  date: string;
  focus: number;
  break: number;
  longBreak: number;
}

export type SessionType = 'focus' | 'break' | 'longBreak';

export interface UpdateSessionRecordParam {
  date: string;
  sessionType: SessionType;
}
