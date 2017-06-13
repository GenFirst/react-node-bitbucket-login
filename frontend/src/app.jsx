import React, { Component } from 'react';
import './app.css';
import axios from 'axios';

class App extends Component {

  constructor(props) {
    super(props);

    let client = axios.create({
      baseURL: 'http://localhost:4000/api/v1/',
      timeout: 1000,});

    this.state = {key: '', isAuthenticated: false, user: null};
    this.bitbucketLogin = this.bitbucketLogin.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    let path = window.location.pathname;
    if (path.startsWith('/callback')) {
      let key = window.location.hash.split('&')[0].replace('#access_token=', '');
      this.setState({key: key});

      this.client.get('/auth/bitbucket')
        .then(response => {
          this.client = axios.create({
            baseURL: 'http://localhost:4000/api/v1/',
            timeout: 1000,
            headers: {'x-auth-token': response.headers['x-auth-token']}
          });
          this.setState({isAuthenticated: true, token: response.headers['x-auth-token'], user: response.data});
        })
        .catch(error => {
          this.setState({isAuthenticated: false, token: '', user: null});
        });
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
            {this.state.user}
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
