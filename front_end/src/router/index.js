import { createRouter, createWebHistory } from 'vue-router';
import AdminPage from '../views/AdminPage.vue'; // Pastikan path ini benar

const routes = [
  {
    path: '/admin',
    name: 'AdminPage',
    component: AdminPage
  },
  // Tambahkan rute lain sesuai kebutuhan
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
