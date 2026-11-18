import type { CSSProperties } from 'react';

export default function BrandLogo({ compact = false, light = false }: { compact?: boolean; light?: boolean }) {
  return (
    <span className="bb-brand" style={{ '--bb-logo-color': light ? '#FFFFFF' : 'var(--text-main)' } as CSSProperties}>
      <svg className="bb-brand-symbol" viewBox="0 0 48 48" role="img" aria-label="Symbole BabyBudget">
        <rect width="48" height="48" rx="15" fill="#16443D" />
        <path d="M12 29.5C16 22 21 27.5 25.5 20.5C29 15.5 33 18 36 13" fill="none" stroke="#F5F7EF" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12.5 36H35.5" stroke="#B9D8C3" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="35.5" cy="12.5" r="4.1" fill="#EBA28B" />
      </svg>
      {!compact && <span className="bb-brand-word">Baby<span>Budget</span></span>}
    </span>
  );
}
