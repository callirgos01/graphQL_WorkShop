import React from 'react';
import ListOfRepositories from './ListOfRepositories';
import { gql, graphql } from 'react-apollo';
import LoadingScreen from './LoadingScreen';

class StarredRepositories extends React.Component {
  static navigationOptions = {
    title: 'Starred repositories',
  };

  render() {
    if(this.props.data.loading) {
      return <LoadingScreen />;
    } else {
      console.log(this.props.data.viewer)
      console.log(this.props.data.viewer.starredRepositories)
      return (
        <ListOfRepositories 
          repositories={this.props.data.viewer.starredRepositories}
          />
      );
    }
    return <ListOfRepositories />;
  }
}

const StarredQuery = gql`
  query {
    viewer {
      login
      name
      starredRepositories(first: 10) {
        nodes {
          id
          nameWithOwner
          viewerHasStarred
        }
      }
    }
  }
`;

export default graphql(StarredQuery)(StarredRepositories);
