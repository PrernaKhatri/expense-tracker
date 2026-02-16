import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Button, Stack, TextField, IconButton, Box
} from '@mui/material';
import axios from "axios";
import api from './config/api';

import CustomModal from './components/CustomModal';
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Tooltip from '@mui/material/Tooltip';
import { SnackbarProvider } from 'notistack';
import { SnackBarConfigurator, toast } from './components/SnackBar';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [modelType, setModelType] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(null);

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalContent("");
    setModalTitle("");
    setModelType("");
    setDeleteId(null);
  };

  useEffect(() => { fetchExpenses(); }, []);

  const fetchExpenses = async () => {
    try { 
      const res = await api.get("/expense")
      setExpenses(res.data.data || []);
    } catch (error) {
      console.log("Error fetching expenses", error);
      setExpenses([]);
    }
  }; 

  const todayExpenses = async () => {
    setModelType("todayExpense");
    setModalTitle("Today's Expenses");
    setOpenModal(true);
    try {    
      const res = await api.get("/expense?filter=today")
      const { totalAmount } = res.data.data;
      setModalContent(`You have spent Rs. ${totalAmount} today.`);
    }
    catch (error) {
      if (error.response && error.response.status === 404) {
        setModalContent("No expenses for today.");
      } else {
        toast.error("Failed to fetch total expense.");
      }
    }
  }

  const monthlyExpense = async (selectedDate) => {
    setModelType("todayExpense");
    setModalTitle("Monthly expense");
    setOpenModal(true);
    try {
      const month = selectedDate.month() + 1;
      const year = selectedDate.year(); 
      const res = await api.get(`/expense?month=${month}&year=${year}`);
      const { totalAmount } = res.data.data;
      setModalContent(`You have spent Rs. ${totalAmount} for the selected month and year.`);
    }
    catch (error) {
      if (error.response && error.response.status === 404) {
        setModalContent("No expenses for the selected month.");
      } else {
        toast.error("Failed to fetch expenses.");
      }
    }
  }

  const handleOpenDeleteModal = async (id) => {
    setDeleteId(id);
    setModelType("delete");
    setOpenModal(true);
  }

  const deleteExpense = async (id) => {
    try {    
      await api.delete(`/expense/${id}`);
      setExpenses(prev => prev.filter(exp => exp._id !== id));
      setOpenModal(false);
      setDeleteId(null);
      toast.success("Expense successfully deleted.");
    }
    catch (error) {
      toast.error("Error in deleting expense.")
    }
  }

  const handleOpenAddModal = async () => {
    setModelType("add");
    setOpenModal(true);
  }

  const addExpense = async () => {
    try {
      if (!title || !amount || !date) {
        setModalContent("Please fill all the fields.");
        return;
      }
      const expense = { title, amount, date: date.format("YYYY-MM-DD")};
      const res = await api.post("/expense",expense);
      setExpenses(prev => [...prev, res.data.data]);
      setOpenModal(false);
      toast.success("Expense added successfully.");
      setTitle("");
      setDate(null);
      setAmount("");
      setModalTitle("");
      setModalContent("");
    }
    catch (error) {
      toast.error("Failed to add an expense.")
    }
  }


  return (
    <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
      <SnackBarConfigurator />
      <Stack direction="column" spacing={3} sx={{ px: 5, py: 5, backgroundColor: "#c5c5c559", fontFamily: "Poppins" }}>
       
        <Box >
          <Typography variant='h3' sx={{ fontFamily: "Poppins" }}>Hello, Prerna!</Typography>
          <Typography variant='h6' sx={{ fontFamily: "Poppins" }}>Track and manage your expenses easily with expense tracker.</Typography>
        </Box>       
        <Paper elevation={3} sx={{ px: 3, py: 3 }}>
          <Box>        
            <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between" }}>      
              <Button variant='contained' sx={{ backgroundColor: "#e2e2e2", color: "black" }} onClick={() => { handleOpenAddModal() }} >Add an expense</Button>
              <Button variant="contained" sx={{ backgroundColor: "#e2e2e2", color: "black" }} onClick={() => { todayExpenses() }}>Know your today's expenses</Button>
              <Button variant="contained" sx={{ backgroundColor: "#e2e2e2", color: "black" }} onClick={() => { setModelType("monthlyExpense"); setOpenModal(true); }}>Know monthly expense</Button>
            </Stack>
          </Box>
        </Paper>
        <Paper elevation={3} sx={{ px: 3, py: 3 }}>
          <Box>
            <Stack direction="row" spacing={2} >
              {/* <Button variant='contained' type='submit' endIcon={<SearchIcon />}>Search by Title or Amount</Button>
            <Button variant='contained' type='submit' endIcon={<SearchIcon />}>Search by Date</Button> */}
              <TextField label="Search by Title or Amount"><SearchIcon /></TextField>
            </Stack>
            <TableContainer sx={{ maxHeight: 620 }}>
              <Table stickyHeader aria-label="sticky table" >
                <TableHead >
                  <TableRow >
                    <TableCell sx={{ fontWeight: 'bold', fontSize: 20 }}>Title</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: 20 }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: 20 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: 20 }}>Action</TableCell>
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
                        <TableCell><Tooltip title="Delete">
                          <IconButton onClick={() => handleOpenDeleteModal(expense._id)}><DeleteIcon /></IconButton>
                        </Tooltip></TableCell>
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

            <CustomModal open={openModal} handleClose={handleCloseModal} title={modalTitle} >
              {modelType === "todayExpense" && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography>{modalContent}</Typography>
                  <Button onClick={handleCloseModal} variant='contained' sx={{ maxWidth: 50, alignSelf: 'center' }}>Ok</Button>
                </Box>
              )}

              {
                modelType === "delete" && (
                  <>
                    <Typography variant='h6'>Confirm delete ?</Typography>
                    <Stack direction="row" spacing={1} justifyContent='center'>
                      <Button variant='contained' onClick={() => { deleteExpense(deleteId) }}>Yes</Button>
                      <Button variant='contained' onClick={handleCloseModal}>No</Button>
                    </Stack>
                  </>
                )
              }

              {
                modelType === "add" && (
                  <>
                    <Typography align='center' variant='h5'>Add an expense</Typography>
                    <Typography sx={{ color: "red" }}>{modalContent}</Typography>
                    <Stack direction="column" spacing={1} >
                      <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                      <TextField label="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
                      <LocalizationProvider dateAdapter={AdapterDayjs} >
                        <DemoContainer components={['DatePicker']}>
                          <DatePicker label="Date"
                            sx={{ width: '100%' }}
                            value={date}
                            onChange={(Date) => setDate(Date)}
                            disableFuture
                            slotProps={{
                              actionBar: {
                                actions: ['clear'],
                              }
                            }} />
                        </DemoContainer>
                      </LocalizationProvider>
                      <Button variant="contained" onClick={() => { addExpense() }} >Submit</Button>
                    </Stack>

                  </>
                )
              }

              {
                modelType === "monthlyExpense" && (
                  <Stack direction="column" spacing={1} >
                    <Typography >Please select a month.</Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['DatePicker', 'DatePicker']}>

                        <DatePicker
                          label={'"month"'} openTo="month"
                          views={['year', 'month']}
                          sx={{ width: '100%' }} disableFuture
                          onChange={(month) => setSelectedMonth(month)}

                        />
                      </DemoContainer>
                    </LocalizationProvider>
                    <Button variant="contained" onClick={() => {
                      if (selectedMonth) {
                        monthlyExpense(selectedMonth);
                      }
                      else {
                        toast.error("Please select a month.")
                      }
                    }} >Submit</Button>
                  </Stack>
                )
              }
            </CustomModal>
          </Box>
        </Paper>
      </Stack>
    </SnackbarProvider>
  );
}


export default App;