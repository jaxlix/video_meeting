import Vue from 'vue'
import Router from 'vue-router'
import index from '@/views/index.vue'
import heatMap from '@/components/common/heatMap/heatMap.vue'
import trajectory from '@/components/common/trajectory/trajectory.vue'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/heatMap',
      name: 'heatMap',
      component: heatMap
    },
    {
      path: '/trajectory/:gpsId/:memberType',
      name: 'trajectory',
      component: trajectory
    }
  ]
})
