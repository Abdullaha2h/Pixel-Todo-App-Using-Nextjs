'use client'

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";

type Todo = {
  _id: string;
  title: string;
  content?: string;
  completed?: boolean;
};

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const router = useRouter();

  // ✅ check auth and fetch todos
  const fetchTodos = async () => {
    try {
      const res = await fetch("/api/todos", { cache: "no-store" });
      if (res.status === 401) {
        setIsAuthenticated(false);
        setTodos([]);
      } else {
        const data = await res.json();
        setIsAuthenticated(true);
        if (Array.isArray(data.todos)) setTodos(data.todos);
        else setTodos([]);
      }
    } catch (err) {
      console.error(err);
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // ✅ add new todo
  const addTodo = async () => {
    if (!newTitle.trim()) return;
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, content: newContent }),
      });
      if (res.ok) {
        const data = await res.json();
        setTodos([data.todo, ...todos]);
        setNewTitle("");
        setNewContent("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });
      if (res.ok) fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
      if (res.ok) setTodos(todos.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo._id);
    setEditTitle(todo.title);
    setEditContent(todo.content || "");
  };

  const saveEdit = async (id: string) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, content: editContent }),
      });
      if (res.ok) {
        const data = await res.json();
        setTodos(todos.map((t) => (t._id === id ? data.todo : t)));
        setEditingId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading todos...</p>;

  // ✅ if not logged in
  if (!isAuthenticated)
    return (
      <div className="flex flex-col items-center justify-center mt-20 space-y-4">
        <p className="text-lg text-muted-foreground">You must be logged in to see your todos.</p>
        <Button onClick={() => router.push("/login")}>Go to Login</Button>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Your Todos</h1>

      {/* Add new todo */}
      <div className="space-y-2 mb-6">
        <Input
          placeholder="Todo title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <Textarea
          placeholder="Todo content (optional)"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
        />
        <Button onClick={addTodo} className="w-full">Add Todo</Button>
      </div>

      {/* Todos list */}
      {todos.length > 0 ? (
        todos.map((todo) => (
          <Card key={todo._id} className="shadow">
            <CardContent className="p-4 space-y-2">
              {editingId === todo._id ? (
                <div className="space-y-2">
                  <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                  <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => saveEdit(todo._id)}>
                      <Check className="w-4 h-4 mr-1" /> Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                      <X className="w-4 h-4 mr-1" /> Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div
                    className={`cursor-pointer ${todo.completed ? "line-through text-gray-500" : ""}`}
                    onClick={() => toggleTodo(todo._id, todo.completed ?? false)}
                  >
                    <p className="font-medium">{todo.title}</p>
                    {todo.content && <p className="text-sm text-gray-500">{todo.content}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => startEdit(todo)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteTodo(todo._id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-muted-foreground">No todos yet.</p>
      )}
    </div>
  );
}
