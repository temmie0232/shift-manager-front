"use client"
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import PresetCard from './PresetCard';
import AddPresetDialog from './AddPresetDialog';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { Preset } from '@/types/preset';

const PresetCreationPage = () => {
    // プリセットの状態を管理
    const [presets, setPresets] = useState<Preset[]>([
        { id: '1', title: '早番', color: '#FF5733', startTime: '07:00', endTime: '16:00' },
        { id: '2', title: '遅番', color: '#33FF57', startTime: '13:00', endTime: '22:00' },
        { id: '3', title: '休み', color: '#3357FF', startTime: '00:00', endTime: '00:00' },
    ]);

    // 各ダイアログの開閉状態を管理
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // 削除対象のプリセットIDを管理
    const [presetToDelete, setPresetToDelete] = useState<string | null>(null);

    // 新しいプリセットの情報を管理
    const [newPreset, setNewPreset] = useState<Omit<Preset, 'id'>>({
        title: '',
        color: '#000000',
        startTime: '',
        endTime: '',
    });

    // プリセットカードがクリックされたときの処理
    const handlePresetClick = (id: string) => {
        console.log(`Navigating to preset ${id} details`);
    };

    // 新しいプリセットを追加する処理
    const handleAddPreset = () => {
        setPresets([...presets, { ...newPreset, id: Date.now().toString() }]);
        setIsAddDialogOpen(false);
        setNewPreset({ title: '', color: '#000000', startTime: '', endTime: '' });
    };

    // 削除ボタンがクリックされたときの処理
    const handleDeleteClick = (id: string) => {
        setPresetToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    // 削除が確認されたときの処理
    const handleDeleteConfirm = () => {
        if (presetToDelete) {
            setPresets(presets.filter(preset => preset.id !== presetToDelete));
            setIsDeleteDialogOpen(false);
            setPresetToDelete(null);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">プリセット作成</h1>
            {/* プリセットカードのリスト */}
            <div className="flex flex-col mb-16">
                {presets.map((preset) => (
                    <PresetCard
                        key={preset.id}
                        preset={preset}
                        onClick={() => handlePresetClick(preset.id)}
                        onDelete={() => handleDeleteClick(preset.id)}
                    />
                ))}
            </div>
            {/* 新しいプリセットを追加するボタン */}
            <Button
                className="fixed bottom-20 right-4 rounded-full w-14 h-14"
                onClick={() => setIsAddDialogOpen(true)}
            >
                <Plus size={24} />
            </Button>
            {/* プリセット追加ダイアログ */}
            <AddPresetDialog
                isOpen={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                newPreset={newPreset}
                setNewPreset={setNewPreset}
                onAdd={handleAddPreset}
            />
            {/* プリセット削除確認ダイアログ */}
            <DeleteConfirmDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
};

export default PresetCreationPage;