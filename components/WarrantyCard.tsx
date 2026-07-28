import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface WarrantyCardProps {
  title: string;
  icon: React.ReactNode;
  href: string;
}

export default function WarrantyCard({ title, icon, href }: WarrantyCardProps) {
  return (
    <Link
      href={href}
      className="group block bg-[#f5f5f5] rounded-lg p-8 md:p-10 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#333333] flex items-center justify-center text-white mb-2">
          {icon}
        </div>
        <h3 className="text-[#1a1a1a] text-xl md:text-2xl font-bold font-['Onest']">
          {title}
        </h3>
        <span className="inline-flex items-center gap-2 text-[#0166a5] font-medium text-sm md:text-base font-['Space_Grotesk'] group-hover:underline">
          Read More
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
