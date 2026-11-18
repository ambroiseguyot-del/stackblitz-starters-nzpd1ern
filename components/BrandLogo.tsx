import Image from 'next/image';
import type { CSSProperties } from 'react';

export default function BrandLogo({ compact = false, light = false }: { compact?: boolean; light?: boolean }) {
  return (
    <span className="bb-brand" style={{ '--bb-logo-color': light ? '#FFFFFF' : 'var(--text-main)' } as CSSProperties}>
      <Image className="bb-brand-symbol" src="/brand-symbol.svg" alt="" aria-hidden="true"
        width={48} height={48} unoptimized priority />
      {!compact && <span className="bb-brand-word">Baby <span>Budget</span></span>}
    </span>
  );
}
