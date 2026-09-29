<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# FreshGenie architecture rules
- All product/category data access goes through `src/services/api.ts`; mock AI lives in `src/services/ai.ts` — so a real backend/AI can be swapped in one place.
- App state uses the custom pub/sub store in `src/store/store.ts` (localStorage persisted, hydrated in root effect) — brief forbids Redux/Zustand.
- `useStore` selectors must return stable values (raw state slices); derive computed objects like `cartSummary` outside the selector — otherwise React loops infinitely.
- Global overlays (cart drawer, quick view, address modal, AI chat, toaster) mount once in `src/routes/__root.tsx`.
