import Image from 'next/image';
import type { Store } from '@/lib/woocommerce';

function StoreCard({ store }: { store: Store }) {
  return (
    <div className="flex flex-col gap-4 p-6 bg-white rounded-2xl border border-zinc-300 h-full">
      {/* Name + City */}
      <div className="flex flex-col gap-1">
        <h3 className="text-[#0166a5] text-[28px] font-bold font-['Onest'] leading-tight">{store.name}</h3>
        <p className="text-[#444444] text-lg font-medium font-['Space_Grotesk']">{store.city}</p>
      </div>

      {/* Address + Phone */}
      <div className="flex flex-col gap-3 flex-1">
        <div className="flex flex-col gap-1">
          <span className="text-[#0166a5] text-sm font-medium font-['Space_Grotesk']">Address</span>
          <p className="text-[#444444] text-base font-normal font-['Space_Grotesk'] leading-6">{store.address}</p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[#0166a5] text-sm font-medium font-['Space_Grotesk']">Phone Number</span>
          <a
            href={`tel:${store.phone}`}
            className="text-[#444444] text-base font-normal font-['Space_Grotesk'] hover:text-[#0166a5] transition-colors"
          >
            {store.phone}
          </a>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-auto pt-2">
        <a
          href={`tel:${store.phone}`}
          className="flex-1 py-2.5 px-4 bg-[#0166a5] hover:bg-[#015490] text-white text-sm font-medium font-['Space_Grotesk'] rounded-xl text-center transition-colors"
          aria-label={`Contact ${store.name}`}
        >
          Contact Store
        </a>
        <a
          href={store.map_url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2.5 px-4 border border-[#0166a5] text-[#0166a5] hover:bg-[#0166a5] hover:text-white text-sm font-medium font-['Space_Grotesk'] rounded-xl text-center transition-colors"
          aria-label={`Map directions to ${store.name}`}
        >
          Map Directions
        </a>
      </div>
    </div>
  );
}

interface OnlineChainCardProps {
  name: string;
  logoSrc: string;
  logoAlt: string;
  href: string;
  buttonLabel: string;
}

function OnlineChainCard({ name, logoSrc, logoAlt, href, buttonLabel }: OnlineChainCardProps) {
  return (
    <div className="flex flex-col gap-4 p-5 bg-white rounded-2xl border border-zinc-300">
      <h3 className="text-[#0166a5] text-[28px] font-bold font-['Onest'] leading-tight">{name}</h3>
      <div className="flex items-center justify-center h-[122px]">
        <img
          src={logoSrc}
          alt={logoAlt}
          className="max-h-[90px] max-w-full object-contain"
        />
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-2.5 border border-[#0166a5] text-[#0166a5] hover:bg-[#0166a5] hover:text-white text-sm font-medium font-['Space_Grotesk'] rounded-xl text-center transition-colors"
        aria-label={buttonLabel}
      >
        {buttonLabel}
      </a>
    </div>
  );
}

interface Props {
  pragStores: Store[];
  onlineStores: Store[];
  chainStores: Store[];
}

function sortPragStores(stores: Store[]): Store[] {
  const cityOrder = ['Lagos', 'Abuja', 'Port Harcourt'];
  const lagosOrder = ['Obanikoro', 'Island', 'Alaba'];

  return [...stores].sort((a, b) => {
    const aCity = a.city.trim();
    const bCity = b.city.trim();
    const aName = a.name.trim();
    const bName = b.name.trim();

    const aCityIdx = cityOrder.indexOf(aCity);
    const bCityIdx = cityOrder.indexOf(bCity);

    if (aCityIdx !== -1 && bCityIdx !== -1 && aCityIdx !== bCityIdx) {
      return aCityIdx - bCityIdx;
    }

    if (aCity === 'Lagos' && bCity === 'Lagos') {
      const aNameIdx = lagosOrder.findIndex((n) => aName.toLowerCase().includes(n.toLowerCase()));
      const bNameIdx = lagosOrder.findIndex((n) => bName.toLowerCase().includes(n.toLowerCase()));
      if (aNameIdx !== -1 && bNameIdx !== -1 && aNameIdx !== bNameIdx) {
        return aNameIdx - bNameIdx;
      }
      if (aNameIdx !== -1) return -1;
      if (bNameIdx !== -1) return 1;
    }

    if (aCityIdx !== -1 && bCityIdx === -1) return -1;
    if (aCityIdx === -1 && bCityIdx !== -1) return 1;

    return aName.localeCompare(bName);
  });
}

export default function StoresGrid({ pragStores, onlineStores, chainStores }: Props) {
  const hasStores = pragStores.length > 0 || onlineStores.length > 0 || chainStores.length > 0;
  if (!hasStores) return null;

  const sortedPragStores = sortPragStores(pragStores);
  return (
    <div className="w-full flex flex-col gap-16">
      {/* PRAG Stores */}
      {sortedPragStores.length > 0 && (
        <section className="w-full px-6 md:px-20">
          <div className="max-w-[1280px] mx-auto flex flex-col gap-6">
            <h2 className="text-[#1a1a1a] text-[40px] font-bold font-['Onest'] tracking-[-1px]">
              PRAG Stores
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedPragStores.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Online Stores */}
      {onlineStores.length > 0 && (
        <section className="w-full px-6 md:px-20">
          <div className="max-w-[1280px] mx-auto flex flex-col gap-6">
            <h2 className="text-[#1a1a1a] text-[40px] font-bold font-['Onest'] tracking-[-1px]">
              Online Stores
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-[700px]">
              {onlineStores.map((store) => {
                const logoSrc = store.logo?.src || `/images/store-${store.name.toLowerCase().replace(/[^a-z]/g, '-')}.png`;
                const logoAlt = store.logo?.alt || store.name;
                return (
                  <OnlineChainCard
                    key={store.id}
                    name={store.name}
                    logoSrc={logoSrc}
                    logoAlt={logoAlt}
                    href={store.map_url || '#'}
                    buttonLabel={`Shop on ${store.name}`}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Chain Stores */}
      {chainStores.length > 0 && (
        <section className="w-full px-6 md:px-20">
          <div className="max-w-[1280px] mx-auto flex flex-col gap-6">
            <h2 className="text-[#1a1a1a] text-[40px] font-bold font-['Onest'] tracking-[-1px]">
              Chain Stores
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {chainStores.map((store) => {
                const logoSrc = store.logo?.src || `/images/store-${store.name.toLowerCase().replace(/[^a-z]/g, '-')}.png`;
                const logoAlt = store.logo?.alt || store.name;
                return (
                  <OnlineChainCard
                    key={store.id}
                    name={store.name}
                    logoSrc={logoSrc}
                    logoAlt={logoAlt}
                    href={store.map_url || '#'}
                    buttonLabel="Visit Store"
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
