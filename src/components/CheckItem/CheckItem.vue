<template>
  <div class="check-item">
    <label class="check-item-checkbox">
      <input type="checkbox" v-model="initialCompletionState"
             @input.prevent.stop="onCheckboxToggle">
    </label>
    <div class="check-item-text"
         contenteditable="true"
         @dblclick="onDoubleClick"
         @blur="onBlur"
         @focus="onFocus"
         @keydown.enter="onEnter"
         @keydown.esc="onEscape">
      {{ value }}
    </div>
    <div class="check-item-time">
      <div class="creation-time">
        {{ creationTime }}
      </div>
      <div v-if="initialCompletionState && completionTime" class="completion-time">
        {{ completionTime }}
      </div>
    </div>
    <div class="remove-action" @click="onRemoveAction">
      <b-icon-trash-fill class="trash-icon"></b-icon-trash-fill>
    </div>
  </div>
</template>

<script>
import {BIconTrashFill} from 'bootstrap-vue'

export default {
  name: "CheckItem",

  components: {
    BIconTrashFill
  },

  props: {
    id: {
      type: Number,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      required: true,
    },
    creationDate: {
      type: Date,
      required: true,
    },
    completionDate: {
      type: Date,
      required: false,
    },
  },

  data() {
    return {
      editEnabled: false,
      initialCompletionState: this.completed,
    }
  },

  methods: {
    onFocus(e) {
      if (!this.editEnabled) {
        e.currentTarget.blur()
      }
    },

    onDoubleClick(e) {
      this.editEnabled = true;
      const el = e.target;
      el.focus();
      if (typeof window.getSelection != "undefined"
          && typeof document.createRange != "undefined") {
        let range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        let sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
    },

    onBlur(e) {
      if (this.editEnabled) {
        this.$store.commit('editItemText', {
          itemId: this.id,
          itemText: e.target.innerText,
        });
      }
      this.editEnabled = false;
    },

    onEnter(e) {
      e.target.blur();
    },

    onEscape(e) {
      this.editEnabled = false;
      e.target.innerText = this.value;
      e.target.blur();
    },

    onCheckboxToggle() {
      if (this.initialCompletionState) {
        this.$store.commit('unCheckItem', this.id);
      } else {
        this.$store.commit('checkItem', this.id);
      }
    },

    onRemoveAction() {
      this.$store.commit('removeCheckItem', this.id);
    }
  },

  computed: {
    creationTime() {
      return this.creationDate.toLocaleTimeString().substr(0, 5);
    },

    completionTime() {
      return this.completionDate != null ? this.completionDate.toLocaleTimeString()
          .substr(0, 5) : null;
    }
  }
}
</script>

<style scoped lang="less" rel='stylesheet/less'>
.check-item {
  display: flex;
  width: 550px;
  overflow: hidden;
  border-radius: 6px;
  margin-top: 20px;
  box-shadow: 1px 2px 2px 1px rgba(0, 0, 0, 0.2), 1px 1px 1px 1px rgba(0, 0, 0, 0.19);
  min-height: 100px;

  > * {
    display: inline-block;
    margin-top: 20px;
  }

  .check-item-checkbox {
    float: left;
    transform: scale(1.75);
    margin-top: 30px;
    margin-left: 20px;
    height: 100%;
  }

  .check-item-text {
    float: left;
    text-align: left;
    outline: 0;
    width: 60%;
    margin-left: 25px;
    margin-bottom: 10px;
    font-size: 20px;
  }

  .check-item-time {
    user-select: none;
    transform: translate(150%, 0);
    float: right;
    font-size: medium;
    font-weight: bold;
    margin-right: 10px;
    margin-top: 10px;
    transition: 0.2s;

    .creation-time {
      color: darkgrey;
    }

    .completion-time {
      padding-top: 2px;
      color: black;
    }
  }

  .remove-action {
    display: none;
  }

  &:hover {
    overflow: hidden;

    .check-item-time {
      transform: translate(70%, 0);
      margin-right: 0;
      transition: 0.2s;
    }

    .remove-action {
      float: right;
      display: inline-block;
      border: solid slategrey;
      border-width: 0 0 0 2px;
      transform: translate(120%, 0);
      width: 20px;
      min-height: 60px;
      height: 100%;
      margin: 0;
      padding: 20px 0 20px 20px;
      vertical-align: middle;
      horiz-align: center;
      transition: 0.3s;

      .trash-icon {
        margin-top: 20px;
        transform: scale(2);
      }

      &:hover {
        color: dodgerblue;
        transition: 0.2s;
      }
    }
  }
}
</style>