import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  User,
  Focus,
  Settings,
  ChevronUp,
  ChevronDown,
  AlignLeft,
  FileText,
  FileSearch,
  HelpCircle,
  MessageSquare, // Changed from MessageCircle to MessageSquare for consistency
  FilePen,
  BrainCircuit,
  CircuitBoard,
  LayoutDashboard,
  Star,
  FilePlus2 // Added FilePlus2 for AI Document Creator
} from "lucide-react";
import { cn } from "@/lib/utils";

const aiTools = [
  { to: "/tools/summarizer", icon: AlignLeft, label: "Summarizer" },
  { to: "/tools/generate-question-paper", icon: FileText, label: "Practice Paper Generator" },
  { to: "/tools/answer-sheet-analyzer", icon: FileSearch, label: "Answer Sheet Analyzer" },
  { to: "/tools/doubt-solver", icon: HelpCircle, label: "Doubt Solver" },
  { to: "/tools/notes", icon: FilePen, label: "Notes" },
  { to: "/tools/premium-chat", icon: MessageSquare, label: "Premium Chat" },
  { to: "/tools/ai-document-creator", icon: FilePlus2, label: "AI Doc Creator" },
];

const BottomNavbar = () => {
  const [showAiTools, setShowAiTools] = useState(false);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg flex md:hidden">
      <NavLink
        to="/"
        className={({ isActive }) =>
          cn(
            "flex-1 flex flex-col items-center justify-center py-2 transition-colors",
            isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
          )
        }
      >
        <LayoutDashboard size={24} />
        <span className="text-xs mt-1">Dashboard</span>
      </NavLink>
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          cn(
            "flex-1 flex flex-col items-center justify-center py-2 transition-colors",
            isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
          )
        }
      >
        <User size={24} />
        <span className="text-xs mt-1">Profile</span>
      </NavLink>
      <NavLink
        to="/focus"
        className={({ isActive }) =>
          cn(
            "flex-1 flex flex-col items-center justify-center py-2 transition-colors",
            isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
          )
        }
      >
        <Focus size={24} />
        <span className="text-xs mt-1">Focus</span>
      </NavLink>
      <button
        className="flex-1 flex flex-col items-center justify-center py-2 focus:outline-none relative"
        onClick={() => setShowAiTools((prev) => !prev)}
        aria-expanded={showAiTools}
        aria-controls="ai-tools-menu"
      >
        <Star size={24} />
        <span className="text-xs mt-1">AI Tools</span>
        {showAiTools ? (
          <ChevronDown size={16} className="absolute top-1 right-2 text-muted-foreground" />
        ) : (
          <ChevronUp size={16} className="absolute top-1 right-2 text-muted-foreground" />
        )}
      </button>
      {/* AI Tools Rollup */}
      {showAiTools && (
        <div
          id="ai-tools-menu"
          className="absolute bottom-14 left-0 right-0 mx-2 bg-background border rounded-xl shadow-xl p-2 flex flex-wrap gap-2 animate-fade-in"
        >
          {aiTools.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-colors",
                  isActive ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground"
                )
              }
              onClick={() => setShowAiTools(false)}
            >
              <Icon size={22} />
              <span className="text-[10px] mt-1 text-center leading-tight">{label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};

export default BottomNavbar;