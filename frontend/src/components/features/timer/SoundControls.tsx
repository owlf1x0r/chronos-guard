'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Volume2, VolumeX } from 'lucide-react';
import { DialogDescription } from '@radix-ui/react-dialog';

interface SoundControlsProps {
  onVolumeChange: (type: 'tick' | 'complete', volume: number) => void;
  onMuteChange: (type: 'tick' | 'complete', muted: boolean) => void;
}

export function SoundControls({ onVolumeChange, onMuteChange }: SoundControlsProps) {
  const [tickVolume, setTickVolume] = useState(50);
  const [completeVolume, setCompleteVolume] = useState(50);
  const [tickMuted, setTickMuted] = useState(false);
  const [completeMuted, setCompleteMuted] = useState(false);

  const handleVolumeChange = (type: 'tick' | 'complete', value: number[]) => {
    const volume = value[0];
    if (type === 'tick') {
      setTickVolume(volume);
    } else {
      setCompleteVolume(volume);
    }
    onVolumeChange(type, volume / 100);
  };

  const handleMuteChange = (type: 'tick' | 'complete') => {
    if (type === 'tick') {
      setTickMuted(!tickMuted);
      onMuteChange(type, !tickMuted);
    } else {
      setCompleteMuted(!completeMuted);
      onMuteChange(type, !completeMuted);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Volume2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sound Settings</DialogTitle>
          <DialogDescription>Adjust the volume and mute sounds.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Tick Sound</Label>
            <div className="flex items-center space-x-2">
              <Slider
                value={[tickVolume]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => handleVolumeChange('tick', value)}
                className="w-[200px]"
                aria-label="Adjust tick volume"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleMuteChange('tick')}
                aria-label={tickMuted ? 'Unmute tick sound' : 'Mute tick sound'}
              >
                {tickMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Complete Sound</Label>
            <div className="flex items-center space-x-2">
              <Slider
                value={[completeVolume]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => handleVolumeChange('complete', value)}
                className="w-[200px]"
                aria-label="Adjust complete sound volume"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleMuteChange('complete')}
                aria-label={completeMuted ? 'Unmute complete sound' : 'Mute complete sound'}
              >
                {completeMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
