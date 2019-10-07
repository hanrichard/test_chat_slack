import React from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import firebase from '../../firebase';
import md5 from 'md5';

class Register extends React.Component {
	state = {
		username: '',
		email: '',
		password: '',
		passwordConfirmation: '',
		errors: [],
		loading: false,
		userRef: firebase.database().ref('users'),
	};

	handleChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	isFormValid = () => {
		let errors = [];
		let error;

		if (this.isFormEmtpy(this.state)) {
			error = { message: 'fill in all fields' };
			this.setState({ errors: errors.concat(error) });
			return false;
		} else if (!this.isPasswordValid(this.state)) {
			error = { message: 'password invaid' };
			this.setState({ errors: errors.concat(error) });
			return false;
		} else {
			return true;
		}
	};

	isFormEmtpy = ({ username, email, password, passwordConfirmation, errors }) => {
		return !username.length || !email.length || !password.length || !passwordConfirmation.length;
	};

	isPasswordValid = ({ password, passwordConfirmation }) => {
		if (password.length < 6 || passwordConfirmation.length < 6) {
			return false;
		} else if (password !== passwordConfirmation) {
			return false;
		} else {
			return true;
		}
	};

	displayaErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>);

	handleSubmit = event => {
		event.preventDefault();
		if (this.isFormValid()) {
			this.setState({
				errors: [],
				loading: true,
			});
			firebase
				.auth()
				.createUserWithEmailAndPassword(this.state.email, this.state.password)
				.then(createdUser => {
					console.log(createdUser);
					createdUser.user
						.updateProfile({
							displayName: this.state.username,
							photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`,
						})
						.then(() => {
							this.setState({ loading: false });
							this.saveUser(createdUser).then(() => {
								console.log('user saved');
							});
						})
						.catch(err => {
							console.error(err);
							this.setState({ errors: this.state.errors.concat(err), loading: false });
						});
				})
				.catch(err => {
					console.error(err);
					this.setState({ errors: this.state.errors.concat(err), loading: false });
				});
		}
	};

	saveUser = createdUser => {
		return this.state.userRef.child(createdUser.user.uid).set({
			name: createdUser.user.displayName,
			avatar: createdUser.user.photoURL,
		});
	};

	handleInputError = (errors, inputName) => {
		return errors.some(error => error.message.toLowerCase().includes(inputName)) ? 'error' : '';
	};

	render() {
		const { username, email, password, passwordConfirmation, errors, loading } = this.state;

		return (
			<Grid textAlign="center" verticalAlign="middle">
				<Grid.Column style={{ maxWidth: 450 }}>
					<Header as="h2" icon color="orange" textAlign="center">
						<Icon name="puzzle piece" color="orange" /> register
					</Header>
					<Form size="large" onSubmit={this.handleSubmit}>
						<Segment stacked>
							<Form.Input
								fluid
								name="username"
								icon="user"
								iconPosition="left"
								placeholder="username"
								type="text"
								onChange={this.handleChange}
								value={username}
								className={this.handleInputError(errors, 'username')}
							/>
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
							<Form.Input
								fluid
								name="passwordConfirmation"
								icon="repeat"
								iconPosition="left"
								placeholder="password confirmation"
								type="password"
								onChange={this.handleChange}
								value={passwordConfirmation}
								className={this.handleInputError(errors, 'password')}
							/>

							<Button
								disabled={loading}
								className={loading ? 'loading' : ''}
								color="orange"
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
						already a user <Link to="/login">login</Link>
					</Message>
				</Grid.Column>
			</Grid>
		);
	}
}

export default Register;
