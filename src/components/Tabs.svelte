<script lang="ts">
  import { afterUpdate, createEventDispatcher } from "svelte";
  import type { ContentTab } from "../types";

  export let tabs: ContentTab[] = [];
  export let activeTab = 0;

  const dispatch = createEventDispatcher();
  let tabButtons: (HTMLButtonElement | null)[] = [];

  function selectTab(index: number) {
    if (activeTab === index) return;
    activeTab = index;
    dispatch("tabChange", { selectedTab: index });
  }

  // Focus the newly selected tab button for better keyboard navigation.
  afterUpdate(() => {
    tabButtons[activeTab]?.focus();
  });

  function handleKeydown(event: KeyboardEvent, index: number) {
    const lastIndex = tabs.length - 1;
    let newIndex = index;
    
    switch (event.key) {
      case "ArrowLeft":
        newIndex = index === 0 ? lastIndex : index - 1; 
        break;
      case "ArrowRight": 
        newIndex = index === lastIndex ? 0 : index + 1;
        break;
      case "Home":
        newIndex = 0;
        break;
      case "End":
        newIndex = lastIndex;
        break;
      default:
        return; // Do nothing if the key is not one of the handled ones.
    }

    event.preventDefault(); // Prevent scrolling on arrow key press
    selectTab(newIndex);
  }
</script>

<div class="tabs">
  <div role="tablist" aria-label="Content tabs">
    {#each tabs as tab (tab.index)}
      <button
        bind:this={tabButtons[tab.index]}
        role="tab"
        aria-selected={activeTab === tab.index}
        aria-controls="tab-panel"
        id="tab-{tab.index}"
        tabindex={activeTab === tab.index ? 0 : -1}
        on:click={() => selectTab(tab.index)}
        on:keydown={(e) => handleKeydown(e, tab.index)}
      >
        {tab.label}
      </button>
    {/each}
  </div>

  <!-- A single tabpanel is now used, rendering only the content for the active tab. -->
  <!-- This is more efficient than rendering all panels and hiding them. -->
  <div
    role="tabpanel"
    id="tab-panel"
    aria-labelledby="tab-{activeTab}"
  >
    <slot />
  </div>
</div>

<style>
  .tabs {
    margin-block: 4rem;
  }

  [role="tablist"] {
    display: flex;
    gap: 0.5rem;
    border-bottom: 2px solid var(--clr-surface-hover);
    max-width: 95vw;
    overflow-x: auto;
    margin-bottom: 2rem;
    scroll-snap-type: x mandatory;
    padding-bottom: 2px;
  }

  [role="tab"] {
    background-color: var(--clr-surface);
    border: none;
    border-radius: 0.6rem 0.6rem 0 0;
    padding: 1.2rem 2.4rem;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 1.4rem;
    text-transform: uppercase;
    font-weight: 500;
    color: var(--clr-muted);
    letter-spacing: 0.05em;
    scroll-snap-align: start;
    scroll-snap-stop: always;
    position: relative;
    white-space: nowrap; /* Prevent tab labels from wrapping */
  }

  [role="tab"]::after {
    content: '';
    position: absolute;
    bottom: -2px; /* Position on top of the border-bottom */
    left: 0;
    width: 100%;
    height: 2px;
    background-color: var(--clr-primary);
    transform: scaleX(0);
    transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  }

  [role="tab"]:focus-visible {
    outline: 2px solid var(--clr-secondary);
    outline-offset: 2px;
  }

  [role="tab"]:hover {
    background-color: var(--clr-surface-hover);
    color: var(--clr-text);
  }

  [role="tab"][aria-selected="true"] {
    color: var(--clr-text);
    background-color: var(--clr-surface-hover);
  }

  [role="tab"][aria-selected="true"]::after {
    transform: scaleX(1);
  }

  [role="tabpanel"] {
    padding-inline: 0; /* Let content inside handle its own padding */
  }

  @media (max-width: calc(var(--bkpt-tablet))) {
    [role="tab"] {
      padding: 1rem 1.8rem;
      font-size: 1.3rem;
    }
  }
</style>
