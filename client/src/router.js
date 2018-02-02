import PublicPage from 'containers/PublicPage';
import TaskSpace from 'containers/TaskSpace';
import Login from 'containers/auth/Login';
import Register from 'containers/auth/Register';

const routes = [
  {
    exact: true,
    path: '/login',
    component: Login,
  },
  {
    exact: true,
    path: '/register',
    component: Register,
  },
  {
    exact: true,
    path: '/task/:_id/label',
    component: TaskSpace,
  },
  {
    path: '/',
    component: PublicPage,
  },
];

export default routes;
