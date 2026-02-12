import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Typography, Button , Stack, TextField, IconButton,Box} from '@mui/material';
import axios from "axios";
import {Routes, Route} from 'react-router-dom';
import Header from './components/Header';
import AddExpensePage  from './pages/AddExpensePage';
import { useNavigate } from 'react-router-dom';
import CustomModal from './components/CustomModal';
import DeleteIcon from "@mui/icons-material/Delete";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';



function App() {
  const [expenses, setExpenses] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleCloseModal = () => setOpenModal(false);
  
  const navigate = useNavigate();

  useEffect(() => {fetchExpenses();}, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/expense");
      setExpenses(res.data.data || []); 
    } catch (error) {
      console.log("Error fetching expenses", error);
      setExpenses([]);
    }
  };

  const todayExpenses = async() => {
    try{
      const res = await axios.get("http://localhost:5001/api/expense?filter=today");
      setModalTitle("Today's Expenses")
      if(res.data.data.length === 0){
        setModalContent("No expenses for today.")
      }
      else{
        const total = res.data.data[0].totalAmount;
        setModalContent(`You have spent Rs. ${total} today.` );
      }
      setOpenModal(true);
    }
    catch(error){
      setModalTitle("Error");
      setModalContent("failed to fetch total expense.");
      setOpenModal(true);
    }
  } 

  const monthlyExpense = async() => {
    try{
      const input = prompt("Enter month");

      const month = parseInt(input);

      if(!month || month>12 || month<1){
        alert("Please enter valid month.");
        return;
      }

      const res = await axios.get(`http://localhost:5001/api/expense?month=${month}`);
      
        const total = res.data.data.totalExp;
        alert(`Total expense for the month is ${total}`);
    }
    catch(error){
      console.error(error);
      alert("Failed to fetch monthly expense.")
    }
  }

  const handleOpenDeleteModal = async(id) => {
    setDeleteId(id);
    setModalContent(<><Typography>Confirm Delete?</Typography>
    <Button onClick={deleteExpense}>Yes</Button>
    <Button onClick={handleCloseModal}>No</Button></>)
    setConfirmDelete(true);
    setOpenModal(true);
  }
  
  const deleteExpense = async () => {
    
    try{
      await axios.delete(`http://localhost:5001/api/expense/${deleteId}`);
      setExpenses(prev => prev.filter(exp => exp._id !== deleteId));
      setOpenModal(false);
    setDeleteId(null);
    }
    catch(error){
      console.log("Error in deleting expenses.",error); 
    }
  }


  return (

    <Box   >   
      
      {/* <Header/> */}
      <Stack direction="row" spacing={2} sx={{justifyContent: "space-between"}}>
        <Button variant="contained" sx={{border: '2px solid black'}} onClick= {()=> navigate('/AddExpense')} >Add an expense</Button>
        <Button variant="contained" sx={{border: '2px solid black'}} onClick={()=>{todayExpenses()}}>Know your today's expenses</Button>
        
        <Button variant="contained" sx={{border: '2px solid black'}} onClick={()=>{monthlyExpense()}}>Know monthly expense</Button>
        </Stack> <br/>

        <Stack direction="row" spacing={1} sx={{justifyContent: "space-between"}}>
        <TextField label="Title" />
        <TextField label="Amount" />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
            <DatePicker label="Date" 
            slotProps={{
              actionBar: {
                actions: ['clear'],
              }
            }}/>
          </DemoContainer>
        </LocalizationProvider>
        <Button variant="contained" onClick={()=>{alert('Expense submitted.')}} sx={{border: '2px solid black'}}>Submit</Button>
        </Stack> <br/>
      
      <TableContainer >
        <Table>
          <TableHead >
            <TableRow>
              <TableCell sx={{  fontWeight: 'bold' }}>Title</TableCell>
              <TableCell  sx={{ fontWeight: 'bold' }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.length > 0 ? (
              expenses.map((expense) => (
                <TableRow key={expense._id} hover>
                  
                  <TableCell >{expense.title}</TableCell>
                  <TableCell >{expense.amount}</TableCell>
                  <TableCell >
                    {expense.date ? new Date(expense.date).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  {/* <TableCell ><Button onClick={() => deleteExpense(expense._id)}>Delete</Button></TableCell> */}
                  <TableCell><IconButton onClick={() => handleOpenDeleteModal(expense._id)}><DeleteIcon/></IconButton></TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell >
                  <Typography>
                    No expenses found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <CustomModal open={openModal} handleClose={handleCloseModal} title={modalTitle} content={modalContent}>       
      </CustomModal>
    </Box>
  );
}

export default App;