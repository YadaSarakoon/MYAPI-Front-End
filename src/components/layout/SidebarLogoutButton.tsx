import { Button } from '../common/Button';

export function SidebarLogoutButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      className="w-full border-slate-200 bg-slate-100 text-slate-800 font-semibold hover:bg-slate-100 hover:text-slate-800"
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
