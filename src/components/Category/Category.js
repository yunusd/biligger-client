import React from 'react';
import { Query } from 'react-apollo';
import { NavLink } from 'react-router-dom';
import { GET_CATEGORIES } from './queries';

const Category = () => (
  <Query query={GET_CATEGORIES}>
    {({ data, loading, error }) => {
        if (loading) return 'Yükleniyor';
        if (error) return 'Hata';
        return (
          data.getCategories.map(({ id, name }) => (
            <NavLink
              key={id}
              to={{
                pathname: `/${name.replace(/\s/g, '-')}`,
              }}
              activeStyle={{
                fontWeight: 'bold',
                color: 'green',
              }}
              style={{ color: 'black', padding: '0px 20px', textTransform: 'capitalize' }}
            >
              {name}
            </NavLink>
          ))
        );
      }}
  </Query>
  );

export default Category;
