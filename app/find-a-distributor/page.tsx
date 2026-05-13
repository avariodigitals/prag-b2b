import type { Metadata } from 'next';
import Image from 'next/image';
import { MapPin, Phone } from 'lucide-react';
import { getStores } from '@/lib/woocommerce';

export const metadata: Metadata = {
  title: 'Find a PRAG Store Near You',
  description: 'Connect with authorized PRAG stores across Nigeria for expert consultation, product purchases, and professional installation services.',
};

function StoreCard({ store }: { store: { id: number; name: string; city: string; address: string; phone: string; map_url: string } }) {
  return (
    <div className="p-6 bg-white rounded-2xl border border-zinc-100 shadow-sm flex flex-col gap-5 hover:border-sky-200 hover:shadow-md transition-all">
      <div className="flex flex-col gap-1">
        <h3 className="text-zinc-900 text-lg font-bold font-['Montserrat']">{store.name}</h3>
        <span className="text-sky-700 text-xs font-semibold font-['Montserrat'] uppercase tracking-wider">{store.city}</span>
      </div>
      <div className="flex flex-col gap-3 flex-1">
        <div className="flex items-start gap-2.5">
          <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
          <p className="text-zinc-600 text-lg md:text-xl font-['Montserrat'] leading-relaxed">{store.address}</p>
        </div>
        <div className="flex items-center gap-2.5">
          <Phone className="w-4 h-4 text-zinc-400 shrink-0" />
          <a href={`tel:${store.phone}`} className="text-zinc-600 text-sm font-['Montserrat'] hover:text-sky-700 transition-colors">{store.phone}</a>
        </div>
      </div>
      <div className="flex gap-3 pt-1">
        <a href={`tel:${store.phone}`}
          className="flex-1 py-2.5 bg-sky-700 hover:bg-sky-800 text-white text-sm font-medium font-['Montserrat'] rounded-xl text-center transition-colors">
          Call Store
        </a>
        <a href={store.map_url} target="_blank" rel="noopener noreferrer"
          className="flex-1 py-2.5 border border-sky-700 text-sky-700 hover:bg-sky-50 text-sm font-medium font-['Montserrat'] rounded-xl text-center transition-colors">
          Get Directions
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
      <div className="w-full bg-stone-50 py-16 md:py-20 px-6 flex flex-col items-center gap-4 text-center">
        <h1 className="text-sky-700 text-3xl md:text-4xl font-bold font-['Montserrat'] leading-tight">Find a PRAG Store Near You</h1>
        <p className="text-sky-700 text-lg md:text-xl font-['Montserrat'] leading-relaxed max-w-lg">
          Connect with authorized PRAG stores across Nigeria for expert consultation, product purchases, and professional installation services.
        </p>
      </div>

      <div className="max-w-6xl mx-auto w-full px-6 md:px-10 py-16 md:py-20 flex flex-col gap-16">

        {/* PRAG Stores */}
        {pragStores.length > 0 && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-sky-700 rounded-sm shrink-0" />
                <span className="text-zinc-500 text-xs font-semibold font-['Montserrat'] uppercase tracking-widest">Official Locations</span>
              </div>
              <h2 className="text-zinc-900 text-2xl md:text-3xl font-bold font-['Montserrat']">PRAG Stores</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pragStores.map((store) => <StoreCard key={store.id} store={store} />)}
            </div>
          </div>
        )}

        {/* Online Stores */}
        {onlineStores.length > 0 && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-sky-700 rounded-sm shrink-0" />
                <span className="text-zinc-500 text-xs font-semibold font-['Montserrat'] uppercase tracking-widest">E-Commerce</span>
              </div>
              <h2 className="text-zinc-900 text-2xl md:text-3xl font-bold font-['Montserrat']">Online Stores</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {onlineStores.map((store) => (
                <div key={store.id} className="flex flex-col gap-3">
                  <a href={store.map_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center bg-white border border-zinc-100 rounded-2xl p-5 h-24 hover:border-sky-200 hover:shadow-md transition-all">
                    <Image src={store.logo!.src} alt={store.logo!.alt} width={140} height={60} className="object-contain max-h-12 w-auto" />
                  </a>
                  <p className="text-zinc-700 text-lg md:text-xl font-semibold font-['Montserrat'] text-center">{store.name}</p>
                  <a href={store.map_url} target="_blank" rel="noopener noreferrer"
                    className="py-2 border border-zinc-200 text-zinc-600 text-xs font-medium font-['Montserrat'] rounded-lg text-center hover:border-sky-700 hover:text-sky-700 transition-colors">
                    Shop Now →
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chain Stores */}
        {chainStores.length > 0 && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-sky-700 rounded-sm shrink-0" />
                <span className="text-zinc-500 text-xs font-semibold font-['Montserrat'] uppercase tracking-widest">Retail Partners</span>
              </div>
              <h2 className="text-zinc-900 text-2xl md:text-3xl font-bold font-['Montserrat']">Chain Stores</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {chainStores.map((store) => (
                <div key={store.id} className="flex flex-col gap-3">
                  <a href={store.map_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center bg-white border border-zinc-100 rounded-2xl p-5 h-24 hover:border-sky-200 hover:shadow-md transition-all">
                    <Image src={store.logo!.src} alt={store.logo!.alt} width={140} height={60} className="object-contain max-h-12 w-auto" />
                  </a>
                  <p className="text-zinc-700 text-lg md:text-xl font-semibold font-['Montserrat'] text-center">{store.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!pragStores.length && !onlineStores.length && !chainStores.length && (
          <p className="text-zinc-400 text-lg md:text-xl font-['Montserrat'] text-center py-20">No stores available right now. Please check back shortly.</p>
        )}
      </div>
    </main>
  );
}
