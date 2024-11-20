import { SessionRecord } from '@/types';
import { SessionCount } from '@/components/features/timer/SessionCount';
import { SessionHistoryDialog } from '@/components/features/timer/SessionHistoryDialog';

interface SessionHistoryProps {
  todaySessionRecord: SessionRecord;
  totalSessionRecords: SessionRecord[];
}

export function SessionHistory({ todaySessionRecord, totalSessionRecords }: SessionHistoryProps) {
  const totalSessionRecord = totalSessionRecords.reduce(
    (acc, record) => {
      acc.focus += record.focus;
      acc.break += record.break;
      acc.longBreak += record.longBreak;
      return acc;
    },
    { date: '', focus: 0, break: 0, longBreak: 0 }
  );
  return (
    <div className="flex items-center justify-between w-full">
      <SessionCount sessionRecord={todaySessionRecord} label="Today" />
      <SessionHistoryDialog sessionHistory={totalSessionRecords} />
      <SessionCount sessionRecord={totalSessionRecord} label="Total" />
    </div>
  );
}
