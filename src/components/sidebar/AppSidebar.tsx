
import React, { useState } from 'react';
import solvynaiLogoLight from '@/assets/images/SolvynAI logo transparent.png';
import solvynaiLogoDark from '@/assets/images/SolvynAI logo dark transparent.png';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Focus,
  User,
  BrainCircuit, // Changed from Settings
  ListChecks, // For Todolist
  Star,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  AlignLeft, 
  FileText, 
  FileSearch, 
  HelpCircle, 
  MessageCircle, 
  FilePen,
  CircuitBoard,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from "@/components/ui/button";
import { useLocation } from 'react-router-dom';

type SidebarLinkProps = {
  to: string;
  icon: React.ElementType;
  label: string;
  isCollapsed: boolean;
};

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon: Icon, label, isCollapsed }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        "flex items-center py-2.5 rounded-lg transition-colors", // Removed px-3 and gap-3
        isCollapsed ? "justify-center w-full px-0" : "gap-3 px-3", // Conditional classes
        isActive
          ? "text-white bg-primary"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
      end
    >
      <Icon size={24} />
      {!isCollapsed && (
        <span className="font-medium truncate text-xs text-left w-full">{label}</span>
      )}
    </NavLink>
  );
};

type SidebarSectionProps = {
  title: string;
  children: React.ReactNode;
  isCollapsed: boolean;
};

const SidebarSection: React.FC<SidebarSectionProps> = ({ title, children, isCollapsed }) => {
  return (
    <div className="py-1">
      {!isCollapsed && (
        <div className="px-4 py-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
        </div>
      )}
      <div className={cn("space-y-1", isCollapsed ? "px-0" : "px-2")}>{children}</div>
    </div>
  );
};

export const AppSidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const { signOut, user } = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/':
        return 'Dashboard';
      case '/focus':
        return 'Focus';
      case '/todolist':
        return 'Todolist';
      case '/profile':
        return 'Profile';
      case '/tools/summarizer':
        return 'Summarizer';
      case '/tools/generate-question-paper':
        return 'Practice Paper Generator';
      case '/tools/answer-sheet-analyzer':
        return 'Answer Sheet Analyzer';
      case '/tools/doubt-solver':
        return 'Doubt Solver';
      case '/tools/notes':
        return 'Notes';
      case '/tools/premium-chat':
        return 'Premium Chat';
      case '/upgrade':
        return 'Upgrade';
      default:
        return '';
    }
  };

  const currentPageTitle = getPageTitle(location.pathname);

  // If mobile, force sidebar to be collapsed
  const effectiveCollapsed = isMobile ? true : isCollapsed;

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // AI Study Tools links data
  const aiStudyTools = [
    { to: "/tools/summarizer", icon: AlignLeft, label: "Summarizer" },
    { to: "/tools/generate-question-paper", icon: FileText, label: "Practice Paper Generator" },
    { to: "/tools/answer-sheet-analyzer", icon: FileSearch, label: "Answer Sheet Analyzer" },
    { to: "/tools/doubt-solver", icon: HelpCircle, label: "Doubt Solver" },
  ];

  // Other AI Tools links data
  const otherAiTools = [
    
    { to: "/tools/notes", icon: FilePen, label: "Notes" },
    { to: "/tools/premium-chat", icon: BrainCircuit, label: "Premium Chat" },
    
  ];

  return (
    <>
      <aside
        className={cn(
          "h-screen fixed left-0 top-0 z-30 flex flex-col border-r transition-all duration-300 shadow-inner-sidebar",
          "bg-background",
          effectiveCollapsed ? "w-16" : "w-64"
        )}
        style={{ boxShadow: 'inset -8px 0 16px -8px rgba(0,0,0,0.10)' }}
      >
        <div className="flex items-center justify-between px-3">
          {!effectiveCollapsed && (
            <div>
              <img src={solvynaiLogoLight} alt="SolvynAI Logo" className="block dark:hidden h-10 my-4" />
              <img src={solvynaiLogoDark} alt="SolvynAI Logo" className="hidden dark:block h-10 my-4" />
            </div>
          )}
          <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="icon"
            className={cn(
              "ml-auto",
              effectiveCollapsed && "mx-auto"
            )}
          >
            {effectiveCollapsed ? <Menu size={18} /> : <X size={18} />}
          </Button>
        </div>



        <div className="flex-1 overflow-y-auto py-1 no-scrollbar hide-scrollbar">
          <SidebarSection title="Main" isCollapsed={effectiveCollapsed}>
            <SidebarLink to="/" icon={LayoutDashboard} label="Dashboard" isCollapsed={effectiveCollapsed} />
            <SidebarLink to="/focus" icon={Focus} label="Focus" isCollapsed={effectiveCollapsed} />
            <SidebarLink to="/todolist" icon={ListChecks} label="Todolist" isCollapsed={effectiveCollapsed} />
            <SidebarLink to="/profile" icon={User} label="Profile" isCollapsed={effectiveCollapsed} />
            {/* AI Study Tools Section */}
            <SidebarSection title="AI Study Tools" isCollapsed={effectiveCollapsed}>
              {aiStudyTools.map(({ to, icon, label }) => (
                <SidebarLink
                  key={to}
                  to={to}
                  icon={icon}
                  label={label}
                  isCollapsed={effectiveCollapsed}
                />
              ))}
            </SidebarSection>

            {/* Other AI Tools Section */}
            <SidebarSection title="Other AI Tools" isCollapsed={effectiveCollapsed}>
              {otherAiTools.map(({ to, icon, label }) => (
                <SidebarLink
                  key={to}
                  to={to}
                  icon={icon}
                  label={label}
                  isCollapsed={effectiveCollapsed}
                />
              ))}
            </SidebarSection>

          </SidebarSection>

          {/* Removed Personal section as Focus and Profile are now in Main */}
        </div>

        <div className="p-2 border-t">
          <div className={cn(
            "flex flex-col gap-2 items-center py-1",
            effectiveCollapsed ? "" : "flex-row justify-between"
          )}>
            <NavLink
              to="/upgrade"
              className={({ isActive }) => cn(
                "flex items-center gap-2 text-primary font-semibold transition-colors cursor-pointer hover:underline",
                isActive && "underline"
              )}
              style={{ fontSize: effectiveCollapsed ? 0 : 15, padding: effectiveCollapsed ? 0 : undefined }}
            >
              <ArrowUpRight size={20} className="mr-0.5" />
              {!effectiveCollapsed && <span>Upgrade</span>}
            </NavLink>
            <div className={cn(
              "flex gap-1",
              effectiveCollapsed ? "flex-col items-center mt-2" : "ml-2"
            )}>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={toggleTheme}
              >
                {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => signOut()}
              >
                <LogOut size={15} />
              </Button>
            </div>
          </div>
        </div>
      </aside>
      <div className={cn(
        "transition-all duration-300 main-content-shadow",
        effectiveCollapsed ? "ml-16" : "ml-64"
      )} style={{ boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25), 0 1.5px 8px 0 rgba(0,0,0,0.10)' }}>
      </div>
    </>
  );
};
