import Image from 'next/image';

export default function BrandLogo({ compact = false, light = false }: { compact?: boolean; light?: boolean }) {
  return (
    <span className={`bb-brand bb-brand-authentic${light ? ' bb-brand-on-dark' : ''}`} role="img" aria-label="Baby Budget">
      <span className="bb-brand-icons" aria-hidden="true">
        <Image className="bb-brand-symbol bb-brand-logo-light" src="/brand-symbol.svg" alt="" width={200} height={185} unoptimized priority />
        <Image className="bb-brand-symbol bb-brand-logo-dark" src="/brand-symbol-dark.svg" alt="" width={200} height={185} unoptimized priority />
      </span>
      {!compact && <span className="bb-brand-words" aria-hidden="true">
        <Image className="bb-brand-wordmark bb-brand-logo-light" src="/brand-wordmark.svg" alt="" width={347} height={63} unoptimized priority />
        <Image className="bb-brand-wordmark bb-brand-logo-dark" src="/brand-wordmark-dark.svg" alt="" width={347} height={63} unoptimized priority />
      </span>}
    </span>
  );
}
