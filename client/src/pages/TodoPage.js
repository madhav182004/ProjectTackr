import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "../App.css"

export const TodoPage = () => {
    const [todos, setTodos] = useState([]);
    const [popupActive, setPopupActive] = useState(false);
    const [newTodo, setNewTodo] = useState("");
    const { id } = useParams();  

    useEffect(() => {
        GetTodos();
    }, [id]);


    const sortTodos = (todos) => {
        return todos.sort((a, b) => a.complete - b.complete);
    };

    const GetTodos = () => {
        fetch(`http://localhost:4000/post/${id}/todos`)
            .then(res => res.json())
            .then(data => {
                setTodos(sortTodos(data));  
            })
            .catch((err) => console.error("Error: ", err));
    };

    const addTodo = async () => {
        const data = await fetch(`http://localhost:4000/post/${id}/todo/new`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: newTodo })
        }).then(res => res.json());

        setTodos(sortTodos([...todos, data])); 

        setPopupActive(false);
        setNewTodo("");
    };

    const completeTodo = async todoId => {
        try {
            
            const todo = todos.find(t => t._id === todoId);
            if (todo.complete) {
                return;
            }

            const response = await fetch(`http://localhost:4000/post/${id}/todo/complete/${todoId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                }
            });
    
            if (!response.ok) throw new Error('Failed to update todo');
    
            const updatedTodo = await response.json();
    
            setTodos(todos => sortTodos(
                todos.map(todo => 
                    todo._id === updatedTodo._id ? { ...todo, complete: updatedTodo.complete } : todo
                )
            ));
        } catch (error) {
            console.error('Error:', error);
        }
    };
    

    const deleteTodo = async todoId => {
        try {
            const response = await fetch(`http://localhost:4000/post/${id}/todo/delete/${todoId}`, { method: "DELETE" });
            if (!response.ok) throw new Error('Failed to delete todo');
            const data = await response.json();
            setTodos(sortTodos(todos.filter(todo => todo._id !== data.result._id)));
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="tasks">
            <div className="todos">
                {todos.length > 0 ? todos.map(todo => (
                    <div 
                        className={
                            "todo" + (todo.complete ? " is-complete" : "")
                        } 
                        key={todo._id}
                    >
                        <div 
                            className="checkbox" 
                            onClick={() => {
                                if (!todo.complete) {
                                    completeTodo(todo._id);
                                }
                            }}
                            style={{
                                cursor: todo.complete ? 'default' : 'pointer',
                                color: todo.complete ? 'gray' : 'black'
                            }}
                        >
                            {todo.complete ? '' : '✔️'}
                        </div>
    
                        <div className="text">
                            {todo.text}
                        </div>
    
                        <div 
                            className="delete-todo" 
                            onClick={() => deleteTodo(todo._id)}
                        >
                            x
                        </div>
                    </div>
                )) : (
                    <p>You currently have no tasks</p>
                )}
            </div>
    
            <div className="addPopup" onClick={() => setPopupActive(true)}>+</div>
    
            {popupActive ? (
                <div className="popup">
                    <div className="closePopup" onClick={() => setPopupActive(false)}>X</div>
                    <div className="content">
                        <h3>Add Task</h3>
                        <input 
                            type="text" 
                            className="add-todo-input" 
                            onChange={e => setNewTodo(e.target.value)} 
                            value={newTodo} 
                        />
                        <div className="button" onClick={addTodo}>Create Task</div>
                    </div>
                </div>
            ) : ''}
        </div>
    );    
};
