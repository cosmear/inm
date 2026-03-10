'use client';

import dynamic from 'next/dynamic';

const PropertyMap = dynamic(() => import('@/components/PropertyMap'), {
    ssr: false,
    loading: () => (
        <div className="h-64 sm:h-80 w-full bg-stone-100 rounded-2xl flex items-center justify-center border border-stone-dark/10 shadow-inner z-0 relative">
            <span className="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span>
        </div>
    )
});

export default function PropertyMapWrapper(props) {
    return <PropertyMap {...props} />;
}
