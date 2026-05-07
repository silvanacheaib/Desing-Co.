# 🚀 Complete React Learning Guide - 2025

## Table of Contents
1. [React Fundamentals](#react-fundamentals)
2. [Modern React Patterns](#modern-react-patterns)
3. [State Management](#state-management)
4. [Performance Optimization](#performance-optimization)
5. [Best Practices](#best-practices)
6. [Project Structure](#project-structure)
7. [Common Mistakes to Avoid](#common-mistakes)
8. [Learning Roadmap](#learning-roadmap)

---

## React Fundamentals

### What is React?

React is a JavaScript library for building user interfaces, particularly single-page applications. It allows you to create reusable UI components and manage application state efficiently.

**Key Concepts:**
- **Component-Based**: Build encapsulated components that manage their own state
- **Declarative**: Design simple views for each state, React updates efficiently
- **Learn Once, Write Anywhere**: Use React for web, mobile (React Native), desktop

### Setting Up Your First React Project

**Modern Way (Recommended):**

```bash
# Using Vite (Fast, Modern)
npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install
npm run dev

# Using Next.js (For production apps)
npx create-next-app@latest my-next-app
cd my-next-app
npm run dev
```

**Traditional Way:**
```bash
# Create React App (Being phased out)
npx create-react-app my-app
cd my-app
npm start
```

### Understanding JSX

JSX is a syntax extension that lets you write HTML-like code in JavaScript.

**✅ Good JSX:**
```jsx
// Components must return a single parent element
function MyComponent() {
  return (
    <div className="container">
      <h1>Hello World</h1>
      <p>This is JSX</p>
    </div>
  );
}

// Use fragments to avoid extra DOM nodes
function MyComponent() {
  return (
    <>
      <h1>Hello World</h1>
      <p>No wrapper div needed!</p>
    </>
  );
}

// JavaScript expressions in curly braces
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// Conditional rendering
function UserGreeting({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? (
        <h1>Welcome back!</h1>
      ) : (
        <h1>Please sign in.</h1>
      )}
    </div>
  );
}

// Mapping arrays to components
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

**❌ Common JSX Mistakes:**
```jsx
// WRONG: Multiple root elements
function Wrong() {
  return (
    <h1>Title</h1>
    <p>Text</p>
  );
}

// WRONG: Using 'class' instead of 'className'
<div class="container">Wrong</div>

// CORRECT:
<div className="container">Correct</div>

// WRONG: Inline styles as strings
<div style="color: red;">Wrong</div>

// CORRECT: Inline styles as objects
<div style={{ color: 'red' }}>Correct</div>

// WRONG: Missing key in lists
{items.map(item => <div>{item}</div>)}

// CORRECT: Always use unique keys
{items.map(item => <div key={item.id}>{item}</div>)}
```

---

## Modern React Patterns

### 1. Function Components (Modern Standard)

**✅ Always use function components:**
```jsx
// Modern React - Function Component
function Welcome({ name, age }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>You are {age} years old.</p>
    </div>
  );
}

// With default props
function Welcome({ name = 'Guest', age = 0 }) {
  return <div>Hello, {name}! Age: {age}</div>;
}
```

**❌ Avoid class components (legacy):**
```jsx
// OLD WAY - Don't use unless maintaining legacy code
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

### 2. React Hooks (Essential)

#### useState - Managing State

```jsx
import { useState } from 'react';

function Counter() {
  // Declare state variable
  const [count, setCount] = useState(0);
  
  // Update state
  const increment = () => setCount(count + 1);
  
  // Update based on previous state (IMPORTANT!)
  const incrementCorrectly = () => setCount(prev => prev + 1);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={incrementCorrectly}>+1</button>
    </div>
  );
}

// Multiple state variables
function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);
  
  return (
    <form>
      <input 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
      />
      <input 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
    </form>
  );
}

// State with objects (IMPORTANT: Always spread)
function UserProfile() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0
  });
  
  // ❌ WRONG: This loses other properties
  const updateName = (name) => setUser({ name });
  
  // ✅ CORRECT: Spread existing properties
  const updateNameCorrectly = (name) => {
    setUser(prev => ({ ...prev, name }));
  };
  
  return <div>{user.name}</div>;
}

// State with arrays
function TodoList() {
  const [todos, setTodos] = useState([]);
  
  // Add item
  const addTodo = (text) => {
    setTodos(prev => [...prev, { id: Date.now(), text }]);
  };
  
  // Remove item
  const removeTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };
  
  // Update item
  const updateTodo = (id, newText) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  };
  
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

#### useEffect - Side Effects

```jsx
import { useState, useEffect } from 'react';

// Basic useEffect - runs after every render
function Example() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = `Count: ${count}`;
  });
  
  return <button onClick={() => setCount(count + 1)}>Click</button>;
}

// With dependency array - only runs when dependencies change
function Example() {
  const [count, setCount] = useState(0);
  
  // Only runs when count changes
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);
  
  return <button onClick={() => setCount(count + 1)}>Click</button>;
}

// Empty dependency array - runs once on mount
function Example() {
  useEffect(() => {
    console.log('Component mounted');
    
    // Cleanup function - runs on unmount
    return () => {
      console.log('Component will unmount');
    };
  }, []); // Empty array = run once
  
  return <div>Hello</div>;
}

// Fetching data (Common pattern)
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Reset states when userId changes
    setLoading(true);
    setError(null);
    
    // Fetch user data
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]); // Re-fetch when userId changes
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{user.name}</div>;
}

// Subscriptions and cleanup
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    
    // Cleanup function - IMPORTANT!
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  
  return <div>Chat Room {roomId}</div>;
}
```

#### useRef - Accessing DOM and Persisting Values

```jsx
import { useRef, useEffect } from 'react';

// Accessing DOM elements
function TextInput() {
  const inputRef = useRef(null);
  
  const focusInput = () => {
    inputRef.current.focus();
  };
  
  return (
    <>
      <input ref={inputRef} />
      <button onClick={focusInput}>Focus Input</button>
    </>
  );
}

// Storing mutable values (doesn't trigger re-render)
function Timer() {
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null);
  
  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
  };
  
  const stopTimer = () => {
    clearInterval(intervalRef.current);
  };
  
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
    </div>
  );
}

// Previous value tracking
function usePrevious(value) {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  
  return (
    <div>
      <p>Now: {count}, Before: {prevCount}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
```

#### useContext - Sharing State

```jsx
import { createContext, useContext, useState } from 'react';

// Create context
const ThemeContext = createContext();

// Provider component
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook for using context
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Using the context
function App() {
  return (
    <ThemeProvider>
      <Header />
      <Main />
    </ThemeProvider>
  );
}

function Header() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className={theme}>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </header>
  );
}

// Real-world example: Auth context
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is logged in
    checkAuth().then(user => {
      setUser(user);
      setLoading(false);
    });
  }, []);
  
  const login = async (email, password) => {
    const user = await loginAPI(email, password);
    setUser(user);
  };
  
  const logout = () => {
    setUser(null);
    logoutAPI();
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}
```

#### useMemo & useCallback - Performance

```jsx
import { useMemo, useCallback, useState } from 'react';

// useMemo - Memoize expensive calculations
function ExpensiveComponent({ items }) {
  // Only recalculates when items change
  const total = useMemo(() => {
    console.log('Calculating total...');
    return items.reduce((sum, item) => sum + item.price, 0);
  }, [items]);
  
  return <div>Total: ${total}</div>;
}

// useCallback - Memoize functions
function TodoList() {
  const [todos, setTodos] = useState([]);
  
  // Function reference stays the same unless setTodos changes
  const addTodo = useCallback((text) => {
    setTodos(prev => [...prev, { id: Date.now(), text }]);
  }, []);
  
  const removeTodo = useCallback((id) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  }, []);
  
  return (
    <div>
      <AddTodoForm onAdd={addTodo} />
      {todos.map(todo => (
        <TodoItem 
          key={todo.id} 
          todo={todo} 
          onRemove={removeTodo} 
        />
      ))}
    </div>
  );
}

// When to use useMemo vs useCallback
function Example() {
  const [count, setCount] = useState(0);
  
  // useMemo - for values
  const expensiveValue = useMemo(() => {
    return computeExpensiveValue(count);
  }, [count]);
  
  // useCallback - for functions
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);
  
  return (
    <div>
      <p>{expensiveValue}</p>
      <button onClick={handleClick}>Click</button>
    </div>
  );
}
```

#### Custom Hooks - Reusable Logic

```jsx
// Custom hook for fetching data
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [url]);
  
  return { data, loading, error };
}

// Usage
function UserProfile({ userId }) {
  const { data, loading, error } = useFetch(`/api/users/${userId}`);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{data.name}</div>;
}

// Custom hook for localStorage
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });
  
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  
  return [value, setValue];
}

// Usage
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current: {theme}
    </button>
  );
}

// Custom hook for window size
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return size;
}

// Usage
function ResponsiveComponent() {
  const { width } = useWindowSize();
  
  return (
    <div>
      {width < 768 ? <MobileView /> : <DesktopView />}
    </div>
  );
}
```

---

## State Management

### Local State vs Global State

**When to use local state (useState):**
- Data only used in one component
- Form inputs
- Toggle states (modals, dropdowns)

**When to use global state:**
- User authentication data
- Theme settings
- Shopping cart data
- Data shared by many components

### Context API (Built-in)

```jsx
// Good for small to medium apps
import { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload]
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    case 'CLEAR_CART':
      return { items: [] };
    default:
      return state;
  }
}

function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  
  const addItem = (item) => dispatch({ type: 'ADD_ITEM', payload: item });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  
  return (
    <CartContext.Provider value={{ ...state, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

function useCart() {
  return useContext(CartContext);
}
```

### Zustand (Recommended for larger apps)

```bash
npm install zustand
```

```jsx
import create from 'zustand';

// Simple and clean state management
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 })
}));

function Counter() {
  const { count, increment, decrement } = useStore();
  
  return (
    <div>
      <p>{count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}

// With async actions
const useUserStore = create((set) => ({
  user: null,
  loading: false,
  fetchUser: async (id) => {
    set({ loading: true });
    const user = await fetch(`/api/users/${id}`).then(r => r.json());
    set({ user, loading: false });
  }
}));
```

---

## Performance Optimization

### React.memo - Prevent Unnecessary Renders

```jsx
import { memo } from 'react';

// Without memo - re-renders every time parent renders
function ExpensiveComponent({ data }) {
  console.log('Rendering...');
  return <div>{data}</div>;
}

// With memo - only re-renders when props change
const OptimizedComponent = memo(function ExpensiveComponent({ data }) {
  console.log('Rendering...');
  return <div>{data}</div>;
});

// Custom comparison function
const OptimizedComponent = memo(
  function ExpensiveComponent({ user }) {
    return <div>{user.name}</div>;
  },
  (prevProps, nextProps) => {
    // Return true if props are equal (don't re-render)
    return prevProps.user.id === nextProps.user.id;
  }
);
```

### Code Splitting & Lazy Loading

```jsx
import { lazy, Suspense } from 'react';

// Lazy load components
const Dashboard = lazy(() => import('./Dashboard'));
const Profile = lazy(() => import('./Profile'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dashboard />
    </Suspense>
  );
}

// With React Router
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

### List Optimization

```jsx
// ❌ Bad: Creates new array on every render
function BadList() {
  const items = ['a', 'b', 'c'].map(item => <div>{item}</div>);
  return <div>{items}</div>;
}

// ✅ Good: Stable reference
function GoodList() {
  const [items] = useState(['a', 'b', 'c']);
  
  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>{item}</div>
      ))}
    </div>
  );
}

// ✅ Better: Virtualization for long lists
import { FixedSizeList } from 'react-window';

function VirtualizedList({ items }) {
  return (
    <FixedSizeList
      height={400}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>{items[index]}</div>
      )}
    </FixedSizeList>
  );
}
```

---

## Best Practices

### Component Organization

```jsx
// ✅ Good component structure
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './UserCard.module.css';

/**
 * Displays user information in a card format
 * @param {Object} user - User object with name, email, avatar
 * @param {Function} onEdit - Callback when edit button clicked
 */
function UserCard({ user, onEdit }) {
  // 1. State declarations
  const [isHovered, setIsHovered] = useState(false);
  
  // 2. Effects
  useEffect(() => {
    // side effects
  }, []);
  
  // 3. Event handlers
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleEditClick = () => onEdit(user.id);
  
  // 4. Early returns for loading/error states
  if (!user) return <div>No user data</div>;
  
  // 5. Render
  return (
    <div 
      className={styles.card}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={handleEditClick}>Edit</button>
    </div>
  );
}

// 6. PropTypes for type checking
UserCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    avatar: PropTypes.string
  }).isRequired,
  onEdit: PropTypes.func
};

// 7. Default props
UserCard.defaultProps = {
  onEdit: () => {}
};

export default UserCard;
```

### Naming Conventions

```jsx
// ✅ Components: PascalCase
function UserProfile() {}
function ProductCard() {}

// ✅ Functions/variables: camelCase
const handleClick = () => {};
const isLoading = true;
const userName = 'John';

// ✅ Constants: UPPER_SNAKE_CASE
const API_URL = 'https://api.example.com';
const MAX_RETRIES = 3;

// ✅ Custom hooks: use + PascalCase
function useAuth() {}
function useFetch() {}

// ✅ Boolean variables: is/has/should prefix
const isLoading = false;
const hasError = true;
const shouldRender = false;

// ✅ Event handlers: handle + Action
const handleSubmit = () => {};
const handleClick = () => {};
const handleInputChange = () => {};
```

### Folder Structure (Recommended)

```
src/
├── components/          # Reusable components
│   ├── common/         # Shared components
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   ├── Button.module.css
│   │   │   ├── Button.test.jsx
│   │   │   └── index.js
│   │   └── Input/
│   ├── features/       # Feature-specific components
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   └── RegisterForm.jsx
│   │   └── dashboard/
│   └── layout/         # Layout components
│       ├── Header.jsx
│       ├── Footer.jsx
│       └── Sidebar.jsx
├── hooks/              # Custom hooks
│   ├── useAuth.js
│   ├── useFetch.js
│   └── useLocalStorage.js
├── context/            # Context providers
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── pages/              # Page components (routes)
│   ├── Home.jsx
│   ├── Dashboard.jsx
│   └── Profile.jsx
├── services/           # API calls
│   ├── api.js
│   ├── auth.js
│   └── users.js
├── utils/              # Utility functions
│   ├── formatDate.js
│   └── validation.js
├── constants/          # Constants
│   └── config.js
├── styles/             # Global styles
│   └── global.css
├── App.jsx
└── main.jsx
```

---

## Common Mistakes to Avoid

### 1. Mutating State Directly

```jsx
// ❌ WRONG: Mutating state
function BadComponent() {
  const [user, setUser] = useState({ name: 'John', age: 30 });
  
  const updateAge = () => {
    user.age = 31;  // WRONG!
    setUser(user);  // React won't detect the change
  };
}

// ✅ CORRECT: Create new object
function GoodComponent() {
  const [user, setUser] = useState({ name: 'John', age: 30 });
  
  const updateAge = () => {
    setUser(prev => ({ ...prev, age: 31 }));
  };
}
```

### 2. Missing Dependencies in useEffect

```jsx
// ❌ WRONG: Missing dependency
function BadComponent({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, []); // Missing userId!
}

// ✅ CORRECT: Include all dependencies
function GoodComponent({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]); // Include userId
}
```

### 3. Not Cleaning Up Side Effects

```jsx
// ❌ WRONG: No cleanup
function BadComponent() {
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Running...');
    }, 1000);
  }, []);
}

// ✅ CORRECT: Cleanup function
function GoodComponent() {
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Running...');
    }, 1000);
    
    return () => clearInterval(interval); // Cleanup
  }, []);
}
```

### 4. Using Index as Key

```jsx
// ❌ WRONG: Using index as key
function BadList({ items }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item.name}</li>
      ))}
    </ul>
  );
}

// ✅ CORRECT: Use unique ID
function GoodList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

### 5. Prop Drilling

```jsx
// ❌ WRONG: Passing props through many levels
function App() {
  const [user, setUser] = useState(null);
  return <Layout user={user} />;
}

function Layout({ user }) {
  return <Header user={user} />;
}

function Header({ user }) {
  return <UserMenu user={user} />;
}

// ✅ CORRECT: Use Context
const UserContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={user}>
      <Layout />
    </UserContext.Provider>
  );
}

function UserMenu() {
  const user = useContext(UserContext);
  return <div>{user.name}</div>;
}
```

---

## Learning Roadmap

### Phase 1: Fundamentals (2-3 weeks)
1. **Week 1:**
   - JSX syntax
   - Components and Props
   - State with useState
   - Event handling
   
2. **Week 2:**