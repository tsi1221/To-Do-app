import React, { useEffect, useState } from 'react';
import axios from 'axios';
function Todo() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState('');

  // Fetch tasks from the backend API
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Add a new task
  const addTask = async () => {
    if (!newTask.trim()) return; // Prevent empty tasks
    try {
      const response = await axios.post('http://localhost:5000/api/tasks', {
        text: newTask,
      });
      setTasks([...tasks, response.data]);
      setNewTask('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Start editing a task
  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setEditingText(task.text);
  };

  // Save edited task
  const saveEditedTask = async () => {
    if (!editingText.trim()) return; // Prevent empty edits
    try {
      const response = await axios.put(`http://localhost:5000/api/tasks/${editingTaskId}`, {
        text: editingText,
      });
      const updatedTasks = tasks.map(task =>
        task._id === editingTaskId ? { ...task, text: response.data.text } : task
      );
      setTasks(updatedTasks);
      setEditingTaskId(null);
      setEditingText('');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
        setTasks(tasks.filter(task => task._id !== taskId));
      } catch (error) {
        console.error('Error deleting task:', error.response ? error.response.data : error.message);
      }
    }
  };

  // Inline CSS styles
  const styles = {
    app: {
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
     
      borderRadius: '8px',
      backgroundImage: 'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNi5tnmAY2ga5KZ6rpkv9Fx0_Mlt62Rkcgtw&s)',
      backgroundColor: 'rgba(249, 249, 249, 0.9)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    header: {
      textAlign: 'center',
      color: '#333',
    },
    inputContainer: {
      display: 'flex',
      marginBottom: '20px',
    },
    input: {
      flex: 1,
      padding: '10px',
      fontSize: '16px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      marginRight: '10px',
    },
    button: {
      padding: '10px 20px',
      fontSize: '16px',
      backgroundColor: '#28a745',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#218838',
    },
    taskList: {
      listStyle: 'none',
      padding: '0',
    },
    taskItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px',
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      borderRadius: '4px',
      marginBottom: '10px',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    },
    taskItemHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    taskText: {
      flex: 1,
      marginRight: '10px',
    },
    editInput: {
      flex: 1,
      padding: '5px',
      fontSize: '16px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      marginRight: '10px',
    },
    actionButton: {
      padding: '5px 10px',
      fontSize: '14px',
      marginLeft: '5px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    editButton: {
      backgroundColor: '#ffc107',
      color: '#000',
    },
    deleteButton: {
      backgroundColor: '#dc3545',
      color: '#fff',
    },
    saveButton: {
      backgroundColor: '#28a745',
      color: '#fff',
    },
    cancelButton: {
      backgroundColor: '#6c757d',
      color: '#fff',
    },
  };

  return (
    <div style={styles.app}>
      <h1 style={styles.header}>To-Do App</h1>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
          style={styles.input}
        />
        <button
          onClick={addTask}
          style={styles.button}
          onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        >
          Add Task
        </button>
      </div>
      <ul style={styles.taskList}>
        {tasks.map(task => (
          <li
            key={task._id}
            style={styles.taskItem}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = styles.taskItemHover.transform;
              e.currentTarget.style.boxShadow = styles.taskItemHover.boxShadow;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {editingTaskId === task._id ? (
              <>
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  style={styles.editInput}
                />
                <button
                  onClick={saveEditedTask}
                  style={{ ...styles.actionButton, ...styles.saveButton }}
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingTaskId(null)}
                  style={{ ...styles.actionButton, ...styles.cancelButton }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span style={styles.taskText}>
                  {task.text} - {task.completed ? 'Completed' : 'Pending'}
                </span>
                <button
                  onClick={() => startEditing(task)}
                  style={{ ...styles.actionButton, ...styles.editButton }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(task._id)}
                  style={{ ...styles.actionButton, ...styles.deleteButton }}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;