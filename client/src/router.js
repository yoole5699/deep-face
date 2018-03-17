import PublicPage from 'containers/PublicPage';
import TaskSpace from 'containers/TaskSpace';
import Login from 'containers/auth/Login';
import Register from 'containers/auth/Register';
import ReviewTask from 'containers/ReviewTask';

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
    exact: true,
    path: '/task/:_id/review',
    component: ReviewTask,
  },
  {
    path: '/',
    component: PublicPage,
  },
];

export default routes;
