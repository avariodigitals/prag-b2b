'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/lib/woocommerce';
import { formatPrice, getShopProductUrl } from '@/lib/woocommerce';

const APPLIANCES = [
  { name: 'Ceiling Fan', watts: 60 },
  { name: 'Standing Fan', watts: 60 },
  { name: 'Pressing Iron', watts: 1000 },
  { name: 'Air Conditioner (1HP)', watts: 746 },
  { name: 'LED Bulb (12W)', watts: 12 },
  { name: 'Washing Machine', watts: 1200 },
  { name: 'TV 32" LED', watts: 50 },
  { name: 'TV 55" Smart', watts: 100 },
  { name: 'DSTV / Decoder', watts: 30 },
  { name: 'Refrigerator (Medium)', watts: 150 },
  { name: 'Deep Freezer', watts: 200 },
  { name: 'Microwave Oven', watts: 1200 },
  { name: 'Electric Kettle', watts: 1500 },
  { name: 'Blender', watts: 400 },
  { name: 'Laptop', watts: 65 },
  { name: 'Desktop Computer', watts: 300 },
  { name: 'Phone Charger', watts: 20 },
  { name: 'WiFi Router', watts: 15 },
  { name: 'Water Pump (0.5HP)', watts: 373 },
  { name: 'Air Conditioner (1.5HP)', watts: 1119 },
  { name: 'Fluorescent Light (40W)', watts: 40 },
];

const KVA_SIZES = [0.6, 1, 1.5, 2, 2.5, 3.5, 5, 7.5, 10, 15, 20];

function nearestKva(kva: number): number {
  return KVA_SIZES.find((k) => k >= kva) ?? KVA_SIZES[KVA_SIZES.length - 1];
}

interface Props {
  products: Product[];
}

function extractProductKva(product: Product): number | null {
  const text = [
    product.name,
    ...(product.attributes?.map((attr) => `${attr.name} ${attr.options.join(' ')}`) ?? []),
  ].join(' ');

  const matches = Array.from(text.matchAll(/(\d+(?:\.\d+)?)\s*kva/gi));
  if (!matches.length) return null;

  const values = matches
    .map((m) => Number(m[1]))
    .filter((n) => Number.isFinite(n) && n > 0);

  if (!values.length) return null;
  return Math.max(...values);
}

function getProductLandingHref(product: Product): string {
  return getShopProductUrl(product);
}

export default function PowerCalculatorTool({ products }: Props) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [assessmentRequested, setAssessmentRequested] = useState(false);

  function update(name: string, delta: number) {
    setQuantities((prev) => ({
      ...prev,
      [name]: Math.max(0, (prev[name] ?? 0) + delta),
    }));
  }

  function reset() {
    setQuantities({});
    setAssessmentRequested(false);
  }

  const appliancesAdded = Object.values(quantities).reduce((s, q) => s + (q > 0 ? 1 : 0), 0);
  const peakWatts = APPLIANCES.reduce((s, a) => s + a.watts * (quantities[a.name] ?? 0), 0);
  const dailyKwh = (peakWatts * 8) / 1000;
  const recommendedKva = nearestKva(peakWatts / 1000 / 0.8);

  const recommendedProducts = useMemo(() => {
    if (!assessmentRequested || appliancesAdded === 0) return [] as Array<Product & { detectedKva: number }>;

    const withKva = products
      .map((product) => ({ product, detectedKva: extractProductKva(product) }))
      .filter((item): item is { product: Product; detectedKva: number } => item.detectedKva !== null)
      .sort((a, b) => a.detectedKva - b.detectedKva);

    const lowerBound = recommendedKva;
    const upperBound = recommendedKva * 2;

    let shortlist = withKva.filter((item) => item.detectedKva >= lowerBound && item.detectedKva <= upperBound);

    if (!shortlist.length) {
      shortlist = withKva.filter((item) => item.detectedKva >= lowerBound).slice(0, 8);
    }

    if (!shortlist.length) {
      shortlist = [...withKva]
        .sort((a, b) => Math.abs(a.detectedKva - recommendedKva) - Math.abs(b.detectedKva - recommendedKva))
        .slice(0, 8);
    }

    const seen = new Set<number>();
    return shortlist
      .filter((item) => {
        if (seen.has(item.product.id)) return false;
        seen.add(item.product.id);
        return true;
      })
      .map((item) => ({ ...item.product, detectedKva: item.detectedKva }));
  }, [products, assessmentRequested, appliancesAdded, recommendedKva]);

  const rows: typeof APPLIANCES[] = [];
  for (let i = 0; i < APPLIANCES.length; i += 3) rows.push(APPLIANCES.slice(i, i + 3));

  return (
    <div className="w-full px-6 md:px-20 py-8">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-8">
      {/* Appliance grid */}
      <div className="flex flex-col gap-4">
        {rows.map((row, ri) => (
          <div key={ri} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {row.map((appliance) => {
              const qty = quantities[appliance.name] ?? 0;
              return (
                <div
                  key={appliance.name}
                  className={`p-4 bg-white rounded-xl outline outline-1 flex flex-col gap-2 transition-colors ${qty > 0 ? 'outline-sky-700 bg-sky-50/30' : 'outline-zinc-200'}`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                      <span className="text-zinc-900 text-sm font-semibold font-['Onest']">{appliance.name}</span>
                      <span className="text-zinc-400 text-xs font-normal font-['Onest']">{appliance.watts}W per unit</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => update(appliance.name, -1)}
                        className="w-7 h-7 bg-white rounded-full outline outline-1 outline-zinc-300 flex justify-center items-center hover:outline-sky-700 transition-colors"
                      >
                        <span className="text-zinc-500 text-sm font-bold leading-none">−</span>
                      </button>
                      <span className="text-zinc-900 text-sm font-bold font-['Onest'] w-4 text-center">{qty}</span>
                      <button
                        onClick={() => update(appliance.name, 1)}
                        className="w-7 h-7 bg-sky-700 rounded-full flex justify-center items-center hover:bg-sky-800 transition-colors"
                      >
                        <span className="text-white text-sm font-bold leading-none">+</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Results bar */}
      <div className="w-full px-5 py-5 bg-sky-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-xl">
        <div className="flex flex-wrap gap-6">
          {[
            { label: 'Appliances Added', value: String(appliancesAdded) },
            { label: 'Peak Load', value: `${peakWatts}W` },
            { label: 'Daily Usage', value: `${dailyKwh.toFixed(1)} KWh` },
            { label: 'Recommended Inverter', value: appliancesAdded > 0 ? `${recommendedKva} KVA` : '—' },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-0.5">
              <span className="text-white text-lg font-extrabold font-['Onest']">{item.value}</span>
              <span className="text-white/60 text-xs font-normal font-['Onest']">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={reset}
            className="h-10 px-4 rounded-lg outline outline-1 outline-white text-white text-xs font-medium font-['Onest'] hover:bg-sky-800 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={() => setAssessmentRequested(true)}
            className={`h-10 px-5 bg-white rounded-lg text-sky-700 text-sm font-semibold font-['Onest'] flex items-center gap-2 hover:bg-sky-50 transition-colors ${appliancesAdded === 0 ? 'opacity-40 pointer-events-none' : ''}`}
            disabled={appliancesAdded === 0}
          >
            Get a Free Assessment →
          </button>
        </div>
      </div>

      {assessmentRequested && appliancesAdded > 0 && (
        <div className="w-full rounded-2xl border border-zinc-200 p-5 md:p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h2 className="text-zinc-900 text-xl font-bold font-['Onest']">Likely Product Matches</h2>
            <p className="text-zinc-500 text-lg md:text-xl font-['Onest']">
              Based on your load profile, these products can support around {recommendedKva} KVA requirements.
            </p>
          </div>

          {recommendedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedProducts.map((product) => {
                const numericPrice = Number(String(product.price ?? '').replace(/,/g, ''));
                const hasPrice = Number.isFinite(numericPrice) && numericPrice > 0;
                return (
                  <div key={product.id} className="rounded-xl border border-zinc-200 p-4 bg-white flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-col gap-1">
                        <p className="text-zinc-900 text-lg md:text-xl font-bold font-['Onest'] leading-tight">{product.name}</p>
                        <p className="text-zinc-500 text-lg md:text-xl font-['Onest']">
                          Capacity: {product.detectedKva} KVA
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold font-['Onest']">
                        {product.categories?.[0]?.name ?? 'Product'}
                      </span>
                    </div>

                    <p className="text-sky-700 text-lg md:text-xl font-semibold font-['Onest']">
                      {hasPrice ? formatPrice(product.price) : 'Contact for pricing'}
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={getProductLandingHref(product)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-9 px-4 rounded-lg bg-sky-700 hover:bg-sky-800 text-white text-sm font-semibold font-['Onest'] inline-flex items-center transition-colors"
                      >
                        Buy Now
                      </a>
                      <a
                        href={`https://wa.me/2348032170129?text=${encodeURIComponent(`Hi PRAG, I need help choosing the right system. My calculator recommendation is ${recommendedKva} KVA and I am interested in ${product.name}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-9 px-4 rounded-lg border border-sky-700 text-sky-700 hover:bg-sky-50 text-sm font-semibold font-['Onest'] inline-flex items-center transition-colors"
                      >
                        Contact Sales
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 flex flex-col gap-3">
              <p className="text-zinc-600 text-lg md:text-xl font-['Onest']">
                No direct product match was found for this exact capacity yet. Contact sales for a tailored recommendation.
              </p>
              <div>
                <Link
                  href="/contact"
                  className="h-9 px-4 rounded-lg bg-sky-700 hover:bg-sky-800 text-white text-sm font-semibold font-['Onest'] inline-flex items-center transition-colors"
                >
                  Get Expert Recommendation
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
