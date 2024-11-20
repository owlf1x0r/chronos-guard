import { Brain, Coffee, Moon } from 'lucide-react';
import { SessionRecord } from '@/types';

interface SessionCountProps {
  sessionRecord: SessionRecord;
  label: string;
  textSize?: 'text-xs' | 'text-base';
}

export function SessionCount({ sessionRecord, label, textSize = 'text-xs' }: SessionCountProps) {
  return (
    <div className="flex flex-col items-start">
      <div className="flex items-center space-x-2 text-sm">
        <span className={`${textSize} font-semibold`}>{label}</span>
        <div className="flex items-center space-x-1">
          <Brain className="w-4 h-4" aria-label="Focus session" />
          <span>{sessionRecord.focus}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Coffee className="w-4 h-4" aria-label="Short break" />
          <span>{sessionRecord.break}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Moon className="w-4 h-4" aria-label="Long break" />
          <span>{sessionRecord.longBreak}</span>
        </div>
      </div>
    </div>
  );
}
