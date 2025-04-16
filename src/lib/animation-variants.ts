export const pageVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? "100%" : "-100%",
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
        transition: {
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.4 },
        },
    },
    exit: (direction: number) => ({
        x: direction > 0 ? "-100%" : "100%",
        opacity: 0,
        transition: {
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.4 },
        },
    }),
};

export const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: custom * 0.2,
            duration: 0.8,
            ease: [0.04, 0.62, 0.23, 0.98],
        },
    }),
};