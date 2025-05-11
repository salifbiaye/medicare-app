// file-upload-input.tsx
"use client"

import React, { useRef} from "react"
import { Control, FieldValues, Path, useController } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Upload, X } from "lucide-react"
import { useDropzone } from "react-dropzone"

const mainVariant = {
    initial: {
        x: 0,
        y: 0,
    },
    animate: {
        x: 20,
        y: -20,
        opacity: 0.9,
    },
}

const secondaryVariant = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
    },
}

interface CustomFormFileUploadProps<T extends FieldValues> {
    name: Path<T>
    control: Control<T>
    labelText: string
    accept?: string
    multiple?: boolean
    maxSize?: number
    maxFiles?: number
    disabled?: boolean
}

export function CustomFormFileUpload<T extends FieldValues>({
                                                                name,
                                                                control,
                                                                labelText,
                                                                accept,
                                                                multiple = false,
                                                                maxSize = 10 * 1024 * 1024, // 10MB default
                                                                maxFiles = 5,
                                                                disabled = false,
                                                            }: CustomFormFileUploadProps<T>) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const {
        field,
        fieldState: { error }
    } = useController({
        name,
        control,
    })

    const files = multiple
        ? (Array.isArray(field.value) ? field.value : field.value ? [field.value] : [])
        : (field.value ? [field.value] : [])

    const handleFileChange = (newFiles: File[]) => {
        if (!newFiles.length) return;

        if (multiple) {
            // For multiple files, maintain an array
            const updatedFiles = [...files, ...newFiles].slice(0, maxFiles);
            field.onChange(updatedFiles);
        } else {
            // For single file, just use the first file directly
            field.onChange(newFiles[0]);
        }
    }

    const removeFile = (indexToRemove: number) => {
        if (multiple) {
            const updatedFiles = files.filter((_, index) => index !== indexToRemove);
            field.onChange(updatedFiles.length > 0 ? updatedFiles : []);
        } else {
            field.onChange(null);
        }
    }

    const handleClick = () => {
        if (!disabled) {
            fileInputRef.current?.click();
        }
    }

    const { getRootProps, isDragActive } = useDropzone({
        multiple,
        noClick: true,
        disabled,
        maxSize,
        accept: accept ? { [accept]: [] } : undefined,
        onDrop: (acceptedFiles) => {
            // Make sure we're keeping the File objects
            handleFileChange(acceptedFiles);
        },
      
    })

    return (
        <FormField
            control={control}
            name={name}
            render={() => (
                <FormItem className={" w-full"}>
                    <FormLabel className="text-zinc-300 mb-2 ">{labelText}</FormLabel>
                    <FormControl>
                        <div className="w-full" {...getRootProps()}>
                            <motion.div
                                onClick={handleClick}
                                whileHover={disabled ? undefined : "animate"}
                                className={cn(
                                    "p-6 group/file block rounded-lg w-full relative overflow-hidden border border-dashed",
                                    disabled
                                        ? "cursor-not-allowed opacity-60 border-zinc-700 bg-zinc-900"
                                        : "cursor-pointer border-zinc-700 bg-zinc-900 hover:border-zinc-600",
                                    isDragActive && !disabled ? "border-blue-500 bg-blue-950/20" : ""
                                )}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept={accept}
                                    multiple={multiple}
                                    disabled={disabled}
                                    onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
                                    className="hidden"
                                />
                                <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
                                    <GridPattern />
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                    <p className="relative z-20 font-sans font-bold text-zinc-300 text-base">
                                        {multiple ? "Upload files" : "Upload file"}
                                    </p>
                                    <p className="relative z-20 font-sans font-normal text-zinc-500 text-sm mt-2">
                                        {isDragActive
                                            ? "Drop to upload"
                                            : `Drag or drop ${multiple ? "files" : "a file"} here or click to upload`}
                                    </p>

                                    <div className="relative w-full mt-6 max-w-xl mx-auto">
                                        {files.length > 0 ? (
                                            <div className="space-y-3">
                                                {files.map((file: File, idx: number) => (
                                                    <motion.div
                                                        key={`file-${idx}`}
                                                        layoutId={idx === 0 ? "file-upload" : `file-upload-${idx}`}
                                                        className={cn(
                                                            "relative overflow-hidden z-40 bg-zinc-950 flex flex-col items-start justify-start p-3 w-full mx-auto rounded-md",
                                                            "border border-zinc-800"
                                                        )}
                                                    >
                                                        <div className="flex justify-between w-full items-center gap-4">
                                                            <motion.p
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                layout
                                                                className="text-sm text-zinc-300 truncate max-w-xs"
                                                            >
                                                                {file.name}
                                                            </motion.p>
                                                            <div className="flex items-center gap-2">
                                                                <motion.span
                                                                    initial={{ opacity: 0 }}
                                                                    animate={{ opacity: 1 }}
                                                                    layout
                                                                    className="rounded-lg px-2 py-1 w-fit shrink-0 text-xs text-zinc-400 bg-zinc-900"
                                                                >
                                                                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                                                                </motion.span>

                                                                {!disabled && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation()
                                                                            removeFile(idx)
                                                                        }}
                                                                        className="text-zinc-500 hover:text-zinc-300 transition-colors"
                                                                    >
                                                                        <X size={16} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex text-xs md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-zinc-500">
                                                            <motion.span
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                layout
                                                                className="px-1 py-0.5 rounded-md bg-zinc-900"
                                                            >
                                                                {file.type || "unknown type"}
                                                            </motion.span>

                                                            <motion.span
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                layout
                                                            >
                                                                modified {new Date(file.lastModified).toLocaleDateString()}
                                                            </motion.span>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        ) : (
                                            <>
                                                <motion.div
                                                    layoutId="file-upload"
                                                    variants={mainVariant}
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 300,
                                                        damping: 20,
                                                    }}
                                                    className={cn(
                                                        "relative group-hover/file:shadow-2xl z-40 bg-zinc-950 flex items-center justify-center h-24 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                                                        "border border-zinc-800"
                                                    )}
                                                >
                                                    {isDragActive ? (
                                                        <motion.p
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            className="text-zinc-400 flex flex-col items-center"
                                                        >
                                                            Drop it
                                                            <Upload className="h-4 w-4 text-zinc-400 mt-1" />
                                                        </motion.p>
                                                    ) : (
                                                        <Upload className="h-4 w-4 text-zinc-400" />
                                                    )}
                                                </motion.div>

                                                <motion.div
                                                    variants={secondaryVariant}
                                                    className="absolute opacity-0 border border-dashed border-blue-500 inset-0 z-30 bg-transparent flex items-center justify-center h-24 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </FormControl>
                    {error && <FormMessage className="text-red-500">{error.message}</FormMessage>}
                    {multiple && (
                        <p className="text-xs text-zinc-500 mt-1">
                            {`You can upload up to ${maxFiles} file${maxFiles > 1 ? 's' : ''}`}
                            {maxSize && ` (max ${(maxSize / (1024 * 1024)).toFixed(0)}MB each)`}
                        </p>
                    )}
                </FormItem>
            )}
        />
    )
}

function GridPattern() {
    const columns = 41
    const rows = 11
    return (
        <div className="flex bg-zinc-950  shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px scale-105">
            {Array.from({ length: rows }).map((_, row) =>
                Array.from({ length: columns }).map((_, col) => {
                    const index = row * columns + col
                    return (
                        <div
                            key={`${col}-${row}`}
                            className={`w-10 h-10 flex shrink-0 rounded-[2px] ${
                                index % 2 === 0
                                    ? "bg-zinc-900"
                                    : "bg-zinc-900 shadow-[0px_0px_1px_3px_rgba(20,20,20,1)_inset]"
                            }`}
                        />
                    )
                })
            )}
        </div>
    )
}