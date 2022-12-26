import { createRouter, createWebHistory} from 'vue-router'
// 1. Define route components.
// These can be imported from other files
const Dashboard = "./components/Dashboard.vue"
const About = "./components/About.vue"

// 2. Define some routes
// Each route should map to a component.
// We'll talk about nested routes later.
const routes: any[] = [
  { path: '/', component: () => import( "./components/Dashboard.vue")  },
  { path: '/about', component: () => import( "./components/About.vue") },
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(),
  routes, // short for `routes: routes`
})

// export router
export default router



