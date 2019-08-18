import React from 'react';
import {
 BrowserRouter as Router, Route, Redirect, Switch,
} from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloProvider as ApolloProviderHooks } from 'react-apollo-hooks';
import { Helmet } from 'react-helmet';

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
import { VerifyEmail, ResetPassword, SendConfirmationEmail } from './Confirmation';
import Footer from './Footer';
import SiteInfo from './SiteInfo';

const RedirectRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={
      (props) => {
        const { pathname } = props.location;
        const lastLetter = pathname.charAt(pathname.length - 1);

        return (
          lastLetter !== '/'
          ? <Component {...props} />
          : (
            <Redirect to={{
                pathname: pathname.slice(0, -1),
                state: { from: props.location },
              }}
            />
          )
        );
      }
    }
  />
);

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={
        (props) => {
          const { currentUser } = client.readQuery({ query: GET_AUTH_STATUS });
          const { pathname } = props.location;
          const lastLetter = pathname.charAt(pathname.length - 1);

          if (lastLetter === '/' && pathname !== '/') return <Redirect to={`${pathname.slice(0, -1)}`} />;
          return (
          currentUser.isLoggedIn
        ? <Component {...props} />
        : (
          <Redirect to={{
              pathname: '/giris',
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
              <Helmet>
                <title>Biligger</title>
                <meta
                  name="description"
                  content="Biligger doğruların, fikirlerin karşılaşmasıyla ortaya çıktığına inanan, bilgiyi paylaşarak, tartışarak büyütmeyi ve geliştirmeyi amaç edinmiş, saygıyı, nezaketi öne alan düşünürlerin (biligger’ların) buluştuğu ütopik bir tartışma platformudur."
                />
              </Helmet>
              <RedirectRoute path="/giris" exact component={LogIn} />
              <RedirectRoute path="/kayit" exact component={Register} />
              <Header>
                <Switch>
                  {/* Root and Functional Routes */}
                  <PrivateRoute path="/" exact component={Feed} />
                  <PrivateRoute path="/yeni" exact component={Feed} />
                  <PrivateRoute path="/ara" exact component={Search} />
                  <PrivateRoute path="/yeni-bilig" exact component={AddPost} />

                  {/* Category and Static Routes */}
                  <PrivateRoute path="/(bilim|teknoloji|sanat|politika|ekonomi|edebiyat)/" exact component={Category} />
                  <RedirectRoute path="/(hakkinda|gizlilik-politikasi-ve-hizmet-sartlari|kullanim-kosullari)/" exact component={SiteInfo} />

                  {/* User Routes */}
                  <PrivateRoute path="/@:username" exact component={Profile} />
                  <PrivateRoute path="/@:username/ayarlar" component={EditUser} />
                  <RedirectRoute path="/@:username/:comment" exact component={Comment} />
                  <PrivateRoute path="/@:username/:comment/duzenle" exact component={EditComment} />

                  {/* Confirmation Routes */}
                  <RedirectRoute path="/giris/sifirla" exact component={SendConfirmationEmail} />
                  <RedirectRoute path="/confirmation_verify_email&:hash" exact component={VerifyEmail} />
                  <RedirectRoute path="/confirmation_reset_password&:hash" exact component={ResetPassword} />

                  {/* Post Routes */}
                  <RedirectRoute path="/:title" exact component={Post} />
                  <PrivateRoute path="/:title/duzenle" exact component={EditPost} />
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
