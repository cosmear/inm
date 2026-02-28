import React from 'react';

const PropertyCard = ({ prop }) => {
    return (
        <article className="group cursor-pointer flex flex-col h-full bg-white/40 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/20 transition-all duration-500 hover:shadow-glass hover:-translate-y-1">
            <div className="relative overflow-hidden aspect-[4/3]">
                <img
                    src={prop.image_url}
                    alt={prop.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">
                    {prop.operation || 'Comprar'}
                </div>
                {prop.featured && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary shadow-lg">
                        Exclusivo
                    </div>
                )}
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif text-2xl text-stone-dark group-hover:text-primary transition-colors leading-tight">
                        {prop.title}
                    </h3>
                </div>

                <p className="text-stone-light font-medium text-sm flex items-center gap-1 mb-4">
                    <span className="material-symbols-outlined text-sm text-primary">location_on</span>
                    {prop.location}
                </p>

                <div className="flex items-center gap-4 pt-4 border-t border-stone-dark/5 mt-auto">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest text-stone-light font-bold">Precio</span>
                        <span className="font-serif text-xl text-stone-dark">${prop.price?.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-3 ml-auto text-stone-dark/60">
                        <div className="flex flex-col items-center">
                            <span className="material-symbols-outlined text-xl text-primary">bed</span>
                            <span className="text-[10px] font-bold tracking-tighter">{prop.bedrooms}</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="material-symbols-outlined text-xl text-primary">shower</span>
                            <span className="text-[10px] font-bold tracking-tighter">{prop.bathrooms}</span>
                        </div>
                        <div className="flex flex-col items-center border-l border-stone-dark/10 pl-3">
                            <span className="material-symbols-outlined text-xl text-primary">square_foot</span>
                            <span className="text-[10px] font-bold tracking-tighter">{prop.area}m²</span>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default PropertyCard;
