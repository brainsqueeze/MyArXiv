import React, { Component } from 'react';
import { connect } from 'react-redux';
// import PropTypes from "prop-types";
import { 
  Button, 
  Modal, 
  // ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Card, 
  CardBody,
  Container
} from 'reactstrap';
import DetailCard from './detail_card';

import { applyRating } from '../../actions/rate';

class SummaryCard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      interested: this.props.interested != null ? this.props.interested : false,
      notInterested: this.props.interested != null ? !this.props.interested : false,
      hasUpdated: false
    };

    this.toggle = this.toggle.bind(this);
    this.setInterested = this.setInterested.bind(this);
    this.setNotInterested = this.setNotInterested.bind(this);
  }

  toggle() {
    if (this.state.modal && this.state.hasUpdated) {
      let url = this.props.url;
      let id = url.search(/\d{4,}\.\d{4,}/g);
      let version = url.search(/v\d/g);  // the arXiv article ID format, don't care about version number
      let payload = {
        articleId: version > 0 ? url.slice(id, version) : url.slice(id),
        interested: this.state.interested && !this.state.notInterested,
        title: this.props.title,
        content: this.props.summary,
        categories: this.props.categories.join(';'),
        date: this.props.date
      }
      this.props.applyRating(payload);
    }

    this.setState(prevState => ({
      modal: !prevState.modal,
      hasUpdated: false
    }));
  }

  setInterested() {
    this.setState(prevState => ({
      interested: !prevState.interested,
      notInterested: false,
      hasUpdated: !prevState.hasUpdated
    }));
  }

  setNotInterested() {
    this.setState(prevState => ({
      interested: false,
      notInterested: !prevState.notInterested,
      hasUpdated: !prevState.hasUpdated
    }));
  }

  render() {
    return (
      <div className="content">
        <Card>
          <CardBody>
            <h2 className="article-title">{this.props.title}</h2>
            <a href={this.props.url} target="_blank">{this.props.url}</a>
          </CardBody>
        </Card>

        <Button color="danger" onClick={this.toggle}>{this.props.buttonLabel}</Button>

        <Container>
          <Modal isOpen={this.state.modal} toggle={this.toggle} className="article-modal">
            <ModalBody>
              <DetailCard 
                status={this.state.status} 
                toggle={this.toggle} 
                {...this.props}
              /> 
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.toggle} style={{ marginBottom: '1rem' }}>Close</Button>
              <Button 
                className="interested"
                color="primary" 
                onClick={this.setInterested} 
                style={{ marginBottom: '1rem' }}
              >
                <i className={`fas fa-heart ${this.state.interested}`}></i>
              </Button>
              <Button 
                className="not-interested"
                color="primary" 
                onClick={this.setNotInterested} 
                style={{ marginBottom: '1rem' }}
              >
                <i className={`fas fa-heart-broken ${this.state.notInterested}`}></i>
              </Button>
            </ModalFooter>
          </Modal>
        </Container>
      </div>
    );
  }

}

function mapStateToProps (state) {
  return {
    results: state.search.results
  };
}

export default connect(mapStateToProps, { applyRating })(SummaryCard);