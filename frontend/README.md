# TodoList Frontend

A modern React TypeScript application for managing todos with infinite scroll, filtering, and optimistic updates.

## Features

- ✅ **CRUD Operations**: Create, read, update, and delete todos
- 🔄 **Optimistic Updates**: Instant UI updates with rollback on failure
- 📜 **Infinite Scroll**: Load todos as you scroll (default mode)
- 📄 **Pagination**: Traditional page-based navigation
- 🔍 **Advanced Filtering**: Filter by status, priority, and date range
- 🎯 **Sorting**: Sort by date or priority (ascending/descending)
- 🎨 **Modern UI**: Built with shadcn/ui and Tailwind CSS
- 🌙 **Dark Mode**: Beautiful dark theme support
- 📱 **Responsive**: Works on all device sizes

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Redux Toolkit** for state management
- **TanStack Query** for data fetching and caching
- **React Hook Form** with Zod validation
- **Day.js** for date formatting

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend server running on http://localhost:8080

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open http://localhost:3000 in your browser

### Building for Production

```bash
npm run build
npm run preview
```

## API Integration

The frontend connects to the backend API at `http://localhost:8080` with the following endpoints:

- `GET /todos` - Paginated todos
- `GET /todos/scroll` - Infinite scroll todos
- `POST /todos` - Create todo
- `PUT /todos/:id` - Update todo
- `DELETE /todos/:id` - Delete todo

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── AddTodoForm.tsx # Todo creation form
│   ├── FilterBar.tsx   # Filtering and sorting controls
│   ├── TodoCard.tsx    # Individual todo item
│   └── TodoList.tsx    # Todo list with infinite scroll
├── hooks/              # Custom React hooks
│   ├── useTodos.ts     # TanStack Query hooks
│   └── use-toast.ts    # Toast notifications
├── lib/                # Utility functions
│   ├── api.ts          # API client
│   └── utils.ts        # Helper functions
├── store/              # Redux store
│   └── slices/         # Redux slices
├── types/              # TypeScript type definitions
└── App.tsx             # Main application component
```

## Usage

### Adding Todos
1. Click "Add a new todo" button
2. Fill in the title, priority, and date
3. Click "Add Todo" - the todo appears instantly

### Filtering and Sorting
- Use the filter bar to filter by status, priority, or date range
- Sort by date or priority in ascending/descending order
- Switch between infinite scroll and pagination modes

### Managing Todos
- Check/uncheck todos to mark as complete
- Click the trash icon to delete todos
- All changes are applied optimistically for instant feedback

## Development

The app uses:
- **ESLint** for code linting
- **TypeScript** for type safety
- **Vite** for fast HMR and building
- **Tailwind CSS** for utility-first styling

## License

MIT
