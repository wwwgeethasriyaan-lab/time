import React, { useEffect, useState, useRef } from 'react';

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem('tasks');
    return stored ? JSON.parse(stored) : [];
  });
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [time, setTime] = useState('');
  const audioRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!title.trim()) return alert('Enter a title');
    const newTask = {
      id: Date.now(),
      title,
      desc,
      time: time || null,
      completed: false,
      notified: false
    };
    setTasks([newTask, ...tasks]);
    setTitle(''); setDesc(''); setTime('');
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      tasks.forEach(task => {
        if (task.time && !task.completed && !task.notified) {
          if (new Date(task.time).getTime() <= now) {
            audioRef.current = new Audio(process.env.PUBLIC_URL + '/alarm.mp3');
            audioRef.current.play();

            task.notified = true;
            setTasks([...tasks]);
          }
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [tasks]);

  return (
    <div className="max-w-md mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-4 text-center">Tasks</h1>

      <div className="mb-4 space-y-2">
        <input 
          className="w-full p-2 border border-gray-300 rounded" 
          placeholder="Title" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
        />
        <input 
          className="w-full p-2 border border-gray-300 rounded" 
          placeholder="Description" 
          value={desc} 
          onChange={e => setDesc(e.target.value)} 
        />
        <input 
          type="datetime-local" 
          className="w-full p-2 border border-gray-300 rounded" 
          value={time} 
          onChange={e => setTime(e.target.value)} 
        />
        <div className="flex space-x-2">
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" 
            onClick={addTask}
          >
            Add Task
          </button>
          <button 
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" 
            onClick={stopSound}
          >
            Stop Sound
          </button>
        </div>
      </div>

      <ul className="space-y-4">
        {tasks.map(task => (
          <li 
            key={task.id} 
            className={`p-4 border rounded`}
          >
            {/* Title and description above */}
            <div className="mb-2">
              <strong className={`${task.completed ? 'line-through bg-gray-100' : 'bg-white'}`}>{task.title}</strong>
              {task.desc && (
                <p className={`${task.completed ? 'line-through text-gray-700' : 'text-gray-700'}`}>
                  {task.desc}
                </p>
              )}
              {task.time && (
                <p className={`${task.completed ? 'line-through text-sm text-gray-500' : 'text-sm text-gray-500'}`}>
                  Alarm: {new Date(task.time).toLocaleString()}
                </p>
              )}
            </div>

            {/* Buttons below */}
            <div className="flex space-x-2">
              <button
                className={`flex-1 px-2 py-1 rounded font-semibold ${
                  task.completed ? 'bg-blue-500 text-white hover:bg-blue-600' 
                                 : 'bg-yellow-400 text-black hover:bg-yellow-500'
                }`}
                onClick={() => toggleComplete(task.id)}
              >
                {task.completed ? 'Completed' : 'Pending'}
              </button>

              <button 
                className="flex-1 bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
