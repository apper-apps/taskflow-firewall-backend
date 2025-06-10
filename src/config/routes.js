import HomePage from '@/components/pages/HomePage';
import NotFoundPage from '@/components/pages/NotFoundPage'; // Although not in routeArray, keeping for consistency in import style

export const routes = {
  home: {
    id: 'home',
    label: 'Tasks',
    path: '/home',
    icon: 'CheckSquare',
component: HomePage
  }
};

export const routeArray = Object.values(routes);