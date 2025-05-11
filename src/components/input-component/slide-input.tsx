import React from "react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Control, FieldValues, Path } from "react-hook-form"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface Mark {
    value: number
    label: string
}

interface CustomFormSliderProps<T extends FieldValues> {
    name: Path<T>
    control: Control<T>
    labelText: string
    min: number
    max: number
    step?: number
    marks?: Mark[]
    disabled?: boolean
}

export function CustomFormSlider<T extends FieldValues>({
                                                            name,
                                                            control,
                                                            labelText,
                                                            min,
                                                            max,
                                                            step = 1,
                                                            marks = [],
                                                            disabled = false,
                                                        }: CustomFormSliderProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="space-y-4">
                    <FormLabel className="text-zinc-300">{labelText}</FormLabel>
                    <FormControl>
                        <div className="space-y-6">
                            <Slider
                                defaultValue={[field.value]}
                                min={min}
                                max={max}
                                step={step}
                                onValueChange={(values) => field.onChange(values[0])}
                                disabled={disabled}
                                className={cn(disabled ? "opacity-70" : "")}
                            />

                            {marks && marks.length > 0 && (
                                <div className="flex justify-between px-2 pt-1">
                                    {marks.map((mark) => (
                                        <div
                                            key={mark.value}
                                            className="flex flex-col items-center"
                                            style={{
                                                position: "absolute",
                                                left: `${((mark.value - min) / (max - min)) * 100}%`,
                                                transform: "translateX(-50%)",
                                            }}
                                        >
                                            <span className="text-xs text-zinc-400 mt-2">{mark.label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="text-center font-medium text-zinc-300">
                                {marks.find((mark) => mark.value === field.value)?.label || field.value}
                            </div>
                        </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                </FormItem>
            )}
        />
    )
}
