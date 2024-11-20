import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChartNoAxesColumn } from 'lucide-react';
import { SessionRecord } from '@/types';
import { SessionCount } from '@/components/features/timer/SessionCount';

interface SessionHistoryDialogProps {
  sessionHistory: SessionRecord[];
}

export function SessionHistoryDialog({ sessionHistory }: SessionHistoryDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <ChartNoAxesColumn className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Session History</DialogTitle>
          <DialogDescription>View your daily session history.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[300px] w-full pr-4">
          {sessionHistory.map((daily, index) => (
            <div key={index} className="mb-4">
              <SessionCount sessionRecord={daily} label={daily.date} textSize="text-base" />
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
