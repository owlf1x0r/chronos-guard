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
import { Task } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2 } from 'lucide-react';

interface TaskDialogProps {
  tasks: Task[];
  currentTask: Task | null;
  onCreateTask: (taskName: string) => void;
  onSelectTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
}

export function TaskDialog({ tasks, currentTask, onCreateTask, onSelectTask, onDeleteTask }: TaskDialogProps) {
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
        <Button variant="outline">{currentTask ? currentTask.name : 'Select Task'}</Button>
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
              <ScrollArea className="h-[140px] rounded-md border">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between">
                    <Button
                      variant={currentTask?.id === task.id ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => handleSelectTask(task)}
                    >
                      {task.name}
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => onDeleteTask(task.id)}
                      disabled={task.id === 0 || currentTask?.id === task.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </ScrollArea>
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
