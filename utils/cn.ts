// A simplified utility to merge class names, inspired by clsx.
export function cn(...inputs: (string | undefined | null | boolean)[]) {
    return inputs.filter(Boolean).join(' ');
}