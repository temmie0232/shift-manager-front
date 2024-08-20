import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Preset } from '@/types/preset';

interface PresetListProps {
    presets: Preset[];
    selectedPreset: Preset | null;
    onPresetClick: (preset: Preset) => void;
}

const PresetList: React.FC<PresetListProps> = ({ presets, selectedPreset, onPresetClick }) => (
    <ScrollArea className="h-60 rounded-md border p-2">
        <div className="flex flex-col items-center space-y-4">
            {presets.map((preset) => (
                <div key={preset.id} className="relative w-4/5">
                    <div
                        className={`absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-black transition-opacity duration-300 flex items-center justify-center ${selectedPreset?.id === preset.id ? 'opacity-100' : 'opacity-0'
                            }`}
                        style={{ left: '-24px' }}
                    >
                        <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <Button
                        onClick={() => onPresetClick(preset)}
                        className="w-full justify-center transition-all duration-200 ease-in-out hover:scale-[1.02] overflow-hidden"
                        style={{
                            backgroundColor: 'white',
                            color: 'black',
                            border: `4px solid ${preset.color}`
                        }}
                    >
                        <span className="mr-3 truncate">{preset.title}</span>
                        <span>[ {preset.startTime} - {preset.endTime} ]</span>
                    </Button>
                </div>
            ))}
        </div>
    </ScrollArea>
);

export default PresetList;