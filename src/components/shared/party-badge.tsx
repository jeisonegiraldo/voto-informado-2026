import { Badge } from '@/components/ui/badge';

interface PartyBadgeProps {
  party: string;
  color: string;
}

export function PartyBadge({ party, color }: PartyBadgeProps) {
  return (
    <Badge
      variant="outline"
      className="border-current text-xs"
      style={{ color, borderColor: color }}
    >
      {party}
    </Badge>
  );
}
