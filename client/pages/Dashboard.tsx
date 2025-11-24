import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Task, CreateTaskRequest } from "@shared/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plus, LogOut, Trash2, X, PanelLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");
  const [priorityFilter, setPriorityFilter] = useState<
    "all" | "low" | "medium" | "high"
  >("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<CreateTaskRequest>({
    title: "",
    description: "",
    priority: "medium",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const tasksData = await response.json();
        setTasks(tasksData);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTask = async () => {
    if (!newTask.title.trim()) return;

    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        const createdTask = await response.json();
        setTasks((prev) => [createdTask, ...prev]);
        setNewTask({ title: "", description: "", priority: "medium" });
        setIsCreateDialogOpen(false);
        toast({
          title: "Success",
          description: "Task created successfully",
        });
      }
    } catch (error) {
      console.error("Failed to create task:", error);
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    }
  };

  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks((prev) =>
          prev.map((task) => (task.id === taskId ? updatedTask : task)),
        );
      }
    } catch (error) {
      console.error("Failed to update task:", error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
        toast({
          title: "Success",
          description: "Task deleted successfully",
        });
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed" && !task.completed) return false;
    if (filter === "pending" && task.completed) return false;
    if (priorityFilter !== "all" && task.priority !== priorityFilter)
      return false;
    return true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh w-full text-slate-900">
      <SidebarProvider defaultOpen>
        <Sidebar className="hidden border-r bg-slate-50 md:flex flex-col">
          <SidebarHeader className="flex items-center justify-center p-4">
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <img src="/src/assets/logo.png" className="w-6" alt="MapleHR" />
              MapleHR
            </h1>
            <SidebarTrigger />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/employees">
                      <span>Employees</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#">
                      <span>Access</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <Button variant="ghost" className="w-full justify-start" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
          <header className="bg-white shadow-sm border-b border-green-200 sticky top-0 z-10 flex h-14 items-center justify-between gap-4 px-4">
            <div className="flex items-center gap-4">
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <PanelLeft />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-64 p-0">
                    <div className="flex h-full flex-col">
                      <SheetHeader className="flex items-center justify-between p-4">
                        <h1 className="text-xl">MapleHR</h1>
                        <SheetClose className="h-7 w-7 p-1">
                          <X className="h-5 w-5" />
                        </SheetClose>
                      </SheetHeader>
                      <div className="flex flex-1 flex-col overflow-y-auto">
                        <SidebarContent>
                          <SidebarGroup>
                            <SidebarGroupLabel>Menu</SidebarGroupLabel>
                            <SidebarMenu>
                              <SidebarMenuItem>
                                <SidebarMenuButton isActive>
                                  <span>Dashboard</span>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                              <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                  <a href="/employees">
                                    <span>Employees</span>
                                  </a>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                              <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                  <a href="#">
                                    <span>Access</span>
                                  </a>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            </SidebarMenu>
                          </SidebarGroup>
                        </SidebarContent>
                      </div>
                      <SidebarFooter className="p-4 border-t">
                        <Button variant="ghost" className="w-full justify-start" onClick={logout}>
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </SidebarFooter>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              <h1 className="text-2xl font-bold text-green-800">Task Manager</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col text-right text-sm">
                <span className="font-semibold">Mary Williams</span>
                <span className="text-muted-foreground">Welcome back!</span>
              </div>
              <Button variant="outline" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </header>
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                    <DialogDescription>
                      Add a new task to your list
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newTask.title}
                        onChange={(e) =>
                          setNewTask((prev) => ({ ...prev, title: e.target.value }))
                        }
                        placeholder="Enter task title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newTask.description}
                        onChange={(e) =>
                          setNewTask((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Enter task description (optional)"
                      />
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={newTask.priority}
                        onValueChange={(value: "low" | "medium" | "high") =>
                          setNewTask((prev) => ({ ...prev, priority: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={createTask}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      Create Task
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <div className="flex gap-2">
                <Select
                  value={filter}
                  onValueChange={(value: any) => setFilter(value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tasks</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={priorityFilter}
                  onValueChange={(value: any) => setPriorityFilter(value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredTasks.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">
                      No tasks found. Create your first task!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredTasks.map((task) => (
                  <Card
                    key={task.id}
                    className={task.completed ? "opacity-75" : ""}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={(checked) =>
                              toggleTaskCompletion(task.id, checked as boolean)
                            }
                            className="mt-1"
                          />
                          <div>
                            <CardTitle
                              className={`text-lg ${task.completed ? "line-through" : ""}`}
                            >
                              {task.title}
                            </CardTitle>
                            {task.description && (
                              <CardDescription className="mt-1">
                                {task.description}
                              </CardDescription>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTask(task.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              )}
            </div>
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}
