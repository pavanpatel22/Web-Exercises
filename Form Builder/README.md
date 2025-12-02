Design Decisions & Trade-offs
1. State Management Architecture
Redux: Form schema and persistent data with optimistic updates

Context: UI state (selected elements, sidebar state) to avoid prop drilling

Router: Mode management (edit/preview) via URL for bookmarkable states

2. Performance Optimizations
Memoized Selectors: Reselect for derived data to prevent recalculation

Context Splitting: Separate contexts for actions vs UI state

Component Memoization: React.memo for expensive components

Optimistic Updates: Immediate UI feedback with rollback capability

3. User Experience
DnD Interface: Intuitive drag-and-drop for form building

Real-time Preview: Instant feedback as users build forms

Optimistic UI: Immediate visual feedback for all actions

Responsive Design: Works on desktop and mobile devices

4. Trade-offs
Bundle Size: Added @dnd-kit and Reselect increases bundle size

Complexity: Multiple state domains increase architectural complexity

Over-engineering: Might be excessive for very simple forms