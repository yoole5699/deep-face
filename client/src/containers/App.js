import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from '../router';
import styled from 'styled-components';
import NoMatch from './NoMatch';

const Main = styled.div`
	position: relative;
	margin: auto;

	max-width: 960px;
	height: 100%;
`;

const App = () => (
	<Switch>
		<Route
			exact
			path="/404"
			component={() => (<NoMatch />)}
		/>
		<Main>
			<Switch>
				{
					routes.map(route => (
						<Route
							key={route.path}
							{...route}
						/>
					))
				}
			</Switch>
		</Main>
	</Switch>
)

export default App;
