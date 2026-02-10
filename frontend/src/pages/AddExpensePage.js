import React, {useState,useEffect} from 'react';
import {  TextField, Button, Typography, Paper } from '@mui/material';
import axios from 'axios';

const AddExpensePage = () => {
    const [formData, setFormData] = useState({title:'', amount:'', date:''});

    const submit = async() => {
        try{
            await axios.post("http://localhost:5001/api/expense",formData);
        }
        catch(error){
            console.error(error);
        }
    };
    return(
        <div>
            
        </div>
    )
    
}

export default AddExpensePage;