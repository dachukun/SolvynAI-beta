import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Search, PlusCircle, Filter, BarChart3, CalendarIcon, Tag, Palette, Trash2, Edit3, CheckCircle2, Circle } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '../lib/supabase'; // Added Supabase import
import type { User } from '@supabase/supabase-js'; // Added User type import

interface Task {
  id: string;
  user_id: string; // Added user_id
  text: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  tags?: string[];
  due_date?: string; // Changed from Date to string (ISO format for Supabase)
  completed: boolean;
  created_at: string; // Changed from Date to string (ISO format for Supabase)
  updated_at: string; // Added updated_at
}

const Todolist = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<User | null>(null); // Added user state
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTaskCategory, setNewTaskCategory] = useState('');
  const [newTaskTags, setNewTaskTags] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState<Date | undefined>();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [showStats, setShowStats] = useState(false); // Added state for stats visibility
  const [showAddTaskForm, setShowAddTaskForm] = useState(false); // Added state for add task form visibility

  const { toast } = useToast();

  // Load user and tasks from Supabase on mount
  useEffect(() => {
    const fetchUserAndTasks = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data: fetchedTasks, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching tasks:', error);
          toast({
            title: 'Error fetching tasks',
            description: error.message,
            variant: 'destructive',
          });
          setTasks([]);
        } else if (fetchedTasks) {
          setTasks(fetchedTasks.map(task => ({
            ...task,
            // Ensure dates are handled correctly if they need to be Date objects in the UI
            // For now, we keep them as strings as defined in the interface for Supabase compatibility
            // due_date: task.due_date ? new Date(task.due_date) : undefined, 
            // created_at: new Date(task.created_at),
            // updated_at: new Date(task.updated_at),
          })));
        }
      } else {
        // Handle case where user is not logged in, or redirect
        console.log('No user session found.');
        setTasks([]); // Clear tasks if no user
      }
    };

    fetchUserAndTasks();

    // Listen for auth changes to refetch tasks if user logs in/out
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserAndTasks(); // Re-fetch tasks for the new user
      } else {
        setTasks([]); // Clear tasks if user logs out
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [toast]);

  // Remove localStorage saving effect
  // useEffect(() => {
  //   localStorage.setItem('todolistTasks', JSON.stringify(tasks));
  // }, [tasks]);

  const handleAddTask = async () => {
    if (!newTaskText.trim()) {
      toast({
        title: 'Task text cannot be empty',
        variant: 'destructive',
      });
      return;
    }
    if (!user) {
      toast({
        title: 'User not authenticated',
        description: 'Please log in to add tasks.',
        variant: 'destructive',
      });
      return;
    }

    const taskToInsert = {
      user_id: user.id,
      text: newTaskText,
      description: newTaskDescription || undefined,
      priority: newTaskPriority,
      category: newTaskCategory || undefined,
      tags: newTaskTags ? newTaskTags.split(',').map(tag => tag.trim()) : undefined,
      due_date: newTaskDueDate ? newTaskDueDate.toISOString() : undefined,
      // completed is false by default in DB
      // created_at and updated_at are set by DB
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert([taskToInsert])
      .select()
      .single(); // Assuming you want the newly created task back

    if (error) {
      console.error('Error adding task:', error);
      toast({
        title: 'Error adding task',
        description: error.message,
        variant: 'destructive',
      });
    } else if (data) {
      setTasks(prevTasks => [data as Task, ...prevTasks]);
      setNewTaskText('');
      setNewTaskDescription('');
      setNewTaskPriority('medium');
      setNewTaskCategory('');
      setNewTaskTags('');
      setNewTaskDueDate(undefined);
      toast({
        title: 'Task Added',
        description: `"${data.text}" has been added to your list.`,
      });
    }
  };

  const toggleTaskCompletion = async (taskId: string) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (!taskToUpdate) return;

    const newCompletedStatus = !taskToUpdate.completed;

    const { data, error } = await supabase
      .from('tasks')
      .update({ completed: newCompletedStatus, updated_at: new Date().toISOString() })
      .eq('id', taskId)
      .select()
      .single();

    if (error) {
      console.error('Error updating task:', error);
      toast({
        title: 'Error updating task',
        description: error.message,
        variant: 'destructive',
      });
    } else if (data) {
      setTasks(
        tasks.map(task =>
          task.id === taskId ? { ...task, completed: data.completed, updated_at: data.updated_at } : task
        )
      );
    }
  };

  const deleteTask = async (taskId: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Error deleting task',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setTasks(tasks.filter(task => task.id !== taskId));
      toast({
        title: 'Task Deleted',
        variant: 'default', // Changed from destructive to default for successful deletion
      });
    }
  };
  
  // Placeholder for edit functionality - will also need Supabase integration
  const editTask = (task: Task) => {
    // For now, just log to console. Implement modal or inline editing later.
    console.log('Editing task (Supabase integration needed):', task);
    toast({
        title: 'Edit Task',
        description: 'Edit functionality (with Supabase) is not yet fully implemented.',
    });
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.text.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (task.category && task.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (task.tags && task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || (filterStatus === 'active' && !task.completed) || (filterStatus === 'completed' && task.completed);
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const stats = {
    activeTasks: tasks.filter(task => !task.completed).length,
    highPriorityTasks: tasks.filter(task => task.priority === 'high' && !task.completed).length,
    dueToday: tasks.filter(task => task.due_date && format(new Date(task.due_date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && !task.completed).length,
    completedTasks: tasks.filter(task => task.completed).length,
  };

  return (
    <div className="solvynai-page p-4 md:p-6 lg:p-8">
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-lg">
            <CheckCircle2 className="text-primary" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">My Todolist</h1>
            <p className="text-muted-foreground">Organize your tasks and boost productivity.</p>
          </div>
        </div>
      </header>

      {/* Filters, Search, and Stats Toggle Section */}
      <Card className="mb-6">
        <CardContent className="pt-4 flex flex-col sm:flex-row gap-2 items-center">
          <div className="relative flex-grow w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
          <Select value={filterPriority} onValueChange={(value: 'all' | 'low' | 'medium' | 'high') => setFilterPriority(value)}>
            <SelectTrigger className="w-full sm:w-auto h-9 text-sm">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={(value: 'all' | 'active' | 'completed') => setFilterStatus(value)}>
            <SelectTrigger className="w-full sm:w-auto h-9 text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => setShowAddTaskForm(!showAddTaskForm)} className="h-9 text-sm w-full sm:w-auto">
            <PlusCircle size={16} className="mr-1.5" />
            {showAddTaskForm ? 'close Add Task' : 'Add Task'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowStats(!showStats)} className="h-9 text-sm w-full sm:w-auto">
            <BarChart3 size={16} className="mr-1.5" />
            {showStats ? 'Hide Stats' : 'Show Stats'}
          </Button>
        </CardContent>
      </Card>

      {/* Add Task Section */}
      {showAddTaskForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><PlusCircle size={22}/> Add New Task</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input 
            placeholder="Enter task title (e.g., Finish project report)"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
          />
          <Textarea 
            placeholder="Add a description (optional)"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            className="min-h-[80px]"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Priority</label>
              <Select value={newTaskPriority} onValueChange={(value: 'low' | 'medium' | 'high') => setNewTaskPriority(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low"><span className="flex items-center"><Palette size={14} className="mr-2 text-green-500"/>Low</span></SelectItem>
                  <SelectItem value="medium"><span className="flex items-center"><Palette size={14} className="mr-2 text-yellow-500"/>Medium</span></SelectItem>
                  <SelectItem value="high"><span className="flex items-center"><Palette size={14} className="mr-2 text-red-500"/>High</span></SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Category (Optional)</label>
              <Input 
                placeholder="e.g., Work, Personal"
                value={newTaskCategory}
                onChange={(e) => setNewTaskCategory(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Tags (Optional, comma-separated)</label>
              <Input 
                placeholder="e.g., urgent, project-x"
                value={newTaskTags}
                onChange={(e) => setNewTaskTags(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Due Date (Optional)</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal ${!newTaskDueDate && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newTaskDueDate ? format(newTaskDueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newTaskDueDate}
                    onSelect={setNewTaskDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <Button onClick={handleAddTask} className="w-full sm:w-auto"><PlusCircle size={18} className="mr-2"/>Add Task</Button>
        </CardContent>
      </Card>
      )}

      {/* Stats Section (conditionally rendered) */}
      {showStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{stats.activeTasks}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              <Palette className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{stats.highPriorityTasks}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Due Today</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{stats.dueToday}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{stats.completedTasks}</div></CardContent>
          </Card>
        </div>
      )}

      {/* Tasks View Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Tasks ({filteredTasks.length})</CardTitle>
          <CardDescription>Manage your daily to-dos effectively.</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTasks.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No tasks found. Try adjusting your filters or add a new task!</p>
          ) : (
            <ul className="space-y-3">
              {filteredTasks.map(task => (
                <li key={task.id} className={`p-4 border rounded-lg flex items-start gap-4 ${task.completed ? 'bg-muted/50 opacity-70' : 'bg-card'}`}>
                  <Checkbox 
                    checked={task.completed}
                    onCheckedChange={() => toggleTaskCompletion(task.id)}
                    className="mt-1"
                    id={`task-${task.id}`}
                  />
                  <div className="flex-grow">
                    <label htmlFor={`task-${task.id}`} className={`font-medium cursor-pointer ${task.completed ? 'line-through text-muted-foreground' : ''}`}>{task.text}</label>
                    {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span className={`px-2 py-0.5 rounded-full text-white text-xs ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                      {task.category && <span className="flex items-center gap-1"><Tag size={12}/> {task.category}</span>}
                      {task.due_date && <span className="flex items-center gap-1"><CalendarIcon size={12}/> {format(new Date(task.due_date), "MMM d, yyyy")}</span>}
                      {task.tags && task.tags.map(tag => <span key={tag} className="bg-secondary px-1.5 py-0.5 rounded">#{tag}</span>)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => editTask(task)} className="text-muted-foreground hover:text-primary">
                        <Edit3 size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)} className="text-muted-foreground hover:text-destructive">
                        <Trash2 size={16} />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Todolist;