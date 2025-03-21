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
    gap: 1rem;
    border-bottom: 4px solid var(--clr-primary);
    max-width: 95vw;
    overflow-x: auto;
    margin-bottom: 1rem;
    scroll-snap-type: x mandatory;
  }

  [role="tab"] {
    background-color: var(--clr-transparent);
    border: 4px solid var(--clr-primary);
    border-bottom: none;
    border-radius: 0.25rem 0.25rem 0 0;
    padding: 1.5rem 3rem;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 1.4rem;
    text-transform: uppercase;
    font-weight: 500;
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }

  [role="tab"]:focus {
    outline: none;
  }

  [role="tab"]:hover {
    background-color: hsl(from var(--clr-primary) h s l / 0.6);
  }

  [role="tab"][aria-selected="true"] {
    background-color: var(--clr-primary);
  }

  [role="tabpanel"] {
    padding: 15px;
  }
</style>
