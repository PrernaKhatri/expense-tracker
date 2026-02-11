import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {Routes, Route} from 'react-router-dom';

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
            
        <Routes>
          <Route path="/AddExpense" element={<AddExpensePage/>}></Route>
        </Routes>
        
        </div>
    )
    
}

export default AddExpensePage;