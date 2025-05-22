import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";


// Protected Pages
import Dashboard from "./pages/Dashboard";
import Tools from "./pages/Tools";
import Notes from "./pages/Notes";
import Focus from "./pages/Focus";
import Profile from "./pages/Profile";
import Todolist from "./pages/Todolist"; // Added Todolist import
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/Auth/login"; // Import the AuthPage component
import ForgotPassword from "./pages/Auth/forgotpassword"; // Import the ForgotPassword component

// Tool Pages
import Summarizer from "./pages/tools/Summarizer";
import DoubtSolver from "./pages/tools/DoubtSolver";
import AnswerSheetAnalyzer from "./pages/tools/AnswerSheetAnalyzer";

import GenerateQuestionPaper from "./pages/tools/GenerateQuestionPaper";
import PremiumChatPage from "./pages/tools/PremiumChatPage"; // Added PremiumChatPage import
 

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<AuthPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Protected Routes */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Tool Routes */}
              <Route 
                path="/tools" 
                element={
                  <ProtectedRoute>
                    <Tools />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tools/summarizer" 
                element={
                  <ProtectedRoute>
                    <Summarizer />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tools/doubt-solver" 
                element={
                  <ProtectedRoute>
                    <DoubtSolver />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tools/answer-sheet-analyzer" 
                element={
                  <ProtectedRoute>
                    <AnswerSheetAnalyzer />
                  </ProtectedRoute>
                } 
              />

              
              <Route 
                path="/tools/generate-question-paper" 
                element={
                  <ProtectedRoute>
                    <GenerateQuestionPaper />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tools/premium-chat"
                element={ 
                  <ProtectedRoute>
                    <PremiumChatPage />
                  </ProtectedRoute>
                }
              />
              
              {/* Protected Routes */}
              <Route 
                path="/tools/notes" 
                element={
                  <ProtectedRoute>
                    <Notes />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/focus" 
                element={
                  <ProtectedRoute>
                    <Focus />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/todolist" 
                element={
                  <ProtectedRoute>
                    <Todolist />
                  </ProtectedRoute>
                } 
              />
              
              {/* Redirect base routes to index */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
