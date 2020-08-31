import Vue from 'vue';
import Vuex from 'vuex'

Vue.use(Vuex);

const saveState = (state) => {
    localStorage.checkItemsIdCounter = state.checkItemsIdCounter;
    localStorage.checkItems = JSON.stringify(state.checkItems)
};

export default new Vuex.Store({
    state: {
        checkItems: [],
        checkItemsIdCounter: 0,
    },
    mutations: {
        initialiseStore(state) {
            if (localStorage.checkItemsIdCounter && localStorage.checkItems) {
                state.checkItems = JSON.parse(localStorage.checkItems)
                state.checkItemsIdCounter = Number.parseInt(localStorage.checkItemsIdCounter);
                state.checkItems.forEach((item) => {
                    item.creationDate = new Date(item.creationDate);
                    if (item.completionDate) {
                        item.completionDate = new Date(item.completionDate);
                    }
                })
            }
        },

        addCheckItem(state, checkItemText) {
            const newCheckItem = {
                id: ++state.checkItemsIdCounter,
                value: checkItemText,
                completed: false,
                creationDate: new Date(),
                completionDate: null,
            }
            state.checkItems.push(newCheckItem);
            saveState(state);
        },

        removeCheckItem(state, itemId) {
            const indexToRemove = state.checkItems.findIndex((item) => item.id === itemId);
            state.checkItems.splice(indexToRemove, 1);
            saveState(state);
        },

        removeCheckItems(state, itemIds) {
            state.checkItems = state.checkItems
                .filter((item) => !itemIds.includes(item.id));
        },

        editItemText(state, payload) {
            if (payload.itemId && payload.itemText) {
                const itemToChange = state.checkItems.find((item) => item.id === payload.itemId);
                itemToChange.value = payload.itemText;
                saveState(state);
            }
        },

        checkItem(state, itemId) {
            const itemToComplete = state.checkItems.find((item) => item.id === itemId);
            itemToComplete.completed = true;
            itemToComplete.completionDate = new Date();
            saveState(state);
        },

        unCheckItem(state, itemId) {
            const itemToComplete = state.checkItems.find((item) => item.id === itemId);
            itemToComplete.completed = false;
            itemToComplete.completionDate = null;
            saveState(state);
        },
    },
})