# Agent Notes

## Project
- Single Vite + React app; entrypoint is `src/main.jsx`, global styling is `src/styles.css`.
- Dashboard layout is custom code, not a grid library: cards store `{ col, row, cols, rows }` and render via CSS Grid.
- Grid is fixed at 12 columns by 8 rows; keep JS constants in `src/main.jsx` and CSS `grid-template-*` / `background-size` in `src/styles.css` in sync.

## Commands
- Install dependencies with `npm install`.
- Run local dev server with `npm run dev`.
- Production verification is `npm run build`.
- Preview production build with `npm run preview`.
- No lint, test, formatter, or typecheck scripts are configured.

## UI Constraints
- Keep dashboard ultra-minimal black/white sci-fi: no decorative text, no large visible status labels, no gradients unless user asks.
- Edit control is intentionally small and low-visibility in bottom-right.
- In locked mode cards stay fixed; drag/resize only works when `editMode` is true.
- Edit mode should not add a second overlaid grid; current design only increases existing board grid contrast.


<!-- SKILLKIT_START -->
# Skills

The following skills are available to help complete tasks:

<skills>
<skill>
<name>frontend-design</name>
<description>Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beautifying any web UI). Generates creative, polished code and UI design that avoids generic AI aesthetics.</description>
<location>project</location>
</skill>
</skills>

## How to Use

When a task matches a skill's description:

```bash
skillkit read <skill-name>
```

This loads the skill's instructions into context.

<!-- SKILLKIT_END -->