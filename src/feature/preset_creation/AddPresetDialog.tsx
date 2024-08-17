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

// AddPresetDialogコンポーネントのプロップスを定義
interface AddPresetDialogProps {
    isOpen: boolean;  // ダイアログの開閉状態
    onOpenChange: (open: boolean) => void;  // ダイアログの開閉状態を変更する関数
    newPreset: Omit<Preset, 'id'>;  // 新しいプリセットの情報（idを除く）
    setNewPreset: React.Dispatch<React.SetStateAction<Omit<Preset, 'id'>>>;  // 新しいプリセット情報を更新する関数
    onAdd: () => void;  // プリセット追加時に呼び出される関数
}

// 新しいプリセットを追加するためのダイアログコンポーネント
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
                {/* シフト名入力フィールド */}
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
                {/* 表示色選択フィールド */}
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="color" className="text-right">
                        表示色
                    </Label>
                    <Input
                        id="color"
                        type="color"
                        value={newPreset.color}
                        onChange={(e) => setNewPreset({ ...newPreset, color: e.target.value })}
                        className="col-span-3"
                    />
                </div>
                {/* 開始時間入力フィールド */}
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
                {/* 終了時間入力フィールド */}
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
            {/* プリセット追加ボタン */}
            <Button onClick={onAdd}>追加</Button>
        </DialogContent>
    </Dialog>
);

export default AddPresetDialog;