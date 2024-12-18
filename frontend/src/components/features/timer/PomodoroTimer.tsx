'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProgressBars } from '@/components/features/timer/ProgressBars';
import { SessionHistory } from '@/components/features/timer/SessionHistory';
import { TaskDialog } from '@/components/features/timer/TaskDialog';
import { SessionRecord, SessionType, UpdateSessionRecordParam, Task, SoundType } from '@/types';
import { clearTimeInterval } from '@/utils/timer';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useSound } from '@/hooks/useSound';
import { SoundControls } from './SoundControls';

const focusMinutes = 25;
const breakMinutes = 5;
const longBreakMinutes = 15;

interface PomodoroTimerProps {
  sessionRecords: SessionRecord[];
  updateSessionRecord: ({ date, sessionType }: UpdateSessionRecordParam) => void;
  tasks: Task[];
  onCreateTask: (taskName: string) => void;
  onDeleteTask: (taskId: number) => void;
  currentTask: Task;
  onSelectTask: (task: Task) => void;
}

export default function PomodoroTimer({
  sessionRecords,
  updateSessionRecord,
  tasks,
  onCreateTask,
  onDeleteTask,
  currentTask,
  onSelectTask,
}: PomodoroTimerProps) {
  const [minutes, setMinutes] = useState(focusMinutes);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<SessionType>('focus');
  const [focusCount, setFocusCount] = useState(0);
  const [isAuto, setIsAuto] = useState(false);

  const tickSound = useSound('/sounds/tick.wav');
  const completeSound = useSound('/sounds/complete.wav');

  const today = new Date().toISOString().split('T')[0];

  const todaySession = sessionRecords.find((record) => record.date === today) ?? {
    date: today,
    focus: 0,
    break: 0,
    longBreak: 0,
  };

  const updateSessions = useCallback(
    (sessionType: SessionType) => {
      updateSessionRecord({ date: today, sessionType });
    },
    [today, updateSessionRecord]
  );

  useEffect(() => {
    if (!isActive) {
      tickSound.pause();
    }
  }, [isActive, tickSound]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
          tickSound.play();
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          completeSound.play();
          clearTimeInterval(interval);
          updateSessions(mode);
          setIsActive(isAuto);
          if (mode === 'focus') {
            setFocusCount((prevCount) => prevCount + 1);
            if (focusCount === 3) {
              setMode('break');
              setMinutes(longBreakMinutes);
              setFocusCount(0);
            } else {
              setMode('break');
              setMinutes(breakMinutes);
            }
          } else {
            setMode('focus');
            setMinutes(focusMinutes);
          }
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearTimeInterval(interval);
    }

    return () => clearTimeInterval(interval);
  }, [isActive, minutes, seconds, mode, focusCount, updateSessions, isAuto, tickSound, completeSound]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(0);
    if (mode === 'focus') {
      setMinutes(focusMinutes);
    } else if (mode === 'break') {
      setMinutes(breakMinutes);
    } else {
      setMinutes(longBreakMinutes);
    }
  };

  const skipTimer = () => {
    setIsActive(false);
    setSeconds(0);
    if (mode === 'focus') {
      setMode('break');
      setMinutes(breakMinutes);
    } else {
      setMode('focus');
      setMinutes(focusMinutes);
    }
  };

  const handleSelectTask = (task: Task) => {
    onSelectTask(task);
  };

  const totalMinutes = mode === 'focus' ? focusMinutes : mode === 'longBreak' ? longBreakMinutes : breakMinutes;
  const activeMinutes = totalMinutes - minutes - 1;
  const activeSeconds = seconds === 0 ? 0 : 60 - seconds;

  const toggleAuto = () => {
    setIsAuto(!isAuto);
  };

  const handleVolumeChange = (type: SoundType, volume: number) => {
    if (type === 'tick') {
      tickSound.handleVolume(volume);
    } else {
      completeSound.handleVolume(volume);
    }
  };

  const handleMuteChange = (type: SoundType, muted: boolean) => {
    if (type === 'tick') {
      tickSound.handleMute(muted);
    } else {
      completeSound.handleMute(muted);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {mode === 'focus' ? 'Focus Session' : 'Break Time'}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        <div className="flex justify-between w-full">
          <TaskDialog
            tasks={tasks}
            currentTask={currentTask}
            onCreateTask={onCreateTask}
            onSelectTask={handleSelectTask}
            onDeleteTask={onDeleteTask}
          />
          <SoundControls onVolumeChange={handleVolumeChange} onMuteChange={handleMuteChange} />
        </div>
        <div className="text-6xl font-bold tabular-nums flex">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={minutes}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-block w-[1.1em] text-center"
            >
              {String(minutes).padStart(2, '0')}
            </motion.span>
          </AnimatePresence>
          <span>:</span>
          <AnimatePresence mode="popLayout">
            <motion.span
              key={seconds}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-block w-[1.1em] text-center"
            >
              {String(seconds).padStart(2, '0')}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="w-full space-y-2">
          <ProgressBars totalBars={totalMinutes} activeBars={activeMinutes} color="bg-primary" />
          <ProgressBars totalBars={59} activeBars={activeSeconds} color="bg-stone-900" />
        </div>
        <SessionHistory todaySessionRecord={todaySession} totalSessionRecords={sessionRecords} />
        <div className="flex items-center space-x-4">
          <Button onClick={resetTimer} variant="outline" size="icon">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button onClick={skipTimer} variant="outline" size="icon">
            <SkipForward className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-2">
            <Switch id="auto" checked={isAuto} onCheckedChange={toggleAuto} />
            <Label htmlFor="auto">Auto</Label>
          </div>
          <Button onClick={toggleTimer} variant="default" size="lg">
            {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
