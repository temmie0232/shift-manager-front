"use client"
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import PresetCard from './PresetCard';
import AddPresetDialog from './AddPresetDialog';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { Preset } from '@/types/preset';
import { fetchPresets, createPreset, deletePreset } from '@/lib/api';

const PresetCreationPage = () => {
    const [presets, setPresets] = useState<Preset[]>([]);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [presetToDelete, setPresetToDelete] = useState<string | null>(null);
    const [newPreset, setNewPreset] = useState<Omit<Preset, 'id'>>({
        title: '',
        color: '#e74c3c',
        startTime: '07:00',
        endTime: '11:00',
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPresets = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const fetchedPresets = await fetchPresets();
                setPresets(fetchedPresets);
            } catch (error) {
                console.error('Failed to load presets:', error);
                setError('プリセットの読み込みに失敗しました。もう一度お試しください。');
            } finally {
                setIsLoading(false);
            }
        };
        loadPresets();
    }, []);

    const handlePresetClick = (id: string) => {
        console.log(`Navigating to preset ${id} details`);
    };

    const handleAddPreset = async () => {
        try {
            const createdPreset = await createPreset(newPreset);
            setPresets([...presets, createdPreset]);
            setIsAddDialogOpen(false);
            setNewPreset({ title: '', color: '#000000', startTime: '', endTime: '' });
        } catch (error) {
            console.error('Failed to add preset:', error);
            setError('プリセットの追加に失敗しました。もう一度お試しください。');
        }
    };

    const handleDeleteClick = (id: string) => {
        setPresetToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (presetToDelete) {
            try {
                await deletePreset(presetToDelete);
                setPresets(presets.filter(preset => preset.id !== presetToDelete));
                setIsDeleteDialogOpen(false);
                setPresetToDelete(null);
            } catch (error) {
                console.error('Failed to delete preset:', error);
                setError('プリセットの削除に失敗しました。もう一度お試しください。');
            }
        }
    };

    if (isLoading) {
        return <div className="p-4">読み込み中...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">プリセット作成</h1>
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
            <Button
                className="fixed bottom-20 right-4 rounded-full w-14 h-14"
                onClick={() => setIsAddDialogOpen(true)}
            >
                <Plus size={24} />
            </Button>
            <AddPresetDialog
                isOpen={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                newPreset={newPreset}
                setNewPreset={setNewPreset}
                onAdd={handleAddPreset}
            />
            <DeleteConfirmDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
};

export default PresetCreationPage;