import { RequestHandler } from "express";
import { Task, CreateTaskRequest, UpdateTaskRequest } from "@shared/auth";

// In-memory storage for demo purposes
const tasks: Task[] = [
  {
    id: "task-1",
    title: "Welcome to Task Manager",
    description: "This is your first task! Try marking it as complete.",
    completed: false,
    priority: "medium",
    userId: "demo-user-1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "task-2",
    title: "Explore the features",
    description: "Check out task creation, editing, and filtering options.",
    completed: false,
    priority: "high",
    userId: "demo-user-1",
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
  },
];

export const getTasks: RequestHandler = (req, res) => {
  try {
    const user = (req as any).user;
    const userTasks = tasks
      .filter((task) => task.userId === user.id)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

    res.json(userTasks);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createTask: RequestHandler = (req, res) => {
  try {
    const user = (req as any).user;
    const { title, description, priority }: CreateTaskRequest = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      description,
      completed: false,
      priority: priority || "medium",
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateTask: RequestHandler = (req, res) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    const updates: UpdateTaskRequest = req.body;

    const taskIndex = tasks.findIndex(
      (task) => task.id === id && task.userId === user.id,
    );
    if (taskIndex === -1) {
      return res.status(404).json({ error: "Task not found" });
    }

    const task = tasks[taskIndex];
    const updatedTask: Task = {
      ...task,
      ...updates,
      updatedAt: new Date(),
    };

    tasks[taskIndex] = updatedTask;
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteTask: RequestHandler = (req, res) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;

    const taskIndex = tasks.findIndex(
      (task) => task.id === id && task.userId === user.id,
    );
    if (taskIndex === -1) {
      return res.status(404).json({ error: "Task not found" });
    }

    tasks.splice(taskIndex, 1);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
