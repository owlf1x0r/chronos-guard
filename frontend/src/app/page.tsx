'use client';

import React, { useState } from 'react';
import PomodoroTimer from '@/components/features/timer/PomodoroTimer';
import { SessionRecord, UpdateSessionRecordParam } from '@/types';

export default function Home() {
  const [sessionRecords, setSessionRecords] = useState<SessionRecord[]>([]);

  const updateSessionRecord = ({ date, sessionType }: UpdateSessionRecordParam) => {
    setSessionRecords((prevRecords) => {
      const updatedRecords = prevRecords.map((record) => {
        if (record.date === date) {
          return { ...record, [sessionType]: record[sessionType] + 1 };
        }
        return record;
      });
      return updatedRecords;
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <PomodoroTimer sessionRecords={sessionRecords} updateSessionRecord={updateSessionRecord} />
    </div>
  );
}
