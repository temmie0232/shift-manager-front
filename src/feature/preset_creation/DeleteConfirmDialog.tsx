import React from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

interface DeleteConfirmDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
    isOpen,
    onOpenChange,
    onConfirm,
}) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>プリセットの削除</DialogTitle>
            </DialogHeader>
            <DialogDescription>
                このプリセットを削除してもよろしいですか？この操作は取り消せません。
            </DialogDescription>
            <DialogFooter className="sm:justify-start">
                <div className="w-full flex justify-between gap-4">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="flex-1"
                    >
                        キャンセル
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        className="flex-1"
                    >
                        削除
                    </Button>
                </div>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);

export default DeleteConfirmDialog;