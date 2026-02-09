import axios from "axios";

const api_url = "http://localhost:5001/api/expense";

export const getExpenses = (params={}) => axios.get(api_url,{params});

export const addExpense = (data) => axios.post(api_url, data);

export const deleteExpense = (id) => axios.delete(`${api_url}/${id}`);
