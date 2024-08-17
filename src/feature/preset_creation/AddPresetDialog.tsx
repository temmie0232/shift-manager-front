import React from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Preset } from '@/types/preset';
import ColorRadioGroup from './ColorRadioGroup';

interface AddPresetDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    newPreset: Omit<Preset, 'id'>;
    setNewPreset: React.Dispatch<React.SetStateAction<Omit<Preset, 'id'>>>;
    onAdd: () => void;
}

const AddPresetDialog: React.FC<AddPresetDialogProps> = ({
    isOpen,
    onOpenChange,
    newPreset,
    setNewPreset,
    onAdd,
}) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>新しいプリセットを追加</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                        シフト名
                    </Label>
                    <Input
                        id="title"
                        value={newPreset.title}
                        onChange={(e) => setNewPreset({ ...newPreset, title: e.target.value })}
                        className="col-span-3"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">表示色</Label>
                    <div className="col-span-3">
                        <ColorRadioGroup
                            selectedColor={newPreset.color}
                            onChange={(color) => setNewPreset({ ...newPreset, color })}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startTime" className="text-right">
                        開始時間
                    </Label>
                    <Input
                        id="startTime"
                        type="time"
                        value={newPreset.startTime}
                        onChange={(e) => setNewPreset({ ...newPreset, startTime: e.target.value })}
                        className="col-span-3"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="endTime" className="text-right">
                        終了時間
                    </Label>
                    <Input
                        id="endTime"
                        type="time"
                        value={newPreset.endTime}
                        onChange={(e) => setNewPreset({ ...newPreset, endTime: e.target.value })}
                        className="col-span-3"
                    />
                </div>
            </div>
            <Button onClick={onAdd}>追加</Button>
        </DialogContent>
    </Dialog>
);

export default AddPresetDialog;