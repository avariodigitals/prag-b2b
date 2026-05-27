export interface Product {
  id: number;
  name: string;
  slug: string;
  permalink?: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: string;
  short_description: string;
  description: string;
  weight?: string;
  dimensions?: { length: string; width: string; height: string };
  images: { src: string; alt: string }[];
  categories: { id: number; name: string; slug: string }[];
  tags?: { id: number; name: string; slug: string }[];
  attributes?: { id: number; name: string; options: string[] }[];
}

export interface ProductReview {
  id: number;
  reviewer: string;
  review: string;
  rating: number;
  date_created: string;
  verified: boolean;
}

export interface TechDocument {
  id: number;
  title: string;
  file_url: string;
  file_type: string;
  file_size: string;
  pages: string;
  product_id: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  count: number;
  parent: number;
}

function authParams() {
  return `consumer_key=${process.env.WC_CONSUMER_KEY}&consumer_secret=${process.env.WC_CONSUMER_SECRET}`;
}

function baseUrl() {
  const url = process.env.NEXT_PUBLIC_WP_API_URL ?? 'https://central.prag.global/wp-json';
  return `${url}/wc/v3`;
}

async function wcFetch<T>(path: string, fallback: T): Promise<T> {
  try {
    const sep = path.includes('?') ? '&' : '?';
    const res = await fetch(`${baseUrl()}${path}${sep}${authParams()}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return fallback;
    const text = await res.text();
    if (!text.startsWith('{') && !text.startsWith('[')) return fallback;
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

export async function getCategories(): Promise<Category[]> {
  return wcFetch<Category[]>('/products/categories?per_page=100&hide_empty=true&_fields=id,name,slug,count,parent', []);
}

export async function getProducts({
  category_id,
  per_page = 20,
  page = 1,
  orderby,
  order,
}: {
  category_id?: number;
  per_page?: number;
  page?: number;
  orderby?: 'title' | 'date' | 'id' | 'slug' | 'price' | 'popularity' | 'rating' | 'menu_order';
  order?: 'asc' | 'desc';
} = {}): Promise<{ products: Product[]; total: number }> {
  const qs = new URLSearchParams({
    status: 'publish',
    per_page: String(per_page),
    page: String(page),
    _fields: 'id,name,slug,permalink,price,regular_price,sale_price,on_sale,stock_status,images,categories,tags,attributes',
    ...(category_id ? { category: String(category_id) } : {}),
    ...(orderby ? { orderby } : {}),
    ...(order ? { order } : {}),
  });
  try {
    const sep = '?';
    const res = await fetch(`${baseUrl()}/products${sep}${qs}&${authParams()}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return { products: [], total: 0 };
    const text = await res.text();
    if (!text.startsWith('[')) return { products: [], total: 0 };
    return {
      products: JSON.parse(text) as Product[],
      total: Number(res.headers.get('X-WP-Total') ?? 0),
    };
  } catch {
    return { products: [], total: 0 };
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(
      `${baseUrl()}/products?slug=${slug}&_fields=id,name,slug,permalink,price,regular_price,sale_price,on_sale,stock_status,short_description,description,images,categories,tags,attributes,dimensions,weight&${authParams()}`,
      { next: { revalidate: 120 } }
    );
    if (!res.ok) return null;
    const text = await res.text();
    if (!text.startsWith('[')) return null;
    const products = JSON.parse(text) as Product[];
    return products[0] ?? null;
  } catch {
    return null;
  }
}

export async function getProductReviews(productId: number): Promise<ProductReview[]> {
  try {
    const res = await fetch(
      `${baseUrl()}/products/reviews?product=${productId}&per_page=10&status=approved&${authParams()}`,
      { next: { revalidate: 120 } }
    );
    if (!res.ok) return [];
    const text = await res.text();
    if (!text.startsWith('[')) return [];
    return JSON.parse(text) as ProductReview[];
  } catch {
    return [];
  }
}

function wpBase() {
  const url = process.env.NEXT_PUBLIC_WP_API_URL ?? 'https://central.prag.global/wp-json';
  return `${url}/wp/v2`;
}

export async function getTechDocuments(productId: number): Promise<TechDocument[]> {
  try {
    const res = await fetch(`${wpBase()}/prag_document?per_page=100&_fields=id,title,meta`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json() as Array<{ id: number; title: { rendered: string }; meta: Record<string, string> }>;
    return data
      .map(d => ({
        id: d.id,
        title: d.title?.rendered ?? '',
        file_url: d.meta?.file_url ?? '',
        file_type: d.meta?.file_type ?? '',
        file_size: d.meta?.file_size ?? '',
        pages: d.meta?.pages ?? '',
        product_id: Number(d.meta?.product_id ?? 0),
      }))
      .filter(d => d.file_url && d.product_id === productId);
  } catch {
    return [];
  }
}

export async function getProductsForCompare(slugs: string[]): Promise<Product[]> {
  if (!slugs.length) return [];
  const results = await Promise.all(slugs.map(slug => getProductBySlug(slug)));
  return results.filter((p): p is Product => p !== null);
}

async function searchProductsRaw(query: string, per_page = 8): Promise<Product[]> {
  try {
    const qs = new URLSearchParams({
      search: query,
      status: 'publish',
      per_page: String(per_page),
      _fields: 'id,name,slug,permalink,price,regular_price,sale_price,on_sale,stock_status,images,categories,attributes',
    });
    const res = await fetch(`${baseUrl()}/products?${qs}&${authParams()}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const text = await res.text();
    if (!text.startsWith('[')) return [];
    return JSON.parse(text) as Product[];
  } catch {
    return [];
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  return searchProductsRaw(query);
}

export function formatPrice(price: string) {
  return `₦${Number(price).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
}

export function getShopProductUrl(product: Pick<Product, 'slug' | 'categories'>): string {
  const shopBase = 'https://shop.prag.global';
  const categorySlug = product.categories?.[0]?.slug?.trim() || 'products';
  const productSlug = product.slug?.trim();
  return `${shopBase}/products/${encodeURIComponent(categorySlug)}/${encodeURIComponent(productSlug)}`;
}

export interface Store {
  id: number;
  name: string;
  city: string;
  address: string;
  phone: string;
  map_url: string;
  type: 'prag' | 'online' | 'chain';
  logo?: { src: string; alt: string };
}

export interface SiteSettings {
  contact_phone: string;
  contact_email: string;
  address: string;
  business_hours_weekday: string;
  business_hours_saturday: string;
  socials: { facebook: string; instagram: string; linkedin: string; twitter: string; whatsapp: string };
}

const SETTINGS_FALLBACK: SiteSettings = {
  contact_phone: '+2348032170129',
  contact_email: 'sales@prag.global',
  address: '14 Industrial Layout, Victoria Island, Lagos, Nigeria',
  business_hours_weekday: 'Mon–Fri: 8:00 AM – 6:00 PM',
  business_hours_saturday: 'Sat: 9:00 AM – 2:00 PM',
  socials: {
    facebook: 'https://www.facebook.com/pragpowersolutions',
    instagram: 'https://www.instagram.com/prag_ng/',
    linkedin: 'https://www.linkedin.com/company/prag/',
    twitter: '',
    whatsapp: 'https://wa.me/2348032170129',
  },
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WP_API_URL ?? 'https://central.prag.global/wp-json'}/prag-core/v1/settings`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return SETTINGS_FALLBACK;
    const data = await res.json();
    return {
      ...SETTINGS_FALLBACK,
      ...data,
      socials: { ...SETTINGS_FALLBACK.socials, ...(data.socials ?? {}) },
    };
  } catch {
    return SETTINGS_FALLBACK;
  }
}

export async function getStores(): Promise<Store[]> {
  try {
    const url = process.env.NEXT_PUBLIC_WP_API_URL ?? 'https://central.prag.global/wp-json';
    const res = await fetch(`${url}/wp/v2/prag_store?per_page=100&_fields=id,title,meta`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json() as Array<{ id: number; title: { rendered: string }; meta: Record<string, string> }>;
    return data.map((s) => ({
      id: s.id,
      name: s.title?.rendered ?? '',
      city: s.meta?.city ?? '',
      address: s.meta?.address ?? '',
      phone: s.meta?.phone ?? '',
      map_url: s.meta?.map_url ?? '',
      type: (s.meta?.store_type as Store['type']) ?? 'prag',
      logo: s.meta?.logo_url ? { src: s.meta.logo_url, alt: s.meta?.logo_alt ?? s.title?.rendered ?? '' } : undefined,
    }));
  } catch {
    return [];
  }
}

export async function submitContactForm(data: {
  name: string; email: string; phone?: string; company?: string; enquiry_type?: string; message: string; subject?: string; route?: string;
}): Promise<{ success: boolean }> {
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return { success: res.ok };
  } catch {
    return { success: false };
  }
}
