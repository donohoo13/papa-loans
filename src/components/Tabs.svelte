
<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { ContentTab } from "../types";

  export let tabs: ContentTab[] = [];
  export let activeTab = 0;

  const dispatch = createEventDispatcher();

  function selectTab(index: number) {
    if (activeTab === index) return;
    activeTab = index;
    dispatch("tabChange", { selectedTab: index });
  }

  function handleKeydown(event: KeyboardEvent, index: number) {
    const lastIndex = tabs.length - 1;
    
    switch (event.key) {
      case "ArrowLeft":
        selectTab(index === 0 ? lastIndex : index - 1);
        break;
      case "ArrowRight": 
        selectTab(index === lastIndex ? 0 : index + 1);
        break;
      case "Home":
        selectTab(0);
        break;
      case "End":
        selectTab(lastIndex);
        break;
    }
  }
</script>

<div class="tabs">
  <div role="tablist" aria-label="Content tabs">
    {#each tabs as tab (tab.index)}
      <button
        role="tab"
        aria-selected={activeTab === tab.index}
        aria-controls="panel-{tab.index}"
        id="tab-{tab.index}"
        tabindex={activeTab === tab.index ? 0 : -1}
        on:click={() => selectTab(tab.index)}
        on:keydown={(e) => handleKeydown(e, tab.index)}
      >
        {tab.label}
      </button>
    {/each}
  </div>

  {#each tabs as tab (tab.index)}
    <div
      role="tabpanel"
      id="panel-{tab.index}"
      aria-labelledby="tab-{tab.index}"
      hidden={activeTab !== tab.index}
    >
      <slot {activeTab} tabIndex={tab.index}>
        <p>No content provided for tab {tab.index + 1}</p>
      </slot>
    </div>
  {/each}
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
  }

  [role="tab"]::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: var(--clr-primary);
    transform: scaleX(0);
    transition: transform 0.2s ease;
  }

  [role="tab"]:focus {
    outline: none;
    background-color: var(--clr-surface-hover);
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
    padding: 2rem;
    /* background-color: var(--clr-surface);
    border-radius: 1rem; */
  }

  @media (max-width: calc(var(--bkpt-tablet))) {
    [role="tab"] {
      padding: 1rem 1.8rem;
      font-size: 1.3rem;
    }
  }
</style>
    