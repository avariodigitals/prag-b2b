import Image from 'next/image';
import type { Store } from '@/lib/woocommerce';

function StoreCard({ store }: { store: Store }) {
  return (
    <div className="flex-1 p-5 bg-white rounded-2xl border border-zinc-100 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-sky-700 text-base font-bold font-['Montserrat']">{store.name}</h3>
        <p className="text-zinc-700 text-base font-medium font-['Montserrat']">{store.city}</p>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-sky-700 text-base font-medium font-['Montserrat']">Address</span>
          <p className="text-zinc-700 text-base font-['Montserrat']">{store.address}</p>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-sky-700 text-base font-medium font-['Montserrat']">Phone Number</span>
          <a href={`tel:${store.phone}`} className="text-zinc-700 text-base font-['Montserrat'] hover:text-sky-700">{store.phone}</a>
        </div>
      </div>
      <div className="flex gap-3 mt-auto">
        <a href={`tel:${store.phone}`}
          className="flex-1 py-2.5 bg-sky-700 hover:bg-sky-800 text-white text-base font-medium font-['Montserrat'] rounded-xl text-center transition-colors">
          Contact Store
        </a>
        <a href={store.map_url} target="_blank" rel="noopener noreferrer"
          className="flex-1 py-2.5 border border-sky-700 text-sky-700 hover:bg-sky-50 text-base font-medium font-['Montserrat'] rounded-xl text-center transition-colors">
          Map Directions
        </a>
      </div>
    </div>
  );
}

interface Props {
  pragStores: Store[];
  onlineStores: Store[];
  chainStores: Store[];
}

export default function StoresGrid({ pragStores, onlineStores, chainStores }: Props) {
  const onlineLogos = onlineStores.filter((s) => s.logo).map((s) => ({ src: s.logo!.src, alt: s.logo!.alt, href: s.map_url, name: s.name }));
  const chainLogos = chainStores.filter((s) => s.logo).map((s) => ({ src: s.logo!.src, alt: s.logo!.alt, href: s.map_url, name: s.name }));

  return (
    <section className="w-full px-6 md:px-20 py-12 flex flex-col gap-12">
      {/* Header */}
      <div className="flex flex-col items-center gap-3 text-center">
        <h2 className="text-sky-700 text-3xl md:text-4xl font-bold font-['Montserrat']">Find a PRAG Store Near You</h2>
        <p className="text-zinc-500 text-lg md:text-xl font-['Montserrat'] max-w-sm leading-relaxed">
          Connect with authorized PRAG stores across Nigeria for<br />
          expert consultation, product purchases, and professional<br />
          installation services.
        </p>
      </div>

      {/* PRAG Stores */}
      {pragStores.length > 0 && (
        <div className="flex flex-col gap-6">
          <h3 className="text-zinc-900 text-2xl font-bold font-['Montserrat']">PRAG Stores</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pragStores.map((store) => <StoreCard key={store.id} store={store} />)}
          </div>
        </div>
      )}

      {/* Online Stores */}
      {onlineLogos.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="text-zinc-900 text-2xl font-bold font-['Montserrat']">Online Stores</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {onlineLogos.map((s, i) => (
              <div key={i} className="flex flex-col gap-2">
                <p className="text-sky-700 text-lg md:text-xl font-semibold font-['Montserrat']">{s.name}</p>
                <a href={s.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center bg-white border border-zinc-100 rounded-2xl p-4 h-20 hover:border-zinc-200 hover:shadow-sm transition-all">
                  <Image src={s.src} alt={s.alt} width={140} height={60} className="object-contain max-h-12 w-auto" />
                </a>
                <a href={s.href} target="_blank" rel="noopener noreferrer"
                  className="py-2 border border-zinc-300 text-zinc-700 text-xs font-medium font-['Montserrat'] rounded-lg text-center hover:border-sky-700 hover:text-sky-700 transition-colors">
                  Shop on {s.name}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chain Stores */}
      {chainLogos.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="text-zinc-900 text-2xl font-bold font-['Montserrat']">Chain Stores</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {chainLogos.map((s, i) => (
              <div key={i} className="flex flex-col gap-2">
                <p className="text-sky-700 text-lg md:text-xl font-semibold font-['Montserrat']">{s.name}</p>
                <a href={s.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center bg-white border border-zinc-100 rounded-2xl p-4 h-20 hover:border-zinc-200 hover:shadow-sm transition-all">
                  <Image src={s.src} alt={s.alt} width={140} height={60} className="object-contain max-h-12 w-auto" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
