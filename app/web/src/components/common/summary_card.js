import React, { Component } from 'react';
import PropTypes from "prop-types";
import { 
  Button, 
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Card, 
  CardBody,
  Container
} from 'reactstrap';
import DetailCard from './detail_card';

class SummaryCard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  render() {
    return (
      <div className="content">
        <Card>
          <CardBody>
            <h2 className="article-title">{this.props.title}</h2>
            <a href={this.props.url} target="_blank">{this.props.url}</a>

            {/* <DetailCard status={this.state.status} toggle={this.toggle} {...this.props}/> */}
          </CardBody>
        </Card>

        <Button color="danger" onClick={this.toggle}>{this.props.buttonLabel}</Button>

        <Container>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className="article-modal">
          {/* <ModalHeader toggle={this.toggle}>{this.props.title}</ModalHeader> */}
          <ModalBody>
            <DetailCard 
              status={this.state.status} 
              toggle={this.toggle} {...this.props}/> 
          </ModalBody>
          <ModalFooter>
            {/* <Button color="primary" onClick={this.toggle}>Do Something</Button>{' '} */}
            {/* <Button color="secondary" onClick={this.toggle}>Cancel</Button> */}
          </ModalFooter>
        </Modal>
        </Container>
      </div>
    );
  }

}

Modal.propTypes = {
  // boolean to control the state of the popover
  isOpen:  PropTypes.bool,
  autoFocus: PropTypes.bool,
  // if modal should be centered vertically in viewport
  centered: PropTypes.bool,
  // corresponds to bootstrap's modal sizes, ie. 'lg' or 'sm'
  size: PropTypes.string,
  // callback for toggling isOpen in the controlling component
  toggle:  PropTypes.func,
  role: PropTypes.string, // defaults to "dialog"
  // used to reference the ID of the title element in the modal
  labelledBy: PropTypes.string,
  keyboard: PropTypes.bool,
  // control backdrop, see http://v4-alpha.getbootstrap.com/components/modal/#options
  backdrop: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(['static'])
  ]),
  // allows for a node/component to exist next to the modal (outside of it). Useful for external close buttons
  // external: PropTypes.node,
  // called on componentDidMount
  onEnter: PropTypes.func,
  // called on componentWillUnmount
  onExit: PropTypes.func,
  // called when done transitioning in
  onOpened: PropTypes.func,
  // called when done transitioning out
  onClosed: PropTypes.func,
  className: PropTypes.string,
  wrapClassName: PropTypes.string,
  modalClassName: PropTypes.string,
  backdropClassName: PropTypes.string,
  contentClassName: PropTypes.string,
  // boolean to control whether the fade transition occurs (default: true)
  fade: PropTypes.bool,
  cssModule: PropTypes.object,
  // zIndex defaults to 1000.
  zIndex: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  // backdropTransition - controls backdrop transition
  // timeout is 150ms by default to match bootstrap
  // see Fade for more details
  // backdropTransition: PropTypes.shape(Fade.propTypes),
  // modalTransition - controls modal transition
  // timeout is 300ms by default to match bootstrap
  // see Fade for more details
  // modalTransition: PropTypes.shape(Fade.propTypes),
  innerRef: PropTypes.object,
  // if modal should be destructed/removed from DOM after closing
  unmountOnClose: PropTypes.bool // defaults to true
}

export default SummaryCard;