import React, { Component } from 'react';
import { connect } from 'react-redux';

class Home extends Component {
  render() {
    return (
      <div>
        <h1>Home</h1>
      </div>
    );
  }
}
const mapStateToProps = () => ({});
export default connect(mapStateToProps, {})(Home);
