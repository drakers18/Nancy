import {React, useEffect, useState} from "react";
import {Modal, Button, Form, FormGroup, FormControl} from 'react-bootstrap';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { getDate } from "../utils";

const InvestModal = (args) =>
{
    const [Show, setShow] = useState(false);
    const [Tag , setTag] = useState('')
    const [Quantity , setQuantity] = useState('')
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

  const SendToDB = async () =>
  {
    try {
     let saveData = 
      {
        MI_Uuid: uuidv4(),
        creator: args.username,
        Stock: Tag,
        Amount_Owned: Quantity,
        date: getDate(),
       


      }
      const response = await axios.post('/saveInvestment', { saveData });
      
    } catch (err) {
      console.log("Error: ", err)
    }

  }

  const SaveStock =() =>
  {

    handleClose()
  }

return (
    <>

      <Button variant="primary" onClick={handleShow}>
        Invest
      </Button>

      <Modal show={Show} onHide={handleClose} tabIndex={-1}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Invest In a Stock!
        <Form>
            <Form.Group>
                <Form.Label>Stock Tag</Form.Label>
                <Form.Control autofocus value = {Tag} onChange = {(e) => setTag(e.target.value)} placeholder = "ie: VOO, TSLA"></Form.Control>
            </Form.Group>

            <Form.Group>
                <Form.Label>Quantity</Form.Label>
                <Form.Control autofocus value = {Quantity} onChange = {(e) => setQuantity(e.target.value)} placeholder = "0"></Form.Control>
            </Form.Group>
        </Form>


        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={SaveStock}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>



    
</>
)


}

export default InvestModal