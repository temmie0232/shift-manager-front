import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TimeSelectionDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (time: string) => void;
    type: 'start' | 'end';
}

const TimeSelectionDrawer: React.FC<TimeSelectionDrawerProps> = ({ isOpen, onClose, onSelect, type }) => {
    const generateTimeOptions = () => {
        const options = [];
        const start = type === 'start' ? 7 : 11;
        const end = type === 'start' ? 19 : 22;

        for (let hour = start; hour <= end; hour++) {
            options.push(`${hour.toString().padStart(2, '0')}:00`);
            if (type === 'start' && hour === 8) {
                options.push('08:30');
            }
        }
        return options;
    };

    return (
        <>
            <div className={`fixed inset-0 transition-all duration-300 ease-in-out ${isOpen ? 'scale-95 blur-sm' : 'pointer-events-none'}`} />
            <Drawer open={isOpen} onOpenChange={onClose}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>{type === 'start' ? '開始時間' : '終了時間'}を選択</DrawerTitle>
                    </DrawerHeader>
                    <ScrollArea className="h-[300px] p-4">
                        <div className="grid grid-cols-3 gap-2">
                            {generateTimeOptions().map((time) => (
                                <Button
                                    key={time}
                                    variant="outline"
                                    onClick={() => onSelect(time)}
                                >
                                    {time}
                                </Button>
                            ))}
                        </div>
                    </ScrollArea>
                    <DrawerFooter>
                        <Button variant="outline" onClick={onClose}>キャンセル</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default TimeSelectionDrawer;