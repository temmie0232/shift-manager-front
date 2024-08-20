import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmationDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    content: {
        title: string;
        description: string;
        action: () => void;
    };
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    isOpen,
    onOpenChange,
    content,
}) => (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{content.title}</AlertDialogTitle>
                <AlertDialogDescription>
                    {content.description}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                <AlertDialogAction
                    onClick={() => {
                        content.action();
                        onOpenChange(false);
                    }}
                >
                    確認
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
);

export default ConfirmationDialog;