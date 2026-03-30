import { ReactNode } from "react";
import TopNav from "./TopNav";

interface DashboardLayoutProps {
  children: ReactNode;
  activeView: "overview" | "compare";
  onViewChange: (view: "overview" | "compare") => void;
}

const DashboardLayout = ({ children, activeView, onViewChange }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen page-bg">
      <TopNav activeView={activeView} onViewChange={onViewChange} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
