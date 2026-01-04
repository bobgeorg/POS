import { React } from 'react'
import Modal from 'react-bootstrap/Modal'
import Card from 'react-bootstrap/Card'
import { FaStore, FaTruck } from 'react-icons/fa'

const MethodModal = (props) => {
  const chooseDirectMethod = () => {
    props.onChooseMethod('Directly')
  }
  const chooseAwayMethod = (e) => {
    props.onChooseMethod('Online')
  }
  return (
    <Modal show={props.isOpened} centered className="method-modal">
      <Modal.Header className="method-modal-header">
        <Modal.Title className="method-modal-title">Choose Order Type</Modal.Title>
      </Modal.Header>
      <Modal.Body className="method-modal-body">
        <Card className='method-card' onClick={chooseDirectMethod}>
          <div className="method-card-icon">
            <FaStore />
          </div>
          <Card.Title className='method-card-title'>
            Dine In
          </Card.Title>
          <p className="method-card-subtitle">Order at your table</p>
        </Card>
        <Card className='method-card' onClick={chooseAwayMethod}>
          <div className="method-card-icon">
            <FaTruck />
          </div>
          <Card.Title className='method-card-title'>Delivery / Takeout</Card.Title>
          <p className="method-card-subtitle">Get it delivered to you</p>
        </Card>
      </Modal.Body>
    </Modal>
  )
}

export default MethodModal
