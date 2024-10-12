<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { ContentTab } from "../types";

  export let tabs: ContentTab[] = [];
  export let activeTab = 0;

  const dispatch = createEventDispatcher();

  function selectTab(index: number) {
    if (activeTab !== index) {
      activeTab = index;
      dispatch("tabChange", { selectedTab: index });
    }
  }

  function handleKeydown(event: KeyboardEvent, index: number) {
    switch (event.key) {
      case "ArrowLeft":
        selectTab(index === 0 ? tabs.length - 1 : index - 1);
        break;
      case "ArrowRight":
        selectTab(index === tabs.length - 1 ? 0 : index + 1);
        break;
      case "Home":
        selectTab(0);
        break;
      case "End":
        selectTab(tabs.length - 1);
        break;
    }
  }
</script>

<div class="tabs">
  <div role="tablist" aria-label="Tabs example">
    {#each tabs as tab}
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

  {#each tabs as tab}
    <div
      role="tabpanel"
      id="panel-{tab.index}"
      aria-labelledby="tab-{tab.index}"
      hidden={activeTab !== tab.index}
    >
      <slot {activeTab} tabIndex={tab.index}>
        <!-- Default content if no slot is provided -->
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
  }

  [role="tab"] {
    background-color: var(--clr-transparent);
    border-color: var(--clr-primary);
    border-width: 4px;
    border-bottom: none;
    border-radius: 0.25rem 0.25rem 0 0;
    padding: 1.5rem 3rem;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 1.4rem;
    text-transform: uppercase;
    font-weight: 500;

    &:focus {
      outline: none;
    }

    &:hover {
      background-color: hsl(from var(--clr-primary) h s l / 0.6);
    }
  }

  [role="tab"][aria-selected="true"] {
    background-color: var(--clr-primary);
  }

  [role="tabpanel"] {
    padding: 15px;
    /* border: 1px solid #ddd; */
  }
</style>
