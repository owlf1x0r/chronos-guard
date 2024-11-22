'use client';

import React, { useEffect, useState } from 'react';
import PomodoroTimer from '@/components/features/timer/PomodoroTimer';
import { SessionRecord, UpdateSessionRecordParam } from '@/types';
import { getSessionRecords, saveSessionRecords } from '@/utils/timer';

export default function Home() {
  const [sessionRecords, setSessionRecords] = useState<SessionRecord[]>([]);

  useEffect(() => {
    const sessionRecordsFromDB = getSessionRecords();
    setSessionRecords(sessionRecordsFromDB);
  }, []);

  useEffect(() => {
    saveSessionRecords(sessionRecords);
  }, [sessionRecords]);

  const updateSessionRecord = ({ date, sessionType }: UpdateSessionRecordParam) => {
    setSessionRecords((prevRecords) => {
      const recordIndex = prevRecords.findIndex((record) => record.date === date);

      if (recordIndex >= 0) {
        const updatedRecords = [...prevRecords];
        updatedRecords[recordIndex] = {
          ...updatedRecords[recordIndex],
          [sessionType]: updatedRecords[recordIndex][sessionType] + 1,
        };
        return updatedRecords;
      }

      return [
        ...prevRecords,
        {
          date,
          focus: 0,
          break: 0,
          longBreak: 0,
          [sessionType]: 1,
        },
      ];
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <PomodoroTimer sessionRecords={sessionRecords} updateSessionRecord={updateSessionRecord} />
    </div>
  );
}
