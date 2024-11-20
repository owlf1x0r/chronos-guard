'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Task {
  id: string;
  name: string;
}

interface TaskDialogProps {
  tasks: Task[];
  currentTask: Task | null;
  onCreateTask: (taskName: string) => void;
  onSelectTask: (task: Task) => void;
  isTimerActive: boolean;
}

export function TaskDialog({ tasks, currentTask, onCreateTask, onSelectTask, isTimerActive }: TaskDialogProps) {
  const [newTaskName, setNewTaskName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleCreateTask = () => {
    if (newTaskName.trim()) {
      onCreateTask(newTaskName.trim());
      setNewTaskName('');
    }
  };

  const handleSelectTask = (task: Task) => {
    onSelectTask(task);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={isTimerActive}>
          {currentTask ? currentTask.name : 'Select Task'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Tasks</DialogTitle>
          <DialogDescription>Create a new task or select an existing one.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="task-name" className="text-right">
              New Task
            </Label>
            <Input
              id="task-name"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <Button onClick={handleCreateTask} className="ml-auto">
            Create Task
          </Button>
          <div className="mt-4">
            <Label className="text-lg font-semibold">Existing Tasks</Label>
            <div className="mt-2 space-y-2">
              {tasks.map((task) => (
                <Button
                  key={task.id}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleSelectTask(task)}
                >
                  {task.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
