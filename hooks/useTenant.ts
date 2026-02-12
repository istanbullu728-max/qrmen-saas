'use client';

import { useParams } from 'next/navigation';

/**
 * useTenant Hook
 * Provides tenant (business) context from the URL slug.
 * Essential for multi-tenant (SaaS) architecture.
 */
export const useTenant = () => {
    const params = useParams();
    const slug = params.slug as string;

    return {
        slug,
        isLoaded: !!slug,
    };
};
