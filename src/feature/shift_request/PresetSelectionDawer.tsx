import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Preset } from '@/types/preset';

interface PresetSelectionDrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    presets: Preset[];
    selectedPreset: Preset | null;
    onPresetClick: (preset: Preset) => void;
}

const PresetSelectionDrawer: React.FC<PresetSelectionDrawerProps> = ({
    isOpen,
    onOpenChange,
    presets,
    selectedPreset,
    onPresetClick,
}) => (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
            <DrawerHeader>
                <DrawerTitle>プリセット選択</DrawerTitle>
            </DrawerHeader>
            <ScrollArea className="h-[50vh] px-4">
                <div className="space-y-2">
                    {presets.map((preset) => {
                        const isFree = preset.title === 'フリー';
                        const isSelected = selectedPreset?.id === preset.id;
                        return (
                            <Button
                                key={preset.id}
                                onClick={() => onPresetClick(preset)}
                                className="w-full justify-between"
                                variant={isSelected ? "default" : "outline"}
                                style={{
                                    borderColor: isFree ? 'black' : preset.color,
                                    backgroundColor: isSelected
                                        ? (isFree ? 'black' : preset.color)
                                        : 'transparent',
                                    color: isSelected
                                        ? 'white'
                                        : 'black',
                                }}
                            >
                                <span>{preset.title}</span>
                                <span>{preset.startTime} - {preset.endTime}</span>
                            </Button>
                        );
                    })}
                </div>
            </ScrollArea>
            <DrawerFooter>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                    閉じる
                </Button>
            </DrawerFooter>
        </DrawerContent>
    </Drawer>
);

export default PresetSelectionDrawer;