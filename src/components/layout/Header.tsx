import { Bell, Settings } from "lucide-react";

interface HeaderProps {
  onProfileClick: () => void;
  onNotificationsClick: () => void;
  onSettingsClick: () => void;
}

export function Header({ onProfileClick, onNotificationsClick, onSettingsClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#121212]/80 backdrop-blur-md pt-[calc(1rem+env(safe-area-inset-top))]">
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center bg-gradient-to-br from-primary to-emerald-400 rounded-xl size-10 shadow-lg shadow-primary/30">
          {/* Animal paw SVG icon */}
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-6 text-black">
            <ellipse cx="7" cy="5.5" rx="2" ry="2.5" />
            <ellipse cx="12" cy="4" rx="2" ry="2.5" />
            <ellipse cx="17" cy="5.5" rx="2" ry="2.5" />
            <ellipse cx="5" cy="10" rx="2" ry="2.5" />
            <path d="M8 14c0-2 2-4 4-4s4 2 4 4c0 3-2 5-4 6-2-1-4-3-4-6z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tighter text-white leading-none">Osteodio</h1>
          <p className="text-[10px] text-primary/80 font-medium tracking-widest uppercase leading-none mt-0.5">Ostéopathie animale</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-white">
        <button 
          onClick={onNotificationsClick} 
          className="p-2 rounded-full hover:bg-primary/20 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="size-6" />
        </button>
        <button 
          onClick={onSettingsClick} 
          className="p-2 rounded-full hover:bg-primary/20 transition-colors"
          aria-label="Settings"
        >
          <Settings className="size-6" />
        </button>
      </div>
    </header>
  );
}
