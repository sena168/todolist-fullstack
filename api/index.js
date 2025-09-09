// Complete CRUD API for Vercel
const { v4: uuidv4 } = require('uuid');
const { kv } = require('@vercel/kv');

// Default todos for initialization
const defaultTodos = [
  {
    id: '1',
    text: 'Learn React',
    completed: false,
    createdAt: new Date('2024-01-01T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-01T10:00:00Z').toISOString(),
    priority: 'medium',
    category: 'learning',
    dueDate: null,
    tags: ['react', 'frontend']
  },
  {
    id: '2',
    text: 'Build a todo app',
    completed: true,
    createdAt: new Date('2024-01-02T14:30:00Z').toISOString(),
    updatedAt: new Date('2024-01-02T16:45:00Z').toISOString(),
    priority: 'high',
    category: 'project',
    dueDate: '2024-01-15T23:59:59Z',
    tags: ['project', 'fullstack']
  },
  {
    id: '3',
    text: 'Deploy to production',
    completed: false,
    createdAt: new Date('2024-01-03T09:15:00Z').toISOString(),
    updatedAt: new Date('2024-01-03T09:15:00Z').toISOString(),
    priority: 'high',
    category: 'deployment',
    dueDate: '2024-01-20T23:59:59Z',
    tags: ['deployment', 'vercel']
  }
];

// Helper functions for KV operations
async function getTodos() {
  try {
    const todos = await kv.get('todos');
    if (!todos || !Array.isArray(todos)) {
      // Initialize with default todos if none exist
      await kv.set('todos', defaultTodos);
      return defaultTodos;
    }
    return todos;
  } catch (error) {
    console.error('Error getting todos from KV:', error);
    return defaultTodos; // Fallback to default todos
  }
}

async function saveTodos(todos) {
  try {
    await kv.set('todos', todos);
    return true;
  } catch (error) {
    console.error('Error saving todos to KV:', error);
    return false;
  }
}

module.exports = async function handler(req, res) {
  // CORS headers - Allow your Vercel frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { method, url } = req;
  console.log(`${method} ${url}`);
  
  // Parse request body for POST/PUT requests
  let body = {};
  if (method === 'POST' || method === 'PUT') {
    if (req.body) {
      body = req.body;
    } else {
      // Parse body from request stream if not already parsed
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const rawBody = Buffer.concat(chunks).toString();
      try {
        body = JSON.parse(rawBody);
      } catch (error) {
        return res.status(400).json({ error: 'Invalid JSON in request body' });
      }
    }
  }
  
  // Parse URL to handle routing
  const urlParts = url.split('/').filter(part => part);
  
  // Handle /todos routes (Vercel strips /api prefix)
  if (urlParts[0] === 'todos' || (urlParts[0] === 'api' && urlParts[1] === 'todos')) {
    const todoId = urlParts[0] === 'todos' ? urlParts[1] : urlParts[2]; // Handle both /todos/{id} and /api/todos/{id}
    
    // GET /api/todos - List todos with filtering and pagination
    if (method === 'GET' && !todoId) {
      const { completed, priority, search, page = 1, limit = 10 } = req.query;
      
      const todos = await getTodos();
      let filteredTodos = [...todos];
      
      // Apply filters
      if (completed === 'true') {
        filteredTodos = filteredTodos.filter(t => t.completed);
      } else if (completed === 'false') {
        filteredTodos = filteredTodos.filter(t => !t.completed);
      }
      
      if (priority && priority !== 'ALL') {
        filteredTodos = filteredTodos.filter(t => t.priority === priority);
      }
      
      if (search) {
        filteredTodos = filteredTodos.filter(t =>
          t.text.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      // Sort by date (newest first)
      filteredTodos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Pagination
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
    
    // GET /api/todos/{id} - Get single todo
    if (method === 'GET' && todoId) {
      const todos = await getTodos();
      const todo = todos.find(t => t.id === todoId);
      if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      return res.status(200).json(todo);
    }
    
    // POST /api/todos - Create new todo
    if (method === 'POST' && !todoId) {
      const { text, completed = false, priority = 'medium', category = 'general', dueDate = null, tags = [] } = body;
      
      if (!text || text.trim() === '') {
        return res.status(400).json({ error: 'Text is required' });
      }
      
      const now = new Date().toISOString();
      const newTodo = {
        id: uuidv4(),
        text: text.trim(),
        completed,
        createdAt: now,
        updatedAt: now,
        priority,
        category,
        dueDate,
        tags
      };
      
      const todos = await getTodos();
      todos.unshift(newTodo); // Add to beginning
      await saveTodos(todos);
      return res.status(201).json(newTodo);
    }
    
    // PUT /api/todos/{id} - Update todo
    if (method === 'PUT' && todoId) {
      const todos = await getTodos();
      const todoIndex = todos.findIndex(t => t.id === todoId);
      if (todoIndex === -1) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      
      const updates = body;
      
      // Validate text if provided
      if (updates.text !== undefined && updates.text.trim() === '') {
        return res.status(400).json({ error: 'Text cannot be empty' });
      }
      
      // Update the todo
      todos[todoIndex] = { 
        ...todos[todoIndex], 
        ...updates,
        text: updates.text ? updates.text.trim() : todos[todoIndex].text,
        updatedAt: new Date().toISOString()
      };
      
      await saveTodos(todos);
      return res.status(200).json(todos[todoIndex]);
    }
    
    // DELETE /api/todos/{id} - Delete todo
    if (method === 'DELETE' && todoId) {
      const todos = await getTodos();
      const todoIndex = todos.findIndex(t => t.id === todoId);
      if (todoIndex === -1) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      
      todos.splice(todoIndex, 1);
      await saveTodos(todos);
      return res.status(204).end();
    }
  }
  
  // Handle root /api route for health check
  if (urlParts[0] === 'api' && urlParts.length === 1) {
    return res.status(200).json({ 
      message: 'Todo API is running',
      endpoints: {
        'GET /api/todos': 'List todos with filtering and pagination',
        'POST /api/todos': 'Create new todo',
        'GET /api/todos/{id}': 'Get single todo',
        'PUT /api/todos/{id}': 'Update todo',
        'DELETE /api/todos/{id}': 'Delete todo'
      }
    });
  }
  
  // 404 for unmatched routes
  return res.status(404).json({ error: `Route ${method} ${url} not found` });
}