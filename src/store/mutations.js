import {UPDATE_COUNT} from './mutationsTypes'

const mutations = {
  UPDATE_COUNT: (state, num) => {
    state.cartCount = num
  }
}

export default mutations
