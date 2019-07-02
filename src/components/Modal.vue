<template>
  <div>
    <div class="md-modal modal-msg md-modal-transition md-show">
      <div class="md-modal-inner">
        <div class="md-top">
          <div class="md-title">
            <slot name="md-title"></slot>
          </div>
          <button class="md-close" @click="handleHidden">Close</button>
        </div>
        <div class="md-content">
          <div class="confirm-tips">
            <slot name="msg"></slot>
          </div>
          <slot name="btnGroup"></slot>
        </div>
      </div>
    </div>
    <div class="md-overlay"  @click="handleHidden"></div>
  </div>
</template>

<script>
  export default {
    name: "Modal",
    data() {
      return {
      }
    },
    mounted() {
    },
    methods:{
      handleHidden(){
        this.$emit('hidden')
      }
    }
  }
</script>

<style scoped>
  @import "../assets/css/login.css";
</style>
