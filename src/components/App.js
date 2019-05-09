import React from 'react';
import {
 BrowserRouter as Router, Route, Redirect, Switch,
} from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloProvider as ApolloProviderHooks } from 'react-apollo-hooks';

import { GET_AUTH_STATUS } from '../queries';

import ScrollTop from './ScrollTop';
import client from './ApolloClient';
import Header from './Header';
import Feed from './Feed';
import LogIn from './LogIn';
import Register from './Register';
import { Post, AddPost, EditPost } from './Post';
import { List as Category } from './Category/Post';
import NotFound from './NotFound';
import Auth from './Auth';
import Profile from './Profile';
import { EditUser } from './Profile/User';
import { Comment, EditComment } from './Comment';
import Search from './Search';
import Footer from './Footer';
import SiteInfo from './SiteInfo';

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={
        (props) => {
          const { currentUser } = client.readQuery({ query: GET_AUTH_STATUS });
          return (
          currentUser.isLoggedIn
        ? <Component {...props} />
        : (
          <Redirect to={{
              pathname: '/giriş',
              state: { from: props.location },
            }}
          />
          )
        );
      }
    }
  />
);

const App = () => (
  <ApolloProvider client={client}>
    <ApolloProviderHooks client={client}>
      <Router>
        <ScrollTop>
          <React.Fragment>
            <Auth>
              <Route path="/giriş" exact component={LogIn} />
              <Route path="/kayıt" exact component={Register} />
              <Header>
                <Switch>
                  <PrivateRoute path="/" exact component={Feed} />
                  <PrivateRoute path="/yeni" exact component={Feed} />
                  <PrivateRoute path="/ara" exact component={Search} />
                  <PrivateRoute path="/yeni-bilig" exact component={AddPost} />
                  <PrivateRoute path="/(teknoloji|bilim|yaşam-biçimi|spor|sanat)/" exact component={Category} />
                  <Route path="/(hakkinda|gizlilik-politikasi-ve-hizmet-sartlari|kullanim-kosullari)/" exact component={SiteInfo} />
                  <PrivateRoute path="/@:username" exact component={Profile} />
                  <PrivateRoute path="/@:username/ayarlar" component={EditUser} />
                  <Route path="/@:username/:content/:comment" exact component={Comment} />
                  <PrivateRoute path="/@:username/:content/:comment/düzenle" exact component={EditComment} />
                  <Route path="/:title" exact component={Post} />
                  <PrivateRoute path="/:title/düzenle" exact component={EditPost} />
                  <PrivateRoute component={NotFound} />
                </Switch>
                <Route component={Footer} />
              </Header>
            </Auth>
          </React.Fragment>
        </ScrollTop>
      </Router>
    </ApolloProviderHooks>
  </ApolloProvider>
);

export default App;
