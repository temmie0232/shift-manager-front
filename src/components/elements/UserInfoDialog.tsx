import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

interface UserInfoDialogProps {
    isOpen: boolean;
    onClose: (data: UserInfo | null) => void;
    initialData?: { hourlyWage: number; skills: string[] };
    dialogType: 'wage' | 'skills';
}

interface UserInfo {
    hourlyWage: number;
    skills: string[];
}

const SKILLS = [
    { id: 'open', label: 'オープン作業(07:00～)', group: 'opening_closing' },
    {
        id: 'close', label: 'クローズ作業(21:00～)', group: 'opening_closing', children: [
            { id: 'cashier_close', label: 'レジ締め' },
            { id: 'cleaning', label: '洗浄' },
            { id: 'floor_cleaning', label: 'フロア清掃' },
        ]
    },
    { id: 'defrost_order', label: '解凍・発注', group: 'inventory' },
    { id: 'cashier', label: 'キャッシャー', group: 'operations' },
    { id: 'washing', label: '洗浄', group: 'operations' },
    { id: 'drinks', label: 'ドリンク', group: 'operations' },
    { id: 'food', label: 'フード', group: 'operations' },
];

const UserInfoDialog: React.FC<UserInfoDialogProps> = ({ isOpen, onClose, initialData, dialogType }) => {
    const [hourlyWage, setHourlyWage] = useState<string>(initialData?.hourlyWage.toString() || '');
    const [skills, setSkills] = useState<string[]>(initialData?.skills || SKILLS.flatMap(skill =>
        skill.children ? [skill.id, ...skill.children.map(child => child.id)] : [skill.id]
    ));
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = () => {
        if (dialogType === 'wage') {
            if (!hourlyWage || isNaN(parseFloat(hourlyWage))) {
                setError('時給を正しく入力してください。');
                return;
            }
            onClose({
                hourlyWage: parseFloat(hourlyWage),
                skills: initialData?.skills || [],
            });
        } else {
            onClose({
                hourlyWage: initialData?.hourlyWage || 0,
                skills,
            });
        }
    };

    const handleSkillChange = (skillId: string, checked: boolean) => {
        if (checked) {
            setSkills(prev => [...prev, skillId]);
        } else {
            setSkills(prev => prev.filter(id => id !== skillId));
        }
    };

    const renderSkillGroup = (group: string, title: string) => (
        <div key={group}>
            <h3 className="font-semibold mt-4 mb-2">{title}</h3>
            {SKILLS.filter(skill => skill.group === group).map(skill => (
                <div key={skill.id}>
                    <div className="flex items-center space-x-2 mb-1">
                        <Checkbox
                            id={skill.id}
                            checked={skills.includes(skill.id)}
                            onCheckedChange={(checked) => handleSkillChange(skill.id, checked as boolean)}
                        />
                        <Label htmlFor={skill.id}>{skill.label}</Label>
                    </div>
                    {skill.children && skills.includes(skill.id) && (
                        <div className="ml-6 space-y-1">
                            {skill.children.map(child => (
                                <div key={child.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={child.id}
                                        checked={skills.includes(child.id)}
                                        onCheckedChange={(checked) => handleSkillChange(child.id, checked as boolean)}
                                    />
                                    <Label htmlFor={child.id}>{child.label}</Label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <Dialog open={isOpen} onOpenChange={() => onClose(null)}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{dialogType === 'wage' ? '時給の更新' : 'スキルの更新'}</DialogTitle>
                    <DialogDescription>
                        {dialogType === 'wage'
                            ? 'あなたの新しい時給を入力してください。'
                            : 'あなたができる仕事内容を選択してください。'}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {dialogType === 'wage' ? (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="hourly-wage" className="text-right">
                                時給
                            </Label>
                            <div className="col-span-3 flex items-center">
                                <Input
                                    id="hourly-wage"
                                    type="number"
                                    value={hourlyWage}
                                    onChange={(e) => {
                                        setHourlyWage(e.target.value);
                                        setError(null);
                                    }}
                                    className="flex-grow"
                                />
                                <span className="ml-2">円</span>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <Label className="text-lg font-semibold">できる仕事内容</Label>
                            <p className="text-sm text-gray-500">
                                以下の項目から<br />
                                あなたができる仕事にチェックを付けてください。<br />
                                できない仕事は、チェックを外してください。 <br />
                                !! シフトの生成に影響します !!
                            </p>
                            {renderSkillGroup('opening_closing', 'オープン・クローズ作業')}
                            {renderSkillGroup('inventory', '在庫管理')}
                            {renderSkillGroup('operations', '店内オペレーション')}
                        </div>
                    )}
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit}>保存</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UserInfoDialog;