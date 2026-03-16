export function getParsedImages(imagesString) {
    if (!imagesString) return [];
    try {
        const parsed = JSON.parse(imagesString);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        // Fallback for earlier records where images might just be a single URL string
        return typeof imagesString === 'string' ? [imagesString] : [];
    }
}

export function getSafeImageUrl(url) {
    if (!url) return '/placeholder-property.jpg'; // fallback image
    // Add default domain if missing (for legacy or direct paths)
    if (url.startsWith('/')) {
        return url; // Relative path, Next.js handles it locally
    }
    
    // Pass-through for cloud storage URLs (Supabase)
    if (url.startsWith('http')) {
        return url;
    }

    return url;
}
