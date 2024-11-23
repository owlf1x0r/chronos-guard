'use client';

import React, { useEffect, useState } from 'react';
import PomodoroTimer from '@/components/features/timer/PomodoroTimer';
import { SessionRecord, UpdateSessionRecordParam, Task } from '@/types';
import {
  getCurrentTask,
  getDefaultTask,
  getSessionRecords,
  getTasks,
  saveCurrentTask,
  saveSessionRecords,
  saveTasks,
} from '@/utils/timer';

const initialTask: Task = { id: 0, name: 'Not selected' };

export default function Home() {
  const [sessionRecords, setSessionRecords] = useState<SessionRecord[]>([]);
  const [tasks, setTasks] = useState<Task[]>([initialTask]);
  const [currentTask, setCurrentTask] = useState<Task>(getDefaultTask());

  useEffect(() => {
    const sessionRecordsFromDB: SessionRecord[] = getSessionRecords();
    setSessionRecords(sessionRecordsFromDB);

    const tasksFromDB: Task[] = getTasks();
    if (!tasksFromDB.some((task) => task.id === 0)) {
      setTasks([initialTask, ...tasksFromDB]);
    } else {
      setTasks(tasksFromDB);
    }

    const currentTaskFromDB: Task = getCurrentTask();
    setCurrentTask(currentTaskFromDB);
  }, []);

  useEffect(() => {
    saveSessionRecords(sessionRecords);
  }, [sessionRecords]);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    saveCurrentTask(currentTask);
  }, [currentTask]);

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

  const createTask = (taskName: string) => {
    const lastTaskId = tasks.length > 0 ? tasks[tasks.length - 1].id : 0;
    const newTask: Task = {
      id: lastTaskId + 1,
      name: taskName,
    };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (taskId: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary">
      <PomodoroTimer
        sessionRecords={sessionRecords}
        updateSessionRecord={updateSessionRecord}
        tasks={tasks}
        onCreateTask={createTask}
        onDeleteTask={deleteTask}
        currentTask={currentTask}
        onSelectTask={setCurrentTask}
      />
    </div>
  );
}
