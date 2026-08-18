/**
 * Format currency strictly in Moroccan Dirham (MAD / DH)
 * @param amount - Numeric value in MAD
 * @returns Formatted string with DH suffix (e.g. "50 DH", "2,000 DH")
 */
export function formatMAD(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0 DH';
  }
  const formatted = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(amount);
  return `${formatted} DH`;
}

/**
 * Format ISO date string into readable schedule format
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return 'TBD';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return 'TBD';
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Clean status badges with high-contrast matte colors
 */
export function getStatusBadge(status: string) {
  switch (status) {
    case 'LIVE':
      return { 
        label: 'LIVE', 
        class: 'bg-rose-950/60 text-rose-400 border border-rose-800/80 font-bold',
        dot: 'bg-rose-500 animate-ping' 
      };
    case 'REGISTRATION_OPEN':
      return { 
        label: 'REGISTRATION OPEN', 
        class: 'bg-orange-950/50 text-brand-orange border border-brand-dark/60 font-semibold',
        dot: 'bg-brand-orange' 
      };
    case 'REGISTRATION_CLOSED':
      return { 
        label: 'REGISTRATION CLOSED', 
        class: 'bg-surface-100 text-gray-400 border border-border font-medium',
        dot: 'bg-gray-500' 
      };
    case 'CHECK_IN':
      return { 
        label: 'CHECK-IN OPEN', 
        class: 'bg-amber-950/50 text-amber-400 border border-amber-800/60 font-semibold',
        dot: 'bg-amber-400' 
      };
    case 'COMPLETED':
      return { 
        label: 'COMPLETED', 
        class: 'bg-surface-100 text-gray-400 border border-border font-medium',
        dot: 'bg-gray-500' 
      };
    case 'CANCELLED':
      return { 
        label: 'CANCELLED', 
        class: 'bg-rose-950/30 text-rose-500 border border-rose-900/50 font-medium',
        dot: 'bg-rose-600' 
      };
    case 'DRAFT':
    default:
      return { 
        label: 'UPCOMING', 
        class: 'bg-surface-100 text-gray-300 border border-border font-medium',
        dot: 'bg-gray-400' 
      };
  }
}
