import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Button, Stack, TextField, IconButton, Box
} from '@mui/material';
import axios from "axios";
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import CustomModal from './components/CustomModal';
import DeleteIcon from "@mui/icons-material/Delete";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Tooltip from '@mui/material/Tooltip';
import { SnackbarProvider, useSnackbar } from "notistack";
import { SnakeBarHelper, successMsg, errorMsg } from './components/SnakeBar';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [modelType, setModelType] = useState("");
  const [selectMonth, setSelectMonth] = useState("");
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
      const res = await axios.get("http://localhost:5001/api/expense");
      setExpenses(res.data.data || []);
    } catch (error) {
      console.log("Error fetching expenses", error);
      setExpenses([]);
    }
  };

  const todayExpenses = async () => {
    setModelType("todayExpense");
    try {
      const res = await axios.get("http://localhost:5001/api/expense?filter=today");
      setModalTitle("Today's Expenses");

      if (res.data.data.length === 0) {
        setModalContent("No expenses for today.")
      }
      else {
        const total = res.data.data[0].totalAmount;
        setModalContent(`You have spent Rs. ${total} today.`);
      }

      setOpenModal(true);
    }
    catch (error) {
      setModalTitle("Error");
      setModalContent("failed to fetch total expense.");
      setOpenModal(true);
    }
  }

  const handleOpenMonthExpenseModal = async (month) => {
    setSelectMonth(month);
    setModelType("monthlyExpense")
    setOpenModal(true);
  }

  const monthlyExpense = async (month) => {
    try {

      const res = await axios.get(`http://localhost:5001/api/expense?month=${month}`);
      const total = res.data.data.totalExp;
      setOpenModal(false);
    }
    catch (error) {
      console.error(error);
      alert("Failed to fetch monthly expense.")
    }
  }

  const handleOpenDeleteModal = async (id) => {
    setDeleteId(id);
    setModelType("delete");
    setOpenModal(true);
  }

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/expense/${id}`);
      setExpenses(prev => prev.filter(exp => exp._id !== id));
      setOpenModal(false);
      setDeleteId(null);
      successMsg("Expense successfully deleted.")
    }
    catch (error) {
      setModalTitle("Error")
      setModalContent("Error in deleting expense.");
      setOpenModal(true);
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
      const expense = { title, amount, date }
      const res = await axios.post("http://localhost:5001/api/expense", expense);
      setExpenses(prev => [...prev, res.data.data]);
      setOpenModal(false);
      successMsg("Expense added successfully.");
    }
    catch (error) {
      setModalTitle("Error");
      setModalContent("Failed to add an expense.");
      setOpenModal(true);
    }
  }


  return (
    <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
      <SnakeBarHelper useSnackbar={useSnackbar()}>
        <Box   >
          {/* <Header/> */}
          <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between" }}>
            <Button variant="contained" sx={{ border: '2px solid black' }} onClick={() => { handleOpenAddModal() }} >Add an expense</Button>
            <Button variant="contained" sx={{ border: '2px solid black' }} onClick={() => { todayExpenses() }}>Know your today's expenses</Button>

            <Button variant="contained" sx={{ border: '2px solid black' }} onClick={() => { handleOpenMonthExpenseModal(selectMonth) }}>Know monthly expense</Button>
          </Stack> <br />


          <TableContainer >
            <Table>
              <TableHead >
                <TableRow >
                  <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
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
              <>
                <Typography>{modalContent}</Typography>
                <Button onClick={handleCloseModal} variant='contained'>Ok</Button>
              </>
            )}

            {
              modelType === "delete" && (
                <>
                  <Typography>Confirm delete ?</Typography>
                  <Button onClick={() => { deleteExpense(deleteId) }}>Yes</Button>
                  <Button onClick={handleCloseModal}>No</Button>
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
                          sx={{ width: '100%'}}
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
                  <Typography>Please select a month.</Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker', 'DatePicker']}>
                      {/* <DatePicker label={'"year"'} openTo="year" /> */}
                      <DatePicker
                        label={'"month"'} openTo="month"
                        views={['year', 'month']}
                        sx={{ width: '100%' }} disableFuture

                      />
                    </DemoContainer>
                  </LocalizationProvider>
                  <Button variant="contained" onClick={() => { }} >Submit</Button>
                </Stack>
              )
            }
          </CustomModal>
        </Box>
      </SnakeBarHelper>
    </SnackbarProvider>
  );
}


export default App;