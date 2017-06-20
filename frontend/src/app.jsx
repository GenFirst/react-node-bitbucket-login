import React, { Component } from 'react';
import './app.css';
import axios from 'axios';

class App extends Component {

  constructor(props) {
    super(props);

    this.client = axios.create({
      baseURL: 'http://localhost:4000/api/v1/',
      timeout: 3000,
      headers: {'Accept': 'application/json'},
    });

    this.state = {key: '', isAuthenticated: false, user: null, token: ''};
    this.bitbucketLogin = this.bitbucketLogin.bind(this);
    this.logout = this.logout.bind(this);
  }

  authenticate(key) {
    let that = this;
    this.client.post('/auth/bitbucket', {
      access_token: key
    })
      .then(response => {
        this.client = axios.create({
          baseURL: 'http://localhost:4000/api/v1/',
          timeout: 3000,
          headers: {'x-auth-token': response.headers['x-auth-token']}
        });
        that.setState({isAuthenticated: true, token: response.headers['x-auth-token'], user: response.data, key: key});
      })
      .catch(error => {
        console.log(error);
        that.setState({isAuthenticated: false, token: '', user: null, key: key});
      });
  }

  componentDidMount() {
    let params = window.location.hash.split('&');
    if (params.length > 0 && params[0].startsWith('#access_token=')) {
      let key = decodeURIComponent(params[0].replace('#access_token=', ''));
      this.authenticate(key);
    }
  }

  bitbucketLogin() {
    let key = 'secret_key';
    window.location = `https://bitbucket.org/site/oauth2/authorize?client_id=${key}&response_type=token`;
  }

  logout() {
    this.setState({isAuthenticated: false, token: '', user: null})
  }

  render() {
    let content = !!this.state.isAuthenticated ?
      (
        <div>
          <p>Authenticated</p>
          <div>
            {this.state.user.email}
          </div>
          <div>
            <button onClick={this.logout} className="button" >
              Log out
            </button>
          </div>
        </div>
      ) :
      (
        <button onClick={this.bitbucketLogin} className="button">
          Bitbucket Login
        </button>);

    return (
      <div className="App">
        {content}
      </div>
    );
  }
}

export default App;
