import React, { Component } from 'react';
import { Collapse, Button, CardBody, Card } from 'reactstrap';

class DetailCard extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="detail-content">
        <Card>
          <CardBody>
            <h2 className="article-title">{this.props.title}</h2>
            <h5>{this.props.authors.join(', ')}</h5>
            <a href={this.props.url} target="_blank">{this.props.url}</a>
            <p>{this.props.summary}</p>
          </CardBody>
        </Card>
        <Button color="primary" onClick={this.props.toggle} style={{ marginBottom: '1rem' }}>Close</Button>
      </div>
    );
  }

}

export default DetailCard;