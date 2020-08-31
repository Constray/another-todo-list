<template>
  <div class="item-list">
    <div class="item-list-name">
      {{ listName }}
    </div>
    <div v-if="!(checkItems.length <= 1)" class="sort-strategy-selector">
      <div @click="onToggleAscendingAction">
        <div v-if="!isAscendingSort">
          <b-icon-sort-down class="sort-icon"></b-icon-sort-down>
        </div>
        <div v-else>
          <b-icon-sort-down-alt class="sort-icon"></b-icon-sort-down-alt>
        </div>
      </div>
      <label class="sort-field-selector">
        <select @change="onSortFieldChange" v-model="currentSortStrategyId">
          <option v-for="sortStrategy in sortStrategies" :key="sortStrategy.id" :value="sortStrategy.id">
            {{ sortStrategy.name }}
          </option>
        </select>
      </label>
    </div>
    <div class="task-list" v-for="item in sortedItems" :key="item.id">
      <check-item :id="item.id"
                  :value="item.value"
                  :completed="item.completed"
                  :creation-date="item.creationDate"
                  :completion-date="item.completionDate">
      </check-item>
    </div>
    <div v-if="!(checkItems.length === 0)" class="clear-button-outer">
      <button class="clear-button" @click="onClearAction">
        Clear List
      </button>
    </div>
    <div v-if="checkItems.length === 0" class="list-empty-message">
      <p>
        Can't find any tasks for current filters...
      </p>
    </div>
  </div>
</template>

<script>
import CheckItem from "@/components/CheckItem/CheckItem";
import {BIconSortDown} from 'bootstrap-vue';
import {BIconSortDownAlt} from 'bootstrap-vue';

export default {
  name: "ItemList",

  components: {
    CheckItem,
    BIconSortDown,
    BIconSortDownAlt,
  },

  props: {
    listId: {
      type: String,
      required: true,
    },
    listName: {
      type: String,
      required: true,
    },
    checkItems: {
      type: Array,
      required: true,
    },
    sortStrategies: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      isAscendingSort: true,
      currentSortStrategyId: '',
    }
  },

  created() {
    const firstSortStrategyId = this.sortStrategies
        .map((strategy) => strategy.id)
        .find((id) => id);

    const currentMap = this.getCurrentSortMap();

    if (currentMap.has(this.listId)) {
      const savedSortState = currentMap.get(this.listId);
      if (savedSortState) {
        this.isAscendingSort = savedSortState.isAscendingSort
        this.currentSortStrategyId = savedSortState.currentSortStrategyId ? savedSortState.currentSortStrategyId : firstSortStrategyId;
      }
    }

    if (this.currentSortStrategyId === '') {
      this.currentSortStrategyId = firstSortStrategyId;
    }
  },

  methods: {
    getCurrentSortMap() {
      const currentSerializedMap = localStorage.listSortStrategies;
      let currentMap;
      if (!currentSerializedMap || currentSerializedMap === '{}') {
        currentMap = new Map()
      } else {
        currentMap = new Map(JSON.parse(currentSerializedMap));
      }

      return currentMap;
    },

    updateCurrentSortState() {
      const currentState = {
        isAscendingSort: this.isAscendingSort,
        currentSortStrategyId : this.currentSortStrategyId,
      };

      const currentMap = this.getCurrentSortMap();

      currentMap.set(this.listId, currentState);
      localStorage.listSortStrategies = JSON.stringify(Array.from(currentMap.entries()));
    },

    updateOrCreateCurrentSortState() {
      if (!localStorage.listSortStrategies) {
        localStorage.listSortStrategies = JSON.stringify(new Map());
      }

      this.updateCurrentSortState();
    },

    onToggleAscendingAction() {
      this.isAscendingSort = !this.isAscendingSort;
      this.updateOrCreateCurrentSortState();
    },

    onSortFieldChange() {
      this.updateOrCreateCurrentSortState();
    },

    onClearAction() {
      const itemIds = this.checkItems
          .map((item) => item.id);
      this.$store.commit('removeCheckItems', itemIds);
    },
  },

  computed: {
    sortedItems() {
      const isAscending = this.isAscendingSort;
      const currentId = this.currentSortStrategyId
      const currentSortStrategy = this.sortStrategies
          .find((strategy) => currentId === strategy.id)

      return this.checkItems.concat().sort((first, second) => isAscending ?
          currentSortStrategy.comparator(first, second) : -currentSortStrategy.comparator(first, second));
    }
  }
}
</script>

<style scoped lang="less" rel='stylesheet/less'>
.item-list {
  margin: auto;
  width: 40%;
  padding-top: 40px;
  padding-bottom: 20px;

  .sort-strategy-selector {
    width: 30%;
    float: right;
    transform: scale(1.5);
    font-size: 16px;

    > * {
      display: inline-block;
    }

    .sort-icon {
      transform: scale(1.25);
      padding: 5px;
      &:hover {
        color: dodgerblue;
        transition: 0.2s;
      }
    }

    .sort-field-selector {
      user-select: none;
      padding: 10px;
      margin-bottom: 5px;
      transform: translate(0, -20%);
    }
  }

  .item-list-name {
    float: left;
    text-align: left;
    font-size: 22px;
    margin-bottom: 10px;
  }

  .clear-button-outer {
    padding: 15px;
    margin-top: 10px;
    margin-bottom: 10px;

    .clear-button {
      user-select: none;
      float: right;
      transform: scale(1.25);
      padding: 5px;
      background-color: #ffffff;
      border: 2px solid dodgerblue;
      border-radius: 3px;
      text-align: center;
      text-transform: uppercase;
      transition: 0.1s;

      &:hover {
        background-color: dodgerblue;
        color: white;
        transition: 0.1s;
      }

      &:focus {
        outline: none;
      }
    }
  }

  .list-empty-message {
    color:darkgrey;
    font-size: 24px;
    text-align: center;
    padding: 20px;
  }
}
</style>