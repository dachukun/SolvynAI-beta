
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Added Input
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, RotateCcw, ListChecks } from "lucide-react"; // Added ListChecks
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from '../lib/supabase'; // Added Supabase import
import type { User } from '@supabase/supabase-js'; // Added User type import
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const FOCUS_TIMES = [
  { value: "10", label: "10 minutes" },
  { value: "25", label: "25 minutes" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "60 minutes" },
];

// Define Task interface (similar to Todolist.tsx)
interface Task {
  id: string;
  user_id: string;
  text: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  tags?: string[];
  due_date?: string; 
  completed: boolean;
  created_at: string; 
  updated_at: string;
}

const Focus = () => {
  const [selectedTime, setSelectedTime] = useState("25");
  const [timeRemaining, setTimeRemaining] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [treeHeight, setTreeHeight] = useState(0);

  // New state variables for Todolist integration
  const [user, setUser] = useState<User | null>(null);
  const [todoTasks, setTodoTasks] = useState<Task[]>([]);
  const [currentTaskText, setCurrentTaskText] = useState("");
  const [selectedTodoTaskId, setSelectedTodoTaskId] = useState<string | null>(null);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  // Use authUser from context, fallback to user state if needed (though context should be primary)
  const currentUser = authUser || user;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  
  const totalSeconds = parseInt(selectedTime) * 60;
  const progress = ((totalSeconds - timeRemaining) / totalSeconds) * 100;
  
  useEffect(() => {
    setTimeRemaining(parseInt(selectedTime) * 60);
  }, [selectedTime]);

  // Effect to fetch user and tasks
  useEffect(() => {
    const fetchUserAndTasks = async () => {
      setIsLoadingTasks(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data: fetchedTasks, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('completed', false) // Only fetch active tasks
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching tasks:', error);
          toast.error('Error fetching tasks', { description: error.message });
          setTodoTasks([]);
        } else if (fetchedTasks) {
          setTodoTasks(fetchedTasks as Task[]);
        }
      } else {
        setUser(null);
        setTodoTasks([]);
      }
      setIsLoadingTasks(false);
    };

    fetchUserAndTasks();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchUserAndTasks(); // Re-fetch tasks for the new user or on auth change
      } else {
        setTodoTasks([]); // Clear tasks if user logs out
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []); // Run once on mount and on auth changes
  
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          const updated = prev - 1;
          
          const newTreeHeight = ((totalSeconds - updated) / totalSeconds) * 100;
          setTreeHeight(newTreeHeight);
          
          return updated;
        });
      }, 1000);
    } else if (timeRemaining === 0 && isActive) { // Ensure isActive is true to prevent multiple triggers
      setIsActive(false); // Stop the timer first
      toast.success("Focus session completed!", {
        description: `Great job! You've completed a ${selectedTime} minute session.`
      });

      // Mark Todolist task as complete if selected
      if (selectedTodoTaskId) {
        const completeTask = async () => {
          const { error } = await supabase
            .from('tasks')
            .update({ completed: true, updated_at: new Date().toISOString() })
            .eq('id', selectedTodoTaskId);

          if (error) {
            console.error('Error completing task:', error);
            toast.error('Failed to mark task as complete.', { description: error.message });
          } else {
            toast.success('Task marked as complete!', { description: todoTasks.find(t => t.id === selectedTodoTaskId)?.text });
            // Refresh tasks or remove the completed one from the list
            setTodoTasks(prevTasks => prevTasks.filter(task => task.id !== selectedTodoTaskId));
            setSelectedTodoTaskId(null);
            setCurrentTaskText(""); // Clear text field as well
          }
        };
        completeTask();
      }
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeRemaining, selectedTime, totalSeconds, selectedTodoTaskId, todoTasks]);
  
  const toggleTimer = () => {
    setIsActive(!isActive);
  };
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeRemaining(parseInt(selectedTime) * 60);
    setTreeHeight(0);
    setCurrentTaskText("");
    setSelectedTodoTaskId(null);
  };

  return (
    <div className="solvynai-page">
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Focus Mode</h1>
          <p className="text-muted-foreground mt-1">
            Stay productive with timed focus sessions
        </p>
        </div>
        <div className="cursor-pointer" onClick={() => navigate('/profile')}>
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt={currentUser?.email || "User"} />
            <AvatarFallback>
              {currentUser?.email?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Pomodoro Timer</CardTitle>
              <CardDescription>
                Select your desired focus time. What are you working on?
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-full">
              <div className="w-full max-w-md space-y-6"> {/* Adjusted space-y */} 
                {/* Task Input Section */}
                <div className="space-y-2">
                  <Input 
                    placeholder="What are you working on? (Optional)"
                    value={currentTaskText}
                    onChange={(e) => {
                      setCurrentTaskText(e.target.value);
                      if (selectedTodoTaskId) setSelectedTodoTaskId(null); // Clear selection if typing
                    }}
                    disabled={isActive}
                  />
                  {user && (
                    <Select
                      value={selectedTodoTaskId || ""}
                      onValueChange={(value) => {
                        setSelectedTodoTaskId(value || null);
                        const selectedTask = todoTasks.find(task => task.id === value);
                        setCurrentTaskText(selectedTask ? selectedTask.text : "");
                      }}
                      disabled={isActive || isLoadingTasks}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={isLoadingTasks ? "Loading tasks..." : "Or pick from your Todolist"} />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingTasks ? (
                          <SelectItem value="loading" disabled>Loading...</SelectItem>
                        ) : todoTasks.length > 0 ? (
                          todoTasks.map((task) => (
                            <SelectItem key={task.id} value={task.id}>
                              {task.text}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-tasks" disabled>No active tasks in Todolist</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <Select
                  value={selectedTime}
                  onValueChange={(value) => {
                    if (!isActive) {
                      setSelectedTime(value);
                    }
                  }}
                  disabled={isActive}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select focus time" />
                  </SelectTrigger>
                  <SelectContent>
                    {FOCUS_TIMES.map((time) => (
                      <SelectItem key={time.value} value={time.value}>
                        {time.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="flex flex-col items-center space-y-4">
                  <div className="text-6xl font-mono font-semibold">
                    {formatTime(timeRemaining)}
                  </div>
                  <Progress value={progress} className="w-full h-2" />
                </div>
                
                <div className="flex justify-center space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={resetTimer}
                    disabled={timeRemaining === parseInt(selectedTime) * 60}
                  >
                    <RotateCcw size={20} />
                  </Button>
                  <Button
                    size="lg"
                    onClick={toggleTimer}
                    className="w-32"
                  >
                    {isActive ? (
                      <>
                        <Pause className="mr-2" size={20} />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="mr-2" size={20} />
                        Start
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Your Tree</CardTitle>
              <CardDescription>
                Your tree grows as you complete focus sessions. Keep focusing to help it flourish!
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center">
              <div className="relative h-64 w-32">
                {/* Tree trunk */}
                <div 
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 bg-solvynai-purple/80 rounded-t-lg animate-grow-tree"
                  style={{ 
                    height: `${Math.max(20, treeHeight * 0.6)}px` 
                  }}
                />
                
                {/* Tree canopy */}
                <div
                  className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-solvynai-soft-purple rounded-full animate-grow-tree"
                  style={{ 
                    opacity: treeHeight > 0 ? 0.2 + (treeHeight / 200) : 0.2,
                    transform: `translateY(${100 - treeHeight}px) scale(${0.5 + (treeHeight / 200)})`
                  }}
                />
                
                <div 
                  className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-solvynai-soft-purple rounded-full animate-grow-tree"
                  style={{ 
                    opacity: treeHeight > 30 ? 0.3 + (treeHeight / 200) : 0,
                    transform: `translateY(${Math.max(0, 80 - treeHeight)}px) scale(${0.6 + (treeHeight / 200)})`
                  }}
                />
                
                <div 
                  className="absolute bottom-30 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-solvynai-soft-purple rounded-full animate-grow-tree"
                  style={{ 
                    opacity: treeHeight > 60 ? 0.4 + (treeHeight / 200) : 0,
                    transform: `translateY(${Math.max(0, 60 - treeHeight)}px) scale(${0.7 + (treeHeight / 200)})`
                  }}
                />
                
                {/* Ground */}
                <div className="absolute bottom-0 w-full h-4 bg-solvynai-soft-purple/30 rounded-lg" />
              </div>
              
              <div className="text-center mt-8">
                <p className="text-sm text-muted-foreground">
                  Progress: {Math.min(100, Math.round(treeHeight))}%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Focus;
