import React from 'react';
import ListOfRepositories from './ListOfRepositories';
import { gql, graphql } from 'react-apollo';
import LoadingScreen from './LoadingScreen';

class StarredRepositories extends React.Component {
  static navigationOptions = {
    title: 'Starred repositories',
  };
  loadMoreEntries = () => {
    // Don't repeat it when loading
    if (!this.props.data.loading) {
      const viewer = this.props.data.viewer;
      // if there is no more data, do nothing
      if (!viewer.starredRepositories.pageInfo.hasNextPage) {
        return;
      }
      return this.props.data.fetchMore({
        query: StarredQuery,
        variables: {
          // pass current last cursor
          cursor: viewer.starredRepositories.pageInfo.endCursor,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newItems = fetchMoreResult.viewer.starredRepositories.nodes;
          return {
            // return the update set
            viewer: {
              ...fetchMoreResult.viewer,
              starredRepositories: {
                ...fetchMoreResult.viewer.starredRepositories,
                // append newly received items to the old ones
                nodes: [
                  ...previousResult.viewer.starredRepositories.nodes,
                  ...newItems,
                ],
              },
            },
          };
        },
      });
    }
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
          onLoadMore={this.loadMoreEntries}
          onRefresh={()=>this.props.data.refetch({first: 20})}
          refreshing={this.props.data.loading}
          />
      );
    }
    return <ListOfRepositories />;
  }
}

const StarredQuery = gql`
  query( $cursor: String) {
    viewer {
      login
      name
      starredRepositories(first: 10, after: $cursor) {
        totalCount
        nodes {
          id
          nameWithOwner
          viewerHasStarred
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

export default graphql(StarredQuery)(StarredRepositories);
