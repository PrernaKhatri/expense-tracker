import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Typography, Button , Stack
} from '@mui/material';
import axios from "axios";
import Header from './components/Header';
import AddExpensePage  from './pages/AddExpensePage';

function App() {
  const [expenses, setExpenses] = useState([]);

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
      if(res.data.data.length === 0){
        alert("No expenses for today.")
      }
      else{
        const total = res.data.data[0].totalAmount;
        alert(`Today's total expense is ${total}`);
      }
    }
    catch(error){
      console.error(error);
      alert("failed to fetch total expense.")
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
  
  const deleteExpense = async (id) => {
    try{
      await axios.delete(`http://localhost:5001/api/expense/${id}`);
      setExpenses(prev => prev.filter(exp => exp._id !== id));
    }
    catch(error){
      console.log("Error in deleting expenses.",error); 
    }
  }


  return (
    
    <div align='center' >
      {/* <Header/> */}
      <Stack direction="row" spacing={2} sx={{justifyContent: "space-between",maxWidth:1350}}>
        <Button variant="contained" sx={{border: '2px solid black'}} >Add an expense</Button>
        <Button variant="contained" sx={{border: '2px solid black'}} onClick={()=>{todayExpenses()}}>Know your today's expenses</Button>
        <Button variant="contained" sx={{border: '2px solid black'}} onClick={()=>{monthlyExpense()}}>Know monthly expense</Button>
        </Stack>
      
      <TableContainer component={Paper} >
        <Table sx={{ maxWidth:1350 }}>
          <TableHead sx={{ backgroundColor: 'Green'}}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Title</TableCell>
              <TableCell  sx={{ color: 'white', fontWeight: 'bold' }}>Amount</TableCell>
              <TableCell  sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
              <TableCell ></TableCell>
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
                  <TableCell ><Button onClick={() => deleteExpense(expense._id)}>Delete</Button></TableCell>
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
    </div>
  );
}

export default App;