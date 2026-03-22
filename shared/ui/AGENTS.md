# shared/ui/ AGENTS.md

**Parent:** [`../AGENTS.md`](../AGENTS.md)

## Overview

This directory contains **reusable UI components** — the primitive building blocks used across pages, widgets, and features.

All components use **Tailwind CSS v4** (no external CSS files).

## Components

### `Button`

Versatile button component with variants and sizes.

**Props:**
```tsx
interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';  // default: 'primary'
  size?: 'sm' | 'md' | 'lg';                     // default: 'md'
  fullWidth?: boolean;                            // default: false
  className?: string;                             // extra Tailwind classes
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';          // default: 'button'
  disabled?: boolean;                             // default: false
}
```

**Variants:**
- `primary` — Dark gray background, white text, hover darker
- `secondary` — White background, gray border and text
- `danger` — Red background, white text

**Sizes:**
- `sm` — `px-3 py-1.5 text-xs`
- `md` — `px-4 py-2 text-sm`
- `lg` — `px-6 py-3 text-base`

**Usage:**
```tsx
import { Button } from '@/shared/ui';

// Primary button
<Button>Click me</Button>

// Secondary button with size
<Button variant="secondary" size="lg">Save</Button>

// Danger button, full width
<Button variant="danger" fullWidth type="submit">Delete</Button>

// With custom Tailwind classes
<Button className="mr-2">First</Button>
```

---

### `Card`

Container for grouping content with optional title.

**Props:**
```tsx
interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
}
```

**Features:**
- Rounded corners with border
- Light gray border and white background
- Optional title with dark gray heading
- Padding and shadow for depth

**Usage:**
```tsx
import { Card } from '@/shared/ui';

<Card title="Course Details">
  <p>Week 1: Introduction</p>
</Card>

// Without title
<Card>
  <p>Just content</p>
</Card>
```

---

### `Badge`

Small label or tag component.

**Props:**
```tsx
interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'green' | 'blue' | 'yellow' | 'red' | 'purple';  // default: 'default'
  size?: 'sm' | 'md';                                                    // default: 'sm'
  className?: string;
}
```

**Variants:**
- `default` — Gray background and text
- `green` — Green background and text
- `blue` — Blue background and text
- `yellow` — Yellow background and text
- `red` — Red background and text
- `purple` — Purple background and text

**Sizes:**
- `sm` — `px-2 py-0.5 text-xs`
- `md` — `px-2.5 py-1 text-sm`

**Usage:**
```tsx
import { Badge } from '@/shared/ui';

// Role badge
<Badge variant="blue">Student</Badge>

// Status badge
<Badge variant="green">Active</Badge>

// Larger
<Badge variant="purple" size="md">Premium</Badge>
```

---

### `Input`

Text input field with optional label.

**Props:**
```tsx
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'search';  // default: 'text'
  label?: string;
  placeholder?: string;
  className?: string;
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;                                            // default: false
  disabled?: boolean;                                            // default: false
  autoComplete?: string;
}
```

**Features:**
- Optional label above input
- Red asterisk for required fields
- Rounded borders with focus ring
- Disabled state styling
- Tailwind classes for form styling

**Usage:**
```tsx
import { Input } from '@/shared/ui';

// Basic email input
<Input type="email" placeholder="Enter email" />

// With label
<Input
  type="email"
  label="Email Address"
  required
  name="email"
/>

// Password input
<Input type="password" label="Password" />

// Controlled input
const [value, setValue] = useState('');
<Input
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

---

### `ProgressBar`

Horizontal progress indicator.

**Props:**
```tsx
interface ProgressBarProps {
  value: number;                              // 0-100
  color?: 'gray' | 'blue' | 'green';         // default: 'gray'
  className?: string;
}
```

**Features:**
- Clamps value to 0-100
- Animated width transition (300ms)
- ARIA roles for accessibility

**Colors:**
- `gray` — Dark gray fill
- `blue` — Blue fill
- `green` — Green fill

**Usage:**
```tsx
import { ProgressBar } from '@/shared/ui';

// Course completion progress
<ProgressBar value={75} color="blue" />

// Assignment submission rate
<ProgressBar value={90} color="green" />
```

---

### `StatCard`

Statistics display card (for dashboards).

**Props:**
```tsx
interface StatCardProps {
  label: string;
  value: string;
  trend?: string;                    // e.g., "+5%" or "-2"
  trendColor?: 'green' | 'red';     // default: 'green'
  className?: string;
}
```

**Features:**
- Large bold value display
- Small gray label
- Optional trend indicator
- Rounded corners with subtle border and shadow

**Usage:**
```tsx
import { StatCard } from '@/shared/ui';

// Student count
<StatCard label="Total Students" value="156" />

// With trend
<StatCard
  label="Completion Rate"
  value="87%"
  trend="+3%"
  trendColor="green"
/>

<StatCard
  label="Dropped Students"
  value="5"
  trend="-1"
  trendColor="red"
/>
```

---

## For AI Agents

### Component Composition

All components are exported via barrel export:

```tsx
import { Button, Card, Badge, Input, ProgressBar, StatCard } from '@/shared/ui';
```

Never import directly from individual files:
```tsx
// ❌ Avoid
import { Button } from '@/shared/ui/button';

// ✅ Prefer
import { Button } from '@/shared/ui';
```

### Tailwind CSS Only

- **No external CSS files** — all styles are inline Tailwind classes
- **No CSS modules** — keep styling in JSX
- **No styled-components** — use plain Tailwind
- Accept `className` prop for composition and overrides

### Adding a New Component

Follow this pattern:

1. **Create file:** `shared/ui/<component-name>.tsx`
2. **Define interface** with props
3. **Extract variant/size maps** as constants
4. **Use Tailwind classes** (no CSS imports)
5. **Accept `className`** for composition
6. **Export component**
7. **Add to** `shared/ui/index.ts` barrel

**Template:**
```tsx
// shared/ui/my-component.tsx
import { ReactNode } from 'react';

type MyVariant = 'primary' | 'secondary';

interface MyComponentProps {
  children: ReactNode;
  variant?: MyVariant;
  className?: string;
}

const variantClasses: Record<MyVariant, string> = {
  primary: 'bg-gray-900 text-white',
  secondary: 'bg-white text-gray-900',
};

export function MyComponent({
  children,
  variant = 'primary',
  className = '',
}: MyComponentProps) {
  const base = 'rounded-lg px-4 py-2 font-medium transition-colors';
  return (
    <div className={`${base} ${variantClasses[variant]} ${className}`.trim()}>
      {children}
    </div>
  );
}
```

```tsx
// shared/ui/index.ts
export { MyComponent } from './my-component';
```

### Testing Components

Components can be tested manually via `npm run dev`:

```bash
npm run dev
# Then visit http://localhost:3000 and check component rendering
```

### Naming Consistency

- Component files: `kebab-case` (e.g., `my-component.tsx`)
- Exported component: `PascalCase` (e.g., `export function MyComponent`)
- Props interface: `PascalCase` + `Props` (e.g., `MyComponentProps`)
- Variant/size types: `PascalCase` (e.g., `type MyVariant`)
- Constant maps: `UPPER_SNAKE_CASE` or `camelCase` per codebase convention

<!-- MANUAL: -->
