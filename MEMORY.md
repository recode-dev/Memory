Project Conventions & Style

Architecture & Classes
• Class-Based Modules: Every subsystem and feature lives in a dedicated ES6 class. State and lifecycle (`init`, `toggle`, `apply`) are encapsulated as static members.
• Static Namespaces: Native function pointers, callbacks, and engine helpers belong to structured static classes (`NativeFunctions`, `Commands`, `BattleTick`, `DataTables`).
• Direct Interop: Classes reference each other directly via static calls; no loose helper functions, global variable leakage, or intermediary wrapper layers.

Explicit-Over-Defensive
• YAGNI: No try/catch per line, no null-guards on expected non-null values, no speculative branches, no fallback operators.
• Fail-Fast: On invalid state — crash. Never return a sentinel that hides a bug.
• Idempotent Init: Guard once at the entry point of an init routine, not at every call site.
• Single Source of Truth: Every project-specific value lives in one config module (`constants`, `offsets`, `structs`). Logic references it; logic never embeds it.
• No Safety Theater: No wrapper bloat, no intermediate variables for a ternary, no explanatory comments. Code reads like the underlying execution, not like a tutorial about it.
• No Fallbacks & Logs: Clear code, silent control flow, no defensive scaffolding, zero console output.
