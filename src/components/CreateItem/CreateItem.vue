<template>
<div class="create-item">
  <label class="text-input-label">
    <input class="text-input" type="text" placeholder="New task..." v-model="taskText"/>
  </label>
  <div class="create-button-outer">
    <button class="create-button" @click="onCreateAction">
      Add
    </button>
  </div>
</div>
</template>

<script>
export default {
  name: "CreateItem",
  data() {
    return {
      taskText: '',
    };
  },
  methods: {
    onCreateAction() {
      this.$store.commit('addCheckItem', this.taskText);
      this.taskText = '';
    }
  }
}
</script>

<style scoped lang="less" rel='stylesheet/less'>
.create-item {
  display: inline-block;
  width: 500px;
  transform: scale(1.2);
  margin-top: 20px;

  .text-input-label {
    float: left;

    .text-input {
      border: none;
      border-bottom: 1px solid darkgrey;
      width: 400px;
      height: 40px;
      font-size: 20px;

      &:focus {
        outline: none;
      }
    }
  }

  .create-button-outer {
    float: right;
    padding: 15px;
    user-select: none;

    .create-button {
      padding: 5px;
      background-color: #ffffff;
      border: 2px solid dodgerblue;
      border-radius: 3px;
      text-align: center;
      text-transform: uppercase;
      transition: 0.1s;
      width: 60px;

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
}
</style>