//-------------- Dash Board ---------------------

import React, { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import Papa from 'papaparse';

function DashBoard() {
  // axios.defaults.baseURL = 'http://localhost:4444';
  const location = useLocation();

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const phoneNoRef = useRef();

  const [listOfAgents, setListOfAgents] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const [distributedData, setDistributedData] = useState({});
  const [phone, setPhone] = useState('');

  const handleAddAgent = () => {
    const agent = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      phoneNo: phoneNoRef.current.value,
      password: passwordRef.current.value,
    };

    if (!agent.name || !agent.email || !agent.phoneNo || !agent.password) {
      alert('Please fill all fields.');
      return;
    }

    setListOfAgents((prev) => [...prev, agent]);
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
    console.log('listOfAgents:', listOfAgents);
    if (listOfAgents.length < 5) {
      alert('Add at least 5 agents before distributing tasks.');
      return
    }

    const agents = [...listOfAgents.slice(0, 5)];
    const distribution = {};

    agents.forEach((agent, index) => {
      distribution[agent.email || `Agent-${ index + 1 }`] = [];
    });

    taskList.forEach((task, idx) => {
      const agentIndex = idx % 5;
      const agentKey = agents[agentIndex].email || `Agent-${ agentIndex + 1 }`;
      distribution[agentKey].push(task);
    });

    setDistributedData(distribution);
    console.log('Distributed Tasks:', distribution);
  };

  const saveDistributedDataToDB = async () => {
    console.log('the length of the distributedData: ', distributedData.length)
    try {
      if (distributedData.length === undefined) {
        alert('unable to save the data because there is no The distributed data')
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
      // console.log('fetchedDistributedDataFromDB is :',res.data)
      const newData = {};
      if (res.data.length === 0)
        alert('There is no saved distributed data')
      res.data.forEach((item) => {
        newData[item.agentEmail] = item.tasks;
      });
      // console.log('the fetchDistributedDataFromDB is :', newData);
      setDistributedData(newData);
    } catch (error) {
      console.error('Error fetching:', error);
    }
  };

  return (
    <div className='dashboard-container'>
      <h1 className='dashboard-title'><u>Dashboard</u></h1>
      <h3 className='dashboard-subtitle'>{location.state?.message || 'Welcome!'}</h3>

      {/* Form for Adding the Agents */}
      <form className='agent-form'>
        <h3><u>Add Agent</u></h3>
        <div>
          <label>Name</label>
          <input type='text' ref={nameRef} />
        </div>
        <div>
          <label>Email</label>
          <input type='email' ref={emailRef} />
        </div>
        <div>
          <label>Phone Number</label>
          <input
            ref={phoneNoRef}
            type='tel'
            name='phone'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder='+91 98765 43210'
            pattern='^\\+\\d{1,3}\\s?\\d{10}$'
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input type='text' ref={passwordRef} />
        </div>
        <div>
          <button type='button' onClick={handleAddAgent}>
            Add Agent
          </button>
        </div>
      </form>

      {/* Tabel which shows the Added Agents data */}
      <table className='agent-table'>
        <caption>Added Agents Data</caption>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone No</th>
            <th>Password</th>
          </tr>
        </thead>
        <tbody>
          {listOfAgents.map((agent, i) => (
            <tr key={i}>
              <td>{agent.name}</td>
              <td>{agent.email}</td>
              <td>{agent.phoneNo}</td>
              <td>{agent.password}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* CSV File upload */}
      <div className='file-upload'>
        <h3>Upload CSV File(First Name , Phone No, Notes)</h3>
        <input type='file' accept='.csv, .xlsx, .xls' onChange={handleFileUpload} />
      </div>

      {/* button for  distributing Tasks To Agents*/}
      <div className='action-buttons'>
        <button
          onClick={() => {
            distributeTasksToAgents();
          }}
        >
          Distribute Tasks To Agents
        </button>
        {/* button for Saving The Distributed Data To DataBase*/}
        <button
          onClick={() => {
            saveDistributedDataToDB();
          }}
        >
          Save The Distributed Data To DataBase
        </button>

        {/* button for showing distributed data to the agents from the data base */}
        <button onClick={fetchDistributedDataFromDB}>Show the distributed data here</button>
      </div>

      {/* div container which shows the distributed task to the agents */}
      <div className='distributed-tasks-container'>
        <h2>📦 Distributed Tasks to Agents</h2>
        {Object.entries(distributedData).map(([email, tasks]) => (
          <div key={email} className='agent-card'>
            <h3>{email}</h3>
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

      {/* Button for logout from the dashboard */}
      <div>
        <button type='button'><Link to='/'>Logout</Link></button>
      </div>
    </div>
  );
}

export default DashBoard;
