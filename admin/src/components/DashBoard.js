
import React, { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import Papa from 'papaparse';
import Topnaigation from './Topnaigation';

function DashBoard() {
  axios.defaults.baseURL = 'http://localhost:4444';
  const location = useLocation();

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const phoneNoRef = useRef();

  const [listOfAgents, setListOfAgents] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const [distributedData, setDistributedData] = useState({});
  const [newData, setNewData] = useState({});
  const [phone, setPhone] = useState('');
  const [editForm, setEditForm] = useState(null); // stores current agent being edited

  // Live validation state
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const validateInput = (field) => {
    const name = nameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const phoneVal = phoneNoRef.current.value.trim();
    const password = passwordRef.current.value.trim();
    let newErrors = { ...errors };

    if (field === "name") {
      if (!name) {
        newErrors.name = "Name is required.";
      } else {
        newErrors.name = "";
      }
    }

    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
        newErrors.email = "Email is required.";
      } else if (!emailRegex.test(email)) {
        newErrors.email = "Email must be in format: example@domain.com";
      } else {
        newErrors.email = "";
      }
    }

    if (field === "phone") {
      const phoneRegex = /^\+\d{1,3}\s?\d{10}$/;
      if (!phoneVal) {
        newErrors.phone = "Phone number is required.";
      } else if (!phoneRegex.test(phoneVal)) {
        newErrors.phone = "Phone must be like: +91 9876367878";
      } else {
        newErrors.phone = "";
      }
    }

    if (field === "password") {
      if (!password) {
        newErrors.password = "Password is required.";
      } else if (password.length < 6) {
        newErrors.password = "Password must be at least 6 characters.";
      } else {
        newErrors.password = "";
      }
    }

    setErrors(newErrors);
  };

  const handleAddAgent = () => {
    if (errors.name || errors.email || errors.phone || errors.password) return;

    const agent = {
      name: nameRef.current.value.trim(),
      email: emailRef.current.value.trim(),
      phoneNo: phoneNoRef.current.value.trim(),
      password: passwordRef.current.value.trim(),
    };

    if (!agent.name || !agent.email || !agent.phoneNo || !agent.password) return;

    setListOfAgents((prev) => [...prev, agent]);

    // Clear form
    nameRef.current.value = "";
    emailRef.current.value = "";
    passwordRef.current.value = "";
    phoneNoRef.current.value = "";
    setPhone("");
    setErrors({ name: '', email: '', phone: '', password: '' });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedExtensions = ['csv', 'xlsx', 'xls'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      alert('Only CSV, XLS, and XLSX files are allowed.');
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const validRows = results.data.filter(
          (row) => row.FirstName && row.Phone && row.Notes
        );

        if (validRows.length === 0) {
          alert('Invalid or empty CSV format.');
          return;
        }

        setTaskList(
          validRows.map((row) => ({
            firstName: row.FirstName.trim(),
            phone: row.Phone.trim(),
            notes: row.Notes.trim(),
          }))
        );
      },
    });
  };


  const distributeTasksToAgents = () => {
  if (taskList.length === 0) {
    alert("No tasks to distribute");
    return;
  }

  if (listOfAgents.length === 0) {
    console.warn("No agents available, tasks won't be assigned");
    return;
  }


  try{
    // Distribute tasks evenly to all agents
  const distribution = {};
  listOfAgents.forEach(agent => {
    distribution[agent.name] = [];
  });

  taskList.forEach((task, idx) => {
    const agentIndex = idx % listOfAgents.length; // Now uses all agents
    const agentName = listOfAgents[agentIndex].name;
    distribution[agentName].push(task);
  });

  console.log("Task Distribution:", distribution);
  setDistributedData(distribution)
  alert('distributed the task successfully')
  }catch(err){
    alert('task distribution failed')
  }
  
};

  const saveDistributedDataToDB = async () => {
    try {
      if (Object.keys(distributedData).length === 0) {
        alert('No distributed data to save.');
        return;
      }
      let response = await axios.post('/saveDistributedData', distributedData);
      alert(response.data.message);
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save distributed data.');
    }
  };

  const fetchDistributedDataFromDB = async () => {
    try {
      const res = await axios.get('/fetchDistributedData');
      const resData = {};
      console.log('the response data in fetch key is :',res.data)
      if (res.data.length === 0) alert('No saved distributed data found.');
      res.data.forEach((item) => {
        resData[item.agentEmail] = item.tasks;
      });
      setNewData(resData);
    } catch (error) {
      console.error('Error fetching:', error);
    }
  };



let editAgent = (ind) => {
  const agent = listOfAgents[ind];
  setEditForm({ ...agent, index: ind }); // store index and data
};

let handleUpdatedAddAgent = () => {
  if (!editForm) return;

  const updatedAgents = [...listOfAgents];
  updatedAgents[editForm.index] = {
    name: editForm.name,
    email: editForm.email,
    phoneNo: editForm.phoneNo,
    password: editForm.password
  };
  setListOfAgents(updatedAgents);
  setEditForm(null); // close edit form
};


let deleteAgent = (ind) => {
  // Show confirmation popup
  const confirmDelete = window.confirm("Are you sure you want to delete this agent?");
  
  if (confirmDelete) {
    let updatedTaskList = [...listOfAgents];
    console.log('The list of agents and delete index are:', updatedTaskList, ind);
    updatedTaskList.splice(ind, 1);
    setListOfAgents(updatedTaskList);
  } else {
    console.log("Agent deletion cancelled.");
  }
};


  return (
    <div className='dashboard-container'>
      <Topnaigation />
      <h1 className='dashboard-title'><u>Dashboard</u></h1>
      <h3 className='dashboard-subtitle'>{location.state?.message || 'Welcome!'}</h3>

      {/* Form for Adding the Agents */}
      <form className='agent-form' onSubmit={(e) => e.preventDefault()}>
        <h3><u>Add Agent</u></h3>
        <div>
          <label>Name</label>
          <input
            type='text'
            ref={nameRef}
            onChange={() => validateInput("name")}
          />
          {errors.name && <p style={{ color: 'red', fontSize: '0.85rem' }}>{errors.name}</p>}
        </div>
        <div>
          <label>Email</label>
          <input
            type='email'
            ref={emailRef}
            onChange={() => validateInput("email")}
          />
          {errors.email && <p style={{ color: 'red', fontSize: '0.85rem' }}>{errors.email}</p>}
        </div>
        <div>
          <label>Phone Number</label>
          <input
            ref={phoneNoRef}
            type='tel'
            name='phone'
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              validateInput("phone");
            }}
            placeholder='+91 9876543210'
          />
          {errors.phone && <p style={{ color: 'red', fontSize: '0.85rem' }}>{errors.phone}</p>}
        </div>
        <div>
          <label>Password</label>
          <input
            type='text'
            ref={passwordRef}
            onChange={() => validateInput("password")}
          />
          {errors.password && <p style={{ color: 'red', fontSize: '0.85rem' }}>{errors.password}</p>}
        </div>
        <div>
          <button
            type='button'
            onClick={handleAddAgent}
            disabled={errors.name || errors.email || errors.phone || errors.password}
          >
            Add Agent
          </button>
        </div>
      </form>
      {/* Tabel which shows the Eddit Agents data */}
      {editForm && (
        <form className="agent-form" onSubmit={(e) => e.preventDefault()}>
          <h3><u>Edit Agent</u></h3>
          <div>
            <label>Name</label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            />
          </div>
          <div>
            <label>Phone Number</label>
            <input
              type="tel"
              value={editForm.phoneNo}
              onChange={(e) => setEditForm({ ...editForm, phoneNo: e.target.value })}
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="text"
              value={editForm.password}
              onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
            />
          </div>
          <div>
            <button type="button" onClick={handleUpdatedAddAgent}>Save Changes</button>
          </div>
        </form>
      )}

      {/* Tabel which shows the Added Agents data */}
      <table className='agent-table'>
        <caption>Added Agents Data</caption>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone No</th>
            <th>Password</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {listOfAgents.map((agent, i) => (
            <tr key={i}>
              <td>{agent.name}</td>
              <td>{agent.email}</td>
              <td>{agent.phoneNo}</td>
              <td>{agent.password}</td>
              <td><button type='button' style={{ backgroundColor: 'green', color: 'white' }} onClick={()=>{
                editAgent(i);
              }}>Edit</button></td>
              
              <td><button type='button' style={{ backgroundColor: 'red', color: 'white' }}  onClick={()=>{
                deleteAgent(i);
              }}>Delete</button></td>
              
            </tr>
          ))}
        </tbody>
      </table>

      {/* CSV File upload */}
      <div className='file-upload'>
        <h3>Upload CSV File (First Name, Phone No, Notes)</h3>
        <input type='file' accept='.csv, .xlsx, .xls' onChange={handleFileUpload} />
      </div>

      <div className='action-buttons'>
        <button onClick={distributeTasksToAgents}>
          Distribute Tasks To Agents
        </button>
        <button onClick={saveDistributedDataToDB}>
          Save The Distributed Data To DataBase
        </button>
        <button onClick={fetchDistributedDataFromDB}>
          Show the distributed data here
        </button>
      </div>

      {/* Display distributed tasks */}
      <div className='distributed-tasks-container'>
        <h2>📦 Distributed Tasks to Agents</h2>
        {Object.entries(newData).map(([email, tasks]) => (
          <div key={email} className='agent-card'>
            <h3><u>{email}</u></h3>
            <ul>
              {(Array.isArray(tasks) ? tasks : []).map((task, index) => (
                <li key={index}>
                  <strong>{task.firstName}</strong> – {task.phone}
                  <br />
                  <em>{task.notes}</em>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div>
        <button type='button'><Link to='/'>Logout</Link></button>
      </div>
    </div>
  );
}

export default DashBoard;
