# UI Color Guidelines

This document defines the default color system for interactive UI in `eduryday`.
Use this as the baseline for buttons, links, form inputs, and surface/text contrast.

## Goals
- Keep contrast readable on light backgrounds.
- Use one consistent neutral action style across student/professor/admin/auth pages.
- Avoid ad-hoc color pairings that reduce readability.

## Base Surfaces and Text
- App background: `bg-gray-50`
- Card/container background: `bg-white`
- Primary text: `text-gray-900`
- Secondary text: `text-gray-600`
- Supporting text: `text-gray-500`
- Borders: `border-gray-200` (containers), `border-gray-300` (inputs/actions)

## Interactive Color Tokens

### Primary Action
- Base: `bg-gray-900 text-white`
- Hover: `hover:bg-gray-800`
- Active: `active:bg-black`
- Focus: `focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`

### Secondary Action
- Base: `border border-gray-300 bg-white text-gray-700`
- Hover: `hover:bg-gray-100`
- Active: `active:bg-gray-200`
- Focus: `focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`

### Danger Action
- Base: `bg-red-600 text-white`
- Hover: `hover:bg-red-500`
- Active: `active:bg-red-700`

## Link Style
- Default link text: `text-gray-700`
- Hover text: `hover:text-gray-900`
- Optional underline affordance: `underline-offset-2 hover:underline`

## Form Controls
- Input base: `border border-gray-300 bg-white text-gray-900`
- Placeholder: `placeholder-gray-400`
- Focus: `focus:border-gray-500 focus:ring-1 focus:ring-gray-500`

## Shared Component Rule
- Prefer `shared/ui/Button` for action buttons.
- Do not redefine primary/secondary colors per page unless there is a strong product reason.

## Pages Updated To This Standard
- Landing header and CTA sections
- Login page
- Signup page
- Forgot password page
- Role selection page
- Shared `Button` component

## Review Checklist
- Is text readable against the background at a glance?
- Are primary CTAs using the primary action token?
- Are outline/secondary actions using the secondary action token?
- Are link colors and hover states consistent?
- Do focus rings remain visible on keyboard navigation?
