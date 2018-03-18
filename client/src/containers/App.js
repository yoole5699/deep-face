import React from 'react';
import { withRouter } from 'react-router';
import { inject, observer } from 'mobx-react';
import { Switch, Route } from 'react-router-dom';
import { auth, routes } from '../router';
import styled from 'styled-components';
import NoMatch from './NoMatch';
import AuthRedirect from './AuthRedirect';

const Main = styled.div`
	position: relative;
	margin: auto;

	max-width: 960px;
	height: 100%;
`;

const App = ({ userStore }) => (
	<Switch>
		<Route
			exact
			path="/404"
			component={() => (<NoMatch />)}
		/>
		<Main>
			<Switch>
				{
					auth.map(route => (
						<Route
							key={route.path}
							{...route}
						/>
					))
				}
				{
					userStore.currentUser
						? routes.map(route => (
								<Route
									key={route.path}
									{...route}
								/>
							))
						: <Route
								path="/"
								component={AuthRedirect}
							/>
				}
			</Switch>
		</Main>
	</Switch>
)

export default inject('userStore')(withRouter(observer(App)));
