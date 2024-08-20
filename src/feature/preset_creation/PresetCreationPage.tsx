"use client"
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import PresetCard from './PresetCard';
import AddPresetDialog from './AddPresetDialog';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { Preset } from '@/types/preset';
import { fetchPresets, createPreset, deletePreset } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

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
    const router = useRouter();

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
        const preset = presets.find(p => p.id === id);
        if (preset && !preset.system && preset.title !== 'フリー' && preset.title !== '休み') {
            router.push(`/preset_creation/${id}`);
        }
    };

    const renderPresets = () => {
        const systemPresets = presets.filter(preset => preset.system || preset.title === 'フリー' || preset.title === '休み');
        const userPresets = presets.filter(preset => !preset.system && preset.title !== 'フリー' && preset.title !== '休み');

        return (
            <>
                {systemPresets.map((preset) => (
                    <PresetCard
                        key={preset.id}
                        preset={preset}
                        onClick={() => handlePresetClick(preset.id)}
                        onDelete={() => handleDeleteClick(preset.id)}
                    />
                ))}
                {userPresets.length > 0 && (
                    <>
                        <Separator className="mb-4" />
                        {userPresets.map((preset) => (
                            <PresetCard
                                key={preset.id}
                                preset={preset}
                                onClick={() => handlePresetClick(preset.id)}
                                onDelete={() => handleDeleteClick(preset.id)}
                            />
                        ))}
                    </>
                )}
            </>
        );
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
        const preset = presets.find(p => p.id === id);
        if (preset && !preset.system && preset.title !== 'フリー' && preset.title !== '休み') {
            setPresetToDelete(id);
            setIsDeleteDialogOpen(true);
        }
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
            <div className="flex flex-col mt-2 mb-16">
                {renderPresets()}
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