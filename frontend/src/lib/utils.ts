import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getErrorMessage(error: any): string {
    const detail = error.response?.data?.detail
    if (typeof detail === "string") return detail
    if (Array.isArray(detail) && detail.length > 0) {
        // Pydantic validation error or similar list
        return detail[0].msg || JSON.stringify(detail[0])
    }
    if (typeof detail === "object" && detail !== null) {
        return detail.message || JSON.stringify(detail)
    }
    return error.message || "An unexpected error occurred"
}
