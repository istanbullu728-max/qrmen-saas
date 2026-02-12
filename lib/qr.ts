/**
 * QR Code Utility
 * Handles QR URL generation for table-specific and business-wide menus.
 */

export const generateTableQrUrl = (businessSlug: string, tableId: string) => {
    // Base URL should ideally come from env
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return `${baseUrl}/${businessSlug}?table=${tableId}`;
};

export const generateMenuQrUrl = (businessSlug: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return `${baseUrl}/${businessSlug}`;
};
