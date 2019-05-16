import React, { useState } from 'react';
import { Mutation } from 'react-apollo';

import { Icon } from 'semantic-ui-react';
import { ADD_LIKE, REMOVE_LIKE } from './mutations';

const Like = (props) => {
  const {
    like,
    id,
    parentModel,
  } = props;
  const [change, setChange] = useState();
  const [status, setStatus] = useState(like);

  return (
    <Mutation mutation={ADD_LIKE}>
      {(addLike, { loading, error }) => (
        <React.Fragment>
          { !status
             ? (
               <Icon
                 name="idea"
                 size="small"
                 color={status || change ? 'yellow' : 'grey'}
                 onClick={(e) => {
                    e.preventDefault();
                    addLike({ variables: { id, parentModel } });
                    setChange(true);
                    setStatus(true);
                  }}
                 style={{ cursor: 'pointer' }}
               />
              )
              : null
            }
          <Mutation mutation={REMOVE_LIKE}>
            {(removeLike, { loading, error }) => {
                if (!status) return null;
                return (
                  <Icon
                    name="idea"
                    size="small"
                    color={status || change ? 'yellow' : 'grey'}
                    onClick={(e) => {
                      e.preventDefault();
                      removeLike({ variables: { id, parentModel } });
                      setChange(false);
                      setStatus(false);
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                );
              }}
          </Mutation>
        </React.Fragment>
        )}
    </Mutation>
  );
};

export default Like;
