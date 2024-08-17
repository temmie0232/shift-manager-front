import React from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";

// DeleteConfirmDialogコンポーネントのプロップスを定義
interface DeleteConfirmDialogProps {
    isOpen: boolean;  // ダイアログの開閉状態
    onOpenChange: (open: boolean) => void;  // ダイアログの開閉状態を変更する関数
    onConfirm: () => void;  // 削除確認時に呼び出される関数
}

// プリセット削除確認用のダイアログコンポーネント
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
            <DialogFooter>
                {/* キャンセルボタン */}
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                    キャンセル
                </Button>
                {/* 削除確認ボタン */}
                <Button variant="destructive" onClick={onConfirm}>
                    削除
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);

export default DeleteConfirmDialog;