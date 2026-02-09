
import React,{useState,useEffect} from 'react';
import { getExpenses, deleteExpense } from "./services/expenseServices";
import './App.css';
import Header from './components/Header'

function App() {
  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = async () => {
    try {
      const response = await getExpenses();
      const data = await response.json();  
      setExpenses(data.data);

    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {fetchExpenses();}, []);

  return (
    <div>
      <Header/>
      <h1>All Expenses</h1>

      
      {expenses.length === 0 ? (
        <p>No expenses found</p>
      ) : (
        expenses.map((expense) => (
          <div key={expense._id} >
            <h3>{expense.title}</h3>
            <p>Amount: ₹ {expense.amount}</p>
            <p>
              Date: {new Date(expense.date).toLocaleDateString()}
            </p>
            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default App;
