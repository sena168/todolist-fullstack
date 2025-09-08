// Simple todos API endpoint for Vercel
const { v4: uuid } = require('uuid');

// In-memory data storage
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
    title: 'Click the checkbox to mark as complete',
    completed: false,
    date: new Date().toISOString(),
    priority: 'LOW',
  },
  {
    id: uuid(),
    title: 'Add new tasks with the + button',
    completed: false,
    date: new Date().toISOString(),
    priority: 'HIGH',
  },
];

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // Handle query parameters for filtering
    const {
      completed,
      priority,
      dateGte,
      dateLte,
      page = 1,
      limit = 10,
      sort = 'date',
      order = 'asc',
      search,
    } = req.query;

    let filteredTodos = [...todos];

    // Apply filters
    if (completed === 'true') filteredTodos = filteredTodos.filter(t => t.completed);
    else if (completed === 'false') filteredTodos = filteredTodos.filter(t => !t.completed);

    if (priority && ['LOW', 'MEDIUM', 'HIGH'].includes(priority)) {
      filteredTodos = filteredTodos.filter(t => t.priority === priority);
    }

    if (dateGte) {
      const d = new Date(dateGte);
      filteredTodos = filteredTodos.filter(t => new Date(t.date) >= d);
    }

    if (dateLte) {
      const d = new Date(dateLte);
      filteredTodos = filteredTodos.filter(t => new Date(t.date) <= d);
    }

    if (search) {
      const searchTerm = search.toLowerCase();
      filteredTodos = filteredTodos.filter(t => t.title.toLowerCase().includes(searchTerm));
    }

    // Sort
    const prioOrder = { LOW: 1, MEDIUM: 2, HIGH: 3 };
    filteredTodos.sort((a, b) => {
      let aValue, bValue;
      
      if (sort === 'priority') {
        aValue = prioOrder[a.priority];
        bValue = prioOrder[b.priority];
      } else if (sort === 'date') {
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
      } else {
        aValue = a[sort];
        bValue = b[sort];
      }

      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });

    // Paginate
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;

    const paginated = filteredTodos.slice(startIndex, endIndex);
    const totalTodos = filteredTodos.length;
    const hasNextPage = endIndex < totalTodos;
    const nextPage = hasNextPage ? pageNum + 1 : null;

    res.status(200).json({ todos: paginated, totalTodos, hasNextPage, nextPage });
  }
  
  else if (req.method === 'POST') {
    const { title, completed = false, date, priority = 'MEDIUM' } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newTodo = {
      id: uuid(),
      title,
      completed,
      date: date || new Date().toISOString(),
      priority,
    };

    todos.push(newTodo);
    res.status(201).json(newTodo);
  }
  
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}