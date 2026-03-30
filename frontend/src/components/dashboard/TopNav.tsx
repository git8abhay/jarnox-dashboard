import { BarChart3, GitCompare, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

interface TopNavProps {
  activeView: "overview" | "compare";
  onViewChange: (view: "overview" | "compare") => void;
}

const tabs = [
  { id: "overview" as const, label: "Market Overview", icon: BarChart3 },
  { id: "compare" as const, label: "Compare", icon: GitCompare },
];

const TopNav = ({ activeView, onViewChange }: TopNavProps) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand text */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-foreground">
              Jarnox
            </span>
            <span className="text-xs font-medium text-brand-red uppercase tracking-[0.15em]">
              Intelligence
            </span>
          </div>

          {/* Tab navigation */}
          <nav className="flex items-center gap-1 bg-muted rounded-xl p-1">
            {tabs.map((tab) => {
              const active = activeView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onViewChange(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Theme toggle + Status */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-muted hover:bg-accent transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4 text-foreground" />
              ) : (
                <Sun className="w-4 h-4 text-foreground" />
              )}
            </button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-trend-up animate-pulse" />
              <span className="hidden sm:inline">Live</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
