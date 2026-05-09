import type { Metadata } from 'next';
import Image from 'next/image';
import { getStores } from '@/lib/woocommerce';

export const metadata: Metadata = {
  title: 'Find a PRAG Store Near You – Prag B2B',
  description: 'Connect with authorized PRAG stores across Nigeria for expert consultation, product purchases, and professional installation services.',
};

function StoreCard({ store }: { store: { id: number; name: string; city: string; address: string; phone: string; map_url: string } }) {
  return (
    <div className="p-5 bg-white rounded-2xl border border-zinc-100 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-sky-700 text-lg font-bold font-['Onest']">{store.name}</h3>
        <p className="text-zinc-700 text-sm font-medium font-['Space_Grotesk']">{store.city}</p>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-sky-700 text-xs font-medium font-['Space_Grotesk']">Address</span>
          <p className="text-zinc-700 text-sm font-['Space_Grotesk']">{store.address}</p>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-sky-700 text-xs font-medium font-['Space_Grotesk']">Phone Number</span>
          <a href={`tel:${store.phone}`} className="text-zinc-700 text-sm font-['Space_Grotesk'] hover:text-sky-700">{store.phone}</a>
        </div>
      </div>
      <div className="flex gap-3 mt-auto">
        <a href={`tel:${store.phone}`}
          className="flex-1 py-2.5 bg-sky-700 hover:bg-sky-800 text-white text-sm font-medium font-['Space_Grotesk'] rounded-xl text-center transition-colors">
          Contact Store
        </a>
        <a href={store.map_url} target="_blank" rel="noopener noreferrer"
          className="flex-1 py-2.5 border border-sky-700 text-sky-700 hover:bg-sky-50 text-sm font-medium font-['Space_Grotesk'] rounded-xl text-center transition-colors">
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
      <div className="flex flex-col items-center gap-3 text-center pt-14 pb-8 px-6">
        <h1 className="text-sky-700 text-3xl md:text-4xl font-bold font-['Onest']">Find a PRAG Store Near You</h1>
        <p className="text-zinc-500 text-sm font-['Space_Grotesk'] max-w-sm leading-relaxed text-center">
          Connect with authorized PRAG stores across Nigeria for<br />
          expert consultation, product purchases, and professional<br />
          installation services.
        </p>
        <div className="w-full border-t border-dashed border-sky-200 mt-4" />
      </div>

      <div className="max-w-5xl mx-auto w-full px-6 md:px-10 py-10 flex flex-col gap-14 pb-20">

        {/* PRAG Stores */}
        {pragStores.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-zinc-900 text-2xl font-bold font-['Onest']">PRAG Stores</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pragStores.map((store) => <StoreCard key={store.id} store={store} />)}
            </div>
          </div>
        )}

        {/* Online Stores */}
        {onlineStores.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-zinc-900 text-2xl font-bold font-['Onest']">Online Stores</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {onlineStores.map((store) => (
                <div key={store.id} className="flex flex-col gap-3">
                  <p className="text-sky-700 text-sm font-semibold font-['Onest']">{store.name}</p>
                  <a href={store.map_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center bg-white border border-zinc-100 rounded-2xl p-4 h-20 hover:shadow-sm transition-all">
                    <Image src={store.logo!.src} alt={store.logo!.alt} width={140} height={60} className="object-contain max-h-12 w-auto" />
                  </a>
                  <a href={store.map_url} target="_blank" rel="noopener noreferrer"
                    className="py-2 border border-zinc-300 text-zinc-700 text-xs font-medium font-['Space_Grotesk'] rounded-lg text-center hover:border-sky-700 hover:text-sky-700 transition-colors">
                    Shop on {store.name}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chain Stores */}
        {chainStores.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-zinc-900 text-2xl font-bold font-['Onest']">Chain Stores</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {chainStores.map((store) => (
                <div key={store.id} className="flex flex-col gap-3">
                  <p className="text-sky-700 text-sm font-semibold font-['Onest']">{store.name}</p>
                  <a href={store.map_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center bg-white border border-zinc-100 rounded-2xl p-4 h-20 hover:shadow-sm transition-all">
                    <Image src={store.logo!.src} alt={store.logo!.alt} width={140} height={60} className="object-contain max-h-12 w-auto" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!pragStores.length && !onlineStores.length && !chainStores.length && (
          <p className="text-zinc-400 text-sm font-['Space_Grotesk'] text-center py-10">No stores available right now. Please check back shortly.</p>
        )}
      </div>
    </main>
  );
}
