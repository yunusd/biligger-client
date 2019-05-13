import React from 'react';
import { Query } from 'react-apollo';
import { Menu } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { GET_CATEGORIES } from './queries';

const Category = () => (
  <Query query={GET_CATEGORIES}>
    {({ data, loading, error }) => {
        if (loading) return null;
        if (error) return 'Hata';
        return (
          data.getCategories.map(({ id, name }) => (
            <Menu.Item
              key={id}
              name={name}
            >
              <NavLink
                to={{
                  pathname: `/${name.replace(/\s/g, '-')}`,
                }}
                activeStyle={{
                  fontWeight: 'bold',
                  color: 'green',
                }}
                style={{ color: 'black', textTransform: 'capitalize' }}
              >
                {name}
              </NavLink>
            </Menu.Item>
          ))
        );
      }}
  </Query>
  );

export default Category;
