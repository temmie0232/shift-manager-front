import React from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Preset } from '@/types/preset';

interface PresetCardProps {
    preset: Preset;
    onClick: () => void;
    onDelete: () => void;
}

const PresetCard: React.FC<PresetCardProps> = ({ preset, onClick, onDelete }) => (
    <Card
        className="relative mb-4 transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-95 cursor-pointer"
        onClick={onClick}
    >
        <CardContent className="p-4">
            <div className="flex items-center mb-2">
                <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: preset.color }}></div>
                <h3 className="font-semibold flex-grow">{preset.title}</h3>
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 transition-transform duration-300 ease-in-out hover:scale-110 active:scale-90"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                >
                    <X size={18} />
                </Button>
            </div>
            <p className="text-sm text-gray-600">
                {`${preset.startTime || '未設定'} ~ ${preset.endTime || '未設定'}`}
            </p>
        </CardContent>
    </Card>
);

export default PresetCard;