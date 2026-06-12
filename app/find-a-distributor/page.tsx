import type { Metadata } from 'next';
import { getStores } from '@/lib/woocommerce';

export const metadata: Metadata = {
  title: 'Find a PRAG Store Near You',
  description: 'Connect with authorized PRAG stores across Nigeria for expert consultation, product purchases, and professional installation services.',
};

function StoreCard({ store }: { store: { id: number; name: string; city: string; address: string; phone: string; map_url: string } }) {
  return (
    <div className="p-6 bg-white rounded-2xl border border-zinc-300 flex flex-col gap-4">
      <div className="flex flex-col gap-0.5">
        <h3 className="text-sky-700 text-lg font-bold font-['Onest']">{store.name}</h3>
        <span className="text-zinc-800 text-sm font-medium font-['Onest']">{store.city}</span>
      </div>
      <div className="flex flex-col gap-3 flex-1">
        <div className="flex flex-col gap-0.5">
          <span className="text-sky-700 text-xs font-semibold font-['Onest'] uppercase tracking-wide">Address</span>
          <p className="text-zinc-700 text-sm font-['Onest'] leading-relaxed">{store.address}</p>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-sky-700 text-xs font-semibold font-['Onest'] uppercase tracking-wide">Phone Number</span>
          <a href={`tel:${store.phone}`} className="text-zinc-700 text-sm font-['Onest'] hover:text-sky-700 transition-colors">{store.phone}</a>
        </div>
      </div>
      <div className="flex gap-3 pt-1">
        <a href={`tel:${store.phone}`}
          className="flex-1 py-2.5 bg-sky-700 hover:bg-sky-800 text-white text-sm font-semibold font-['Onest'] rounded-lg text-center transition-colors">
          Contact Store
        </a>
        <a href={store.map_url} target="_blank" rel="noopener noreferrer"
          className="flex-1 py-2.5 border border-sky-700 text-sky-700 hover:bg-sky-50 text-sm font-semibold font-['Onest'] rounded-lg text-center transition-colors">
          Map Directions
        </a>
      </div>
    </div>
  );
}

export default async function FindADistributorPage() {
  const stores = await getStores();

  const pragStores = stores.filter((s) => s.type === 'prag');
  const onlineStores = stores.filter((s) => s.type === 'online' && s.logo);
  const chainStores = stores.filter((s) => s.type === 'chain' && s.logo);

  return (
    <main className="w-full flex flex-col">
      {/* Hero */}
      <div className="w-full bg-stone-50 px-6 breadcrumb-hero-shell flex flex-col items-center gap-4 text-center">
        <h1 className="breadcrumb-title-lock leading-tight">Find a PRAG Store Near You</h1>
        <p className="breadcrumb-description-lock max-w-[531px] leading-relaxed">
          Connect with authorized PRAG stores across Nigeria for expert consultation, product purchases, and professional installation services.
        </p>
      </div>

      <div className="w-full px-6 md:px-20 py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto w-full flex flex-col gap-16">

        {/* PRAG Stores */}
        {pragStores.length > 0 && (
          <div className="flex flex-col gap-8">
            <h2 className="text-zinc-900 text-2xl md:text-3xl font-bold font-['Onest']">PRAG Stores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pragStores.map((store) => <StoreCard key={store.id} store={store} />)}
            </div>
          </div>
        )}

        {/* Online Stores */}
        {onlineStores.length > 0 && (
          <div className="flex flex-col gap-8">
            <h2 className="text-zinc-900 text-2xl md:text-3xl font-bold font-['Onest']">Online Stores</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {onlineStores.map((store) => (
                <div key={store.id} className="p-5 bg-white border border-zinc-300 rounded-2xl flex flex-col gap-4">
                  <h3 className="text-sky-700 text-base font-bold font-['Onest']">{store.name}</h3>
                  <div className="flex-1 flex items-center justify-center py-4">
                    <img src={store.logo!.src} alt={store.logo!.alt} className="max-h-14 w-auto object-contain" />
                  </div>
                  <a href={store.map_url} target="_blank" rel="noopener noreferrer"
                    className="w-full py-2.5 border border-sky-700 text-sky-700 hover:bg-sky-50 text-sm font-semibold font-['Onest'] rounded-lg text-center transition-colors">
                    Shop on {store.name}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chain Stores */}
        {chainStores.length > 0 && (
          <div className="flex flex-col gap-8">
            <h2 className="text-zinc-900 text-2xl md:text-3xl font-bold font-['Onest']">Chain Stores</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {chainStores.map((store) => (
                <div key={store.id} className="p-5 bg-white border border-zinc-300 rounded-2xl flex flex-col gap-4">
                  <h3 className="text-sky-700 text-base font-bold font-['Onest']">{store.name}</h3>
                  <div className="flex-1 flex items-center justify-center py-4">
                    <img src={store.logo!.src} alt={store.logo!.alt} className="max-h-14 w-auto object-contain" />
                  </div>
                  <a href={store.map_url} target="_blank" rel="noopener noreferrer"
                    className="w-full py-2.5 border border-sky-700 text-sky-700 hover:bg-sky-50 text-sm font-semibold font-['Onest'] rounded-lg text-center transition-colors">
                    Visit Store
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {!pragStores.length && !onlineStores.length && !chainStores.length && (
          <p className="text-zinc-400 text-lg md:text-xl font-['Onest'] text-center py-20">No stores available right now. Please check back shortly.</p>
        )}
        </div>
      </div>
    </main>
  );
}
