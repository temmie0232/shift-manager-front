import React from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Preset } from '@/types/preset';

// PresetCardコンポーネントのプロップスを定義
interface PresetCardProps {
    preset: Preset;  // プリセットの情報
    onClick: () => void;  // カードクリック時に呼び出される関数
    onDelete: () => void;  // 削除ボタンクリック時に呼び出される関数
}

// 個々のプリセットを表示するカードコンポーネント
const PresetCard: React.FC<PresetCardProps> = ({ preset, onClick, onDelete }) => (
    <Card className="relative mb-4" onClick={onClick}>
        <CardContent className="p-4">
            <div className="flex items-center mb-2">
                {/* プリセットの色を表示 */}
                <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: preset.color }}></div>
                {/* プリセットのタイトルを表示 */}
                <h3 className="font-semibold flex-grow">{preset.title}</h3>
                {/* 削除ボタン */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={(e) => {
                        e.stopPropagation();  // カードのクリックイベントが発火するのを防ぐ
                        onDelete();
                    }}
                >
                    <X size={18} />
                </Button>
            </div>
            {/* プリセットの時間範囲を表示 */}
            <p className="text-sm text-gray-600">{`${preset.startTime} ~ ${preset.endTime}`}</p>
        </CardContent>
    </Card>
);

export default PresetCard;