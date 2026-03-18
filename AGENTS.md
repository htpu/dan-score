# AGENTS.md - Development Guidelines

## Project Overview

This is a **single-file React application** (掼蛋/Guandan score tracker) embedded in `index.html`. It uses React 18, Tailwind CSS via CDN, and lucide-react icons. No build system or package manager - changes are made directly to the HTML file.

---

## Commands

### Development
- **Open in browser**: Open `index.html` directly in a browser, or use a simple HTTP server:
  ```bash
  # Python 3
  python -m http.server 8000
  # Then visit http://localhost:8000
  ```

### Testing
- **No test framework** - This is a simple static HTML file with no automated tests.
- Manual testing: Open in browser, test all game flows (scoring, undo, reset, theme switching, team presets).

### Linting
- **No linter configured** - No ESLint, Prettier, or other tooling.
- Code review is manual.

---

## Code Style Guidelines

### General Principles
- Keep all code in a **single HTML file** (`index.html`) unless the project grows significantly.
- Use **functional components** with React hooks (`useState`, `useEffect`, `useMemo`).
- Use **Tailwind CSS classes** for all styling - avoid inline styles except for dynamic values.

### Imports
```javascript
import React, { useState, useEffect, useMemo } from 'react';
import { IconName } from 'lucide-react';
```
- Place React imports at the top of the script.
- Group icon imports alphabetically within the lucide-react import.

### Types
- This is plain JavaScript (no TypeScript).
- Use JSDoc comments for complex functions if needed:
  ```javascript
  /** @param {number} idx */
  const handleRankSelect = (idx, team) => { ... };
  ```

### Naming Conventions
- **Components**: PascalCase (`App`, `PokerBackground`)
- **Constants**: UPPER_SNAKE_CASE (`LEVELS`, `TEAM_PRESETS`)
- **Functions/variables**: camelCase (`handleRankSelect`, `gameState`)
- **Event handlers**: Prefix with `handle` (`handleUndo`, `handleFullReset`)
- **State setters**: Prefix with `set` (`setGameState`, `setSettings`)

### Formatting
- Indentation: **2 spaces**
- Line length: Try to keep lines under 120 characters
- JSX attributes: One per line for readability
- Use trailing commas in arrays and objects
- Use template literals for string interpolation

### Component Structure
```javascript
// 1. Constants/helpers (outside component)
const LEVELS = [...];

// 2. Sub-components (if any)
const SubComponent = () => { ... };

// 3. Main component
const App = () => {
  // State initialization (with lazy init if needed)
  const [state, setState] = useState(...);

  // Effects
  useEffect(() => { ... }, [...]);

  // Helpers
  const helper = () => { ... };

  // Event handlers
  const handleX = () => { ... };

  // Render
  return ( ... );
};
```

### Tailwind CSS Usage
- Use **arbitrary values** sparingly (e.g., `h-[100dvh]`)
- Prefer Tailwind's **spacing scale** over arbitrary values
- Use `animate-in` classes for entrance animations
- Keep responsive classes minimal (mobile-first design)

### State Management
- Use `useState` for local component state
- Use `localStorage` with versioned keys for persistence (e.g., `guandan_game_state_v8`)
- Store both game state and settings in localStorage

### Error Handling
- Validate inputs in event handlers (e.g., `if (!pendingResult) return;`)
- Use optional chaining (`?.`) when accessing nested properties
- Wrap JSON.parse in try-catch for localStorage data:
  ```javascript
  try {
    return JSON.parse(saved);
  } catch {
    return defaultValue;
  }
  ```

### Chinese Language
- Use Chinese for user-facing text (labels, buttons, messages)
- Use English for code and comments (or Chinese comments if explaining Chinese-specific logic)

---

## Version Control

- No git repository currently initialized
- If needed, initialize with: `git init`

---

## Key Files

| File | Purpose |
|------|---------|
| `index.html` | Main application (all code) |
| `掼蛋计分器需求文档.md` | Requirements document |

---

## Game Logic Reference

- **Levels**: `['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']`
- **Win points**: Double lose (+3), single lose (+2), small win (+1 or 0), draw (0)
- **Victory**: Must rank 1st with teammate not last
- **Optional penalty**: 3 fails without A drops to level 2
