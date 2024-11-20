'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProgressBars } from '@/components/features/timer/ProgressBars';
import { SessionHistory } from '@/components/features/timer/SessionHistory';
import { TaskDialog } from '@/components/features/timer/TaskDialog';
import { useToast } from '@/hooks/use-toast';
import { SessionRecord } from '@/types';

type SessionType = 'focus' | 'break' | 'longBreak';

interface Task {
  id: string;
  name: string;
}

const focusMinutes = 25;
const breakMinutes = 5;
const longBreakMinutes = 15;

export default function PomodoroTimer() {
  const [minutes, setMinutes] = useState(focusMinutes);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<SessionType>('focus');
  const [todaySessions, setTodaySessions] = useState<SessionRecord>({
    date: new Date().toISOString().split('T')[0],
    focus: 0,
    break: 0,
    longBreak: 0,
  });
  const [totalSessions, setTotalSessions] = useState<SessionRecord[]>([
    { date: '2024-11-01', focus: 5, break: 2, longBreak: 0 },
  ]);
  const [focusCount, setFocusCount] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          clearTimeInterval(interval);
          updateSessions(mode);
          setIsActive(false);
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
          } else if (mode === 'break') {
            setMode('focus');
            setMinutes(focusMinutes);
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
  }, [isActive, minutes, seconds, mode, focusCount]);

  const updateSessions = (session: SessionType) => {
    const today = new Date().toISOString().split('T')[0];
    setTodaySessions((prev) => ({ ...prev, date: today, [session]: prev[session] + 1 }));
    setTotalSessions((prev) => {
      const todayIndex = prev.findIndex((record) => record.date === today);
      if (todayIndex !== -1) {
        const updatedRecord = { ...prev[todayIndex], [session]: prev[todayIndex][session] + 1 };
        return [...prev.slice(0, todayIndex), updatedRecord, ...prev.slice(todayIndex + 1)];
      } else {
        return [...prev, { date: today, focus: 0, break: 0, longBreak: 0, [session]: 1 }];
      }
    });
  };

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

  const handleCreateTask = (taskName: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      name: taskName,
    };
    setTasks([...tasks, newTask]);
  };

  const handleSelectTask = (task: Task) => {
    if (isActive) {
      toast({
        title: 'Cannot change task',
        description: 'Please stop the timer before changing the task.',
        variant: 'destructive',
      });
      return;
    }

    if (currentTask) {
      toast({
        title: 'Timer Reset',
        description: 'The timer has been reset due to task change.',
      });
    }

    setCurrentTask(task);
    resetTimer();
  };

  const totalMinutes = mode === 'focus' ? focusMinutes : mode === 'longBreak' ? longBreakMinutes : breakMinutes;
  const activeMinutes = totalMinutes - minutes - 1;
  const activeSeconds = seconds === 0 ? 0 : 60 - seconds;

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
            onCreateTask={handleCreateTask}
            onSelectTask={handleSelectTask}
            isTimerActive={isActive}
          />
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
        <SessionHistory todaySessionRecord={todaySessions} totalSessionRecords={totalSessions} />
        <div className="flex space-x-4">
          <Button onClick={toggleTimer} variant="outline" size="icon">
            {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button onClick={resetTimer} variant="outline" size="icon">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function clearTimeInterval(interval: NodeJS.Timeout | null) {
  if (interval) {
    clearInterval(interval);
  }
}
