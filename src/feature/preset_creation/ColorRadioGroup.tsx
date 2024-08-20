import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface ColorRadioGroupProps {
    selectedColor: string;
    onChange: (color: string) => void;
    disabled?: boolean;
}

const colors = [
    { value: '#e74c3c', label: '赤' },
    { value: '#f3a831', label: 'オレンジ' },
    { value: '#f9e246', label: '黄色' },
    { value: '#b5d65b', label: '黄緑' },
    { value: '#009e7b', label: '緑' },
    { value: '#47b0dc', label: '水色' },
    { value: '#3675bc', label: '青' },
    { value: '#ba75a7', label: '紫' },
];

const ColorRadioGroup: React.FC<ColorRadioGroupProps> = ({ selectedColor, onChange, disabled }) => {
    return (
        <RadioGroup
            value={selectedColor}
            onValueChange={onChange}
            className="grid grid-cols-4 gap-2"
            disabled={disabled}
        >
            {colors.map((color) => (
                <div key={color.value} className="flex items-center space-x-2">
                    <RadioGroupItem
                        value={color.value}
                        id={color.value}
                        className="sr-only"
                        disabled={disabled}
                    />
                    <Label
                        htmlFor={color.value}
                        className={`w-6 h-6 rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-110 ${disabled ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        style={{ backgroundColor: color.value }}
                    >
                        {selectedColor === color.value && (
                            <div className="w-3 h-3 bg-white rounded-full animate-scale-up" />
                        )}
                    </Label>
                </div>
            ))}
        </RadioGroup>
    );
};

export default ColorRadioGroup;