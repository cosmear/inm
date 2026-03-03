import React from 'react';

const PropertyCard = ({ prop }) => {
    return (
        <article className="group cursor-pointer flex flex-col h-full bg-white/60 backdrop-blur-md rounded-2xl overflow-hidden border border-white/60 shadow-sm transition-all duration-500 hover:shadow-glass hover:-translate-y-1">
            <div className="relative overflow-hidden aspect-[4/3]">
                <img
                    src={prop.image_url}
                    alt={prop.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg text-[9px] font-semibold uppercase tracking-wider text-stone-dark shadow-sm border border-white/50">
                    {prop.operation || 'Comprar'}
                </div>
                {prop.featured && (
                    <div className="absolute top-4 right-4 bg-primary/95 backdrop-blur-md px-3 py-1 rounded-lg text-[9px] font-semibold uppercase tracking-wider text-white shadow-sm border border-primary/50">
                        Exclusivo
                    </div>
                )}
            </div>

            <div className="p-5 flex flex-col flex-grow bg-white/20">
                <div className="flex justify-between items-start mb-1.5">
                    <h3 className="font-serif text-xl md:text-2xl text-stone-dark group-hover:text-primary transition-colors leading-snug">
                        {prop.title}
                    </h3>
                </div>

                <p className="text-stone-dark/60 font-medium text-xs flex items-center gap-1.5 mb-5 tracking-wide">
                    <span className="material-symbols-outlined text-[14px] text-primary/70">location_on</span>
                    {prop.location}
                </p>

                <div className="flex items-center gap-4 pt-4 border-t border-stone-dark/10 mt-auto">
                    <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-wider text-stone-dark/50 font-semibold mb-0.5">Precio</span>
                        <span className="font-serif text-lg md:text-xl text-stone-dark">${prop.price?.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-3 md:gap-4 ml-auto text-stone-dark/70">
                        <div className="flex flex-col items-center">
                            <span className="material-symbols-outlined text-[18px] text-primary/80">bed</span>
                            <span className="text-[10px] font-medium tracking-tight mt-0.5">{prop.bedrooms}</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="material-symbols-outlined text-[18px] text-primary/80">shower</span>
                            <span className="text-[10px] font-medium tracking-tight mt-0.5">{prop.bathrooms}</span>
                        </div>
                        <div className="flex flex-col items-center border-l border-stone-dark/10 pl-3 md:pl-4">
                            <span className="material-symbols-outlined text-[18px] text-primary/80">square_foot</span>
                            <span className="text-[10px] font-medium tracking-tight mt-0.5">{prop.area}m²</span>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default PropertyCard;
