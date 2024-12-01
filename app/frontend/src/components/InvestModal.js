import {React, useEffect, useState} from "react";
import {Modal, Button, Form, FormGroup, FormControl} from 'react-bootstrap';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { getDate } from "../utils";

const InvestModal = (args) =>
{
    const [Show, setShow] = useState(false);
    const [Tag , setTag] = useState(null)
    const [Quantity , setQuantity] = useState(null)
    const [CurrentPrice, setCurrentPrice] = useState(null)
    const [BuyPrice, setBuyPrice] = useState(null)
    const [User_Balance, setUserBalance] = useState(null)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

  useEffect(() =>{
    
    if(CurrentPrice && BuyPrice && User_Balance)
    {
      console.log(CurrentPrice)
      console.log(BuyPrice)
      console.log(User_Balance)
    }
    
  },[ CurrentPrice, BuyPrice, User_Balance])

  const SendToDB = async () =>
  {
    try {
      if(Tag && Quantity && CurrentPrice && BuyPrice && User_Balance){
     let saveData = 
      {
        MI_Uuid: uuidv4(),
        creator: args.username,
        Stock: Tag,
        Amount_Owned: Quantity,
        date: getDate(),
        Buy_Price: BuyPrice,
        Current_Price: CurrentPrice,
        Profit_Margin: 0,
        User_Balance: User_Balance

       


      }
      const response = await axios.post('/saveInvestment', { saveData });
      console.log(response.data.message)
    }  
    } catch (err) {
      console.log("Error: ", err)
    }
    
    
  }

  const SaveStock =async () =>
  {
    const cs =  await args.getStockData(Tag)
    setBuyPrice(cs)
    setCurrentPrice(cs)
    setUserBalance(cs)
    console.log(cs)
    SendToDB()
    handleClose()
  }

return (
    <>

      <Button variant="primary" onClick={handleShow}>
        +
      </Button>

      <Modal show={Show} onHide={handleClose} tabIndex={-1}>
        <Modal.Header closeButton>
          <Modal.Title>Investor</Modal.Title>
        </Modal.Header>
        <Modal.Body>Invest In a Stock!
        <Form>
            <Form.Group>
                <Form.Label>Stock Tag</Form.Label>
                <Form.Control autofocus value = {Tag} onChange = {(e) => setTag(e.target.value)} placeholder = "  ie: VOO, TSLA"></Form.Control>
            </Form.Group>

            <Form.Group>
                <Form.Label>Quantity</Form.Label>
                <Form.Control autofocus value = {Quantity} onChange = {(e) => setQuantity(e.target.value)} placeholder = "  0"></Form.Control>
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