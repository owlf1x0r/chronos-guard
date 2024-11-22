import { SessionRecord } from '@/types';

export function clearTimeInterval(interval: NodeJS.Timeout | null) {
  if (interval) {
    clearInterval(interval);
  }
}

const sessionRecordsKey = 'sessionRecords';

export function getSessionRecords() {
  const records = localStorage.getItem(sessionRecordsKey);
  return records ? JSON.parse(records) : [];
}

export function saveSessionRecords(records: SessionRecord[]) {
  localStorage.setItem(sessionRecordsKey, JSON.stringify(records));
}
