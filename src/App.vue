<template>
  <div id="app">
    <header class="page-header">
      <div class="page-header-root">
        <div class="page-header-name">
          Todo List
        </div>
        <div class="header-search-field">
          <label>
            <input class="search-input"
                   v-model="filterMask"
                   @change="onMaskChange"
                   placeholder="Search...">
          </label>
          <b-icon-search class="search-icon"/>
        </div>
      </div>
    </header>
    <div class="page-body">
      <CreateItem></CreateItem>
      <item-list listId="open"
                 list-name="Open Tasks"
                 :check-items="listEntries | checkItemsFilter(filterMask, false)"
                 :sort-strategies="firstSortStrategiesList">
      </item-list>
      <item-list listId="closed"
                 list-name="Completed Tasks"
                 :check-items="listEntries | checkItemsFilter(filterMask, true)"
                 :sort-strategies="secondSortStrategiesList">
      </item-list>
    </div>
  </div>
</template>

<script>
import ItemList from "@/components/ItemList/ItemList";
import CreateItem from "@/components/CreateItem/CreateItem";
import {BIconSearch} from 'bootstrap-vue';
import { mapState } from 'vuex'

const compareDates = (firstDate, secondDate) => {
  if (firstDate instanceof Date && secondDate instanceof Date) {
    if (firstDate.getTime() < secondDate.getTime()) {
      return -1;
    }

    if (firstDate.getTime() > secondDate.getTime()) {
      return 1;
    }
  }

  return 0;
};

const textSortStrategy = {
  id: 'records',
  name: 'Text',
  comparator: (firstCheckItem, secondCheckItem) => {
    const firstValue = firstCheckItem && firstCheckItem.value ? firstCheckItem.value : ''
    const secondValue = secondCheckItem && secondCheckItem.value ? secondCheckItem.value : ''
    return typeof firstValue === 'string' && typeof secondValue === 'string'
        ? firstValue.localeCompare(secondValue, [], {sensitivity: 'accent'})
        : 0;
  }
};

const creationDateSortStrategy = {
  id: 'creation',
  name: 'Creation Date',
  comparator: (firstCheckItem, secondCheckItem) => {
    const firstValue = firstCheckItem && firstCheckItem.creationDate ? firstCheckItem.creationDate : new Date()
    const secondValue = secondCheckItem && secondCheckItem.creationDate ? secondCheckItem.creationDate : new Date()
    return compareDates(firstValue, secondValue)
  }
};

const completionDateSortStrategy = {
  id: 'completion',
  name: 'Completion Date',
  comparator: (firstCheckItem, secondCheckItem) => {
    const firstValue = firstCheckItem && firstCheckItem.completionDate ? firstCheckItem.completionDate : new Date()
    const secondValue = secondCheckItem && secondCheckItem.completionDate ? secondCheckItem.completionDate : new Date()
    return compareDates(firstValue, secondValue)
  }
};

export default {
  name: 'App',
  components: {
    ItemList,
    CreateItem,
    BIconSearch,
  },
  data() {
    return {
      firstSortStrategiesList: [textSortStrategy, creationDateSortStrategy],
      secondSortStrategiesList: [textSortStrategy, completionDateSortStrategy],

      filterMask: '',
    }
  },

  created() {
    if (localStorage.filterMask) {
      this.filterMask = localStorage.filterMask;
    }
  },

  computed: mapState({
    listEntries: state => state.checkItems,
  }),

  methods: {
    onMaskChange() {
      localStorage.filterMask = this.filterMask;
    }
  },

  filters: {
    checkItemsFilter(checkItemsList, filterMask, isCompleted) {
      const mask = filterMask ? filterMask.toLowerCase() : '';
      return checkItemsList.filter((checkItem) => {
        const value = checkItem.value ? checkItem.value.toLowerCase() : '';
        return checkItem.completed === isCompleted && (mask.length > 0 ? value.includes(mask) : true);
      })
    }
  }
}
</script>

<style lang="less" rel='stylesheet/less'>
body {
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.page-header {
  z-index: 1;
  position: fixed;
  top: 0;
  width: 100%;
  height: 50px;
  background-color: dodgerblue;

  .page-header-root {
    display: inline-block;
    width: 50%;
    color: white;

    .page-header-name {
      float: left;
      font-size: 26px;
      padding: 10px;
    }

    .header-search-field {
      float: right;
      width: 120px;
      border-bottom: 1px solid white;
      margin: 10px;

      .search-input {
        height: 20px;
        background-color: dodgerblue;
        border: none;
        font-size: 18px;
        width: 80%;
        color: white;

        &::placeholder {
          color: white;
        }

        &:focus {
          outline: none;
        }
      }
    }
  }

  + .page-body {
    padding-top: 60px;
  }
}
</style>
