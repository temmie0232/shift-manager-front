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
        color: '#000000',
        startTime: '',
        endTime: '',
    });

    useEffect(() => {
        const loadPresets = async () => {
            try {
                const fetchedPresets = await fetchPresets();
                setPresets(fetchedPresets);
            } catch (error) {
                console.error('Failed to load presets:', error);
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
            }
        }
    };

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