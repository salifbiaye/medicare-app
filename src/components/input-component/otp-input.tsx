// custom-form-otp.tsx
"use client"

import { Control, FieldValues, Path } from 'react-hook-form'
import { OTPInput } from 'input-otp'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

type CustomOtpInputProps<T extends FieldValues> = {
    name: Path<T>
    control: Control<T>
    labelText?: string
    length?: number
    className?: string
    containerClassName?: string
}

export function CustomFormOtp<T extends FieldValues>({
                                                         name,
                                                         control,
                                                         labelText = "Code de vérification",
                                                         length = 6,
                                                         className,
                                                         containerClassName
                                                     }: CustomOtpInputProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={cn("space-y-4", className)}>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <FormLabel className="block text-center text-lg font-medium ">
                            {labelText}
                        </FormLabel>
                    </motion.div>

                    <FormControl>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                        >
                            <OTPInput
                                maxLength={length}
                                value={field.value || ''}
                                onChange={(value) => field.onChange(value)}
                                onComplete={() => field.onBlur()}
                                containerClassName={cn(
                                    'flex items-center justify-center gap-3',
                                    containerClassName
                                )}
                                className="w-full"
                                render={({ slots }) => (
                                    <div className="flex items-center gap-3">
                                        {slots.map((slot, index) => (
                                            <OtpSlot
                                                key={index}
                                                char={slot.char}
                                                hasFakeCaret={slot.hasFakeCaret}
                                                isActive={slot.isActive}
                                            />
                                        ))}
                                    </div>
                                )}
                            />
                        </motion.div>
                    </FormControl>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <FormMessage className="text-center" />
                    </motion.div>
                </FormItem>
            )}
        />
    )
}

function OtpSlot({ char, hasFakeCaret, isActive }: {
    char: string | null
    hasFakeCaret: boolean
    isActive: boolean
}) {
    return (
        <motion.div
            className={cn(
                'relative flex h-14 w-14 items-center justify-center',
                'border-2 ',
                'rounded-xl transition-all duration-200',
                '',
                isActive && 'border-primary ring-2'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <motion.span
                className="text-xl font-semibold"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500 }}
            >
                {char}
            </motion.span>

            {hasFakeCaret && (
                <motion.div
                    className="pointer-events-none absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="h-7 w-0.5 animate-caret-blink bg-white duration-1000" />
                </motion.div>
            )}
        </motion.div>
    )
}