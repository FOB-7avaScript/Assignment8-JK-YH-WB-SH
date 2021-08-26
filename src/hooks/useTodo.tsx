import React, { useState, useEffect } from 'react';

import { Itodo } from 'components/types';

let initialTodos: Itodo[] = [];

export const useTodo = () => {
  const [todoState, setTodoState] = useState(initialTodos);
  const [nextIdState, setNextIdState] = useState(0);
  const [sortedState, setSortedState] = useState<Itodo[]>(initialTodos);
  const [chekedCategory, setChekedCategory] = useState<string | null>('');

  console.log(todoState);

  // const getTodoData = async (): Promise<void> => {
  //   try {
  //     const fetchApiData = await fetch('/data/data.json');
  //     const todoData = await fetchApiData.json();
  //     todoData.sort((a: Itodo, b: Itodo) => a.createdAt.localeCompare(b.createdAt));
  //     setTodoState(todoData);
  //     setSortedState(todoData);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // useEffect(() => {
  //   getTodoData();
  // }, []);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    saveData();
  }, [todoState]);

  // useeffect  - [sortState]
  // 로컬스토리지  받아온 리스트 (TodoState) 스프레드
  // sortState 값 변경
  // TodoState

  const incrementNextId = () => {
    setNextIdState(nextIdState + 1);
  };

  const changeTodo = (id: number) => {
    setTodoState((prevState) =>
      prevState.map((todo) => (todo.id === id ? (todo.status === 2 ? { ...todo, status: 0 } : { ...todo, status: todo.status + 1 }) : todo)),
    );
  };

  const toggleTodo = (id: number) => {
    setTodoState((prevState) => prevState.map((todo) => (todo.id === id ? { ...todo, isImportant: !todo.isImportant } : todo)));
  };

  const removeTodo = (id: number) => {
    setTodoState((prevState) => prevState.filter((todo: Itodo) => todo.id !== id).map((todo: Itodo, index: number) => ({ ...todo, id: index })));
    setNextIdState(nextIdState - 1);
  };

  const createTodo = (todo: Itodo) => {
    const newTodo = todoState.map((todo: Itodo, index: number) => ({ ...todo, id: index }));
    setTodoState(newTodo);
    const nextId = todoState.length;
    setTodoState((prevState) =>
      prevState.concat({
        ...todo,
        id: nextId,
      }),
    );
  };

  const loadData = () => {
    let data: any = localStorage.getItem('todos');
    if (data === undefined || data === null) {
      data = JSON.stringify([]);
    }
    initialTodos = JSON.parse(data);
    if (initialTodos && initialTodos.length >= 1) {
      setNextIdState(initialTodos.length);
      initialTodos = initialTodos.map((todo: Itodo, index: number) => ({ ...todo, id: index }));
    }
    setTodoState(initialTodos);
  };

  const saveData = () => {
    const newTodo = todoState.map((todo: Itodo, index: number) => ({ ...todo, id: index }));
    localStorage.setItem('todos', JSON.stringify(newTodo));
  };

  return {
    todoState,
    nextIdState,
    incrementNextId,
    changeTodo,
    toggleTodo,
    removeTodo,
    createTodo,
    sortedState,
    setSortedState,
    setTodoState,
    chekedCategory,
    setChekedCategory,
  };
};
