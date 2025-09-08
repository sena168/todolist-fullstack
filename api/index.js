// Simple working API for Vercel
const { v4: uuid } = require('uuid');

// In-memory todos storage
let todos = [
  {
    id: uuid(),
    title: 'Welcome to your TodoList!',
    completed: false,
    date: new Date().toISOString(),
    priority: 'MEDIUM',
  },
  {
    id: uuid(),
    title: 'Click to mark tasks complete',
    completed: false,
    date: new Date().toISOString(),
    priority: 'LOW',
  },
  {
    id: uuid(),
    title: 'Your app is now live 24/7!',
    completed: true,
    date: new Date().toISOString(),
    priority: 'HIGH',
  },
];

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { method } = req;
  
  if (method === 'GET') {
    // Simple GET todos
    const { completed, priority, search, page = 1, limit = 10 } = req.query;
    
    let filteredTodos = [...todos];

    // Apply filters
    if (completed === 'true') {
      filteredTodos = filteredTodos.filter(t => t.completed);
    } else if (completed === 'false') {
      filteredTodos = filteredTodos.filter(t => !t.completed);
    }

    if (priority) {
      filteredTodos = filteredTodos.filter(t => t.priority === priority);
    }

    if (search) {
      filteredTodos = filteredTodos.filter(t =>
        t.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort by date (newest first)
    filteredTodos.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Paginate
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    
    const paginatedTodos = filteredTodos.slice(startIndex, endIndex);
    const totalTodos = filteredTodos.length;
    const hasNextPage = endIndex < totalTodos;

    return res.status(200).json({
      todos: paginatedTodos,
      totalTodos,
      hasNextPage,
      nextPage: hasNextPage ? pageNum + 1 : null
    });
  }
  
  if (method === 'POST') {
    const { title, completed = false, priority = 'MEDIUM' } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newTodo = {
      id: uuid(),
      title: title.trim(),
      completed,
      date: new Date().toISOString(),
      priority,
    };

    todos.unshift(newTodo); // Add to beginning
    return res.status(201).json(newTodo);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}