import React from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import firebase from '../../firebase';

class Login extends React.Component {
	state = {
		email: '',
		password: '',
		errors: [],
		loading: false,
	};

	handleChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	displayaErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>);

	handleSubmit = event => {
		event.preventDefault();
		if (this.isFormValid(this.state)) {
			this.setState({
				errors: [],
				loading: true,
			});
			firebase
				.auth()
				.signInAndRetrieveDataWithEmailAndPassword(this.state.email, this.state.password)
				.then(signedInUser => {
					console.log(signedInUser);
				})
				.catch(err => {
					console.error(err);
					this.setState({ errors: this.state.errors.concat(err), loading: false });
				});
		}
	};

	isFormValid = ({ email, password }) => email && password;

	handleInputError = (errors, inputName) => {
		return errors.some(error => error.message.toLowerCase().includes(inputName)) ? 'error' : '';
	};

	render() {
		const { email, password, errors, loading } = this.state;

		return (
			<Grid textAlign="center" verticalAlign="middle">
				<Grid.Column style={{ maxWidth: 450 }}>
					<Header as="h2" icon color="violet" textAlign="center">
						<Icon name="code branch" color="violet" /> login
					</Header>
					<Form size="large" onSubmit={this.handleSubmit}>
						<Segment stacked>
							<Form.Input
								fluid
								name="email"
								icon="mail"
								iconPosition="left"
								placeholder="email"
								type="email"
								onChange={this.handleChange}
								value={email}
								className={this.handleInputError(errors, 'email')}
							/>
							<Form.Input
								fluid
								name="password"
								icon="lock"
								iconPosition="left"
								placeholder="password"
								type="password"
								onChange={this.handleChange}
								value={password}
								className={this.handleInputError(errors, 'password')}
							/>

							<Button
								disabled={loading}
								className={loading ? 'loading' : ''}
								color="violet"
								fluid
								size="large"
							>
								submit
							</Button>
						</Segment>
					</Form>
					{errors.length > 0 && (
						<Message error>
							<h3>errors</h3>
							{this.displayaErrors(errors)}
						</Message>
					)}
					<Message>
						dont have an account <Link to="/register">register</Link>
					</Message>
				</Grid.Column>
			</Grid>
		);
	}
}

export default Login;
