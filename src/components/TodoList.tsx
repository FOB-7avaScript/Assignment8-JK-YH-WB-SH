import React, { FC, useState, useRef } from 'react';
import styled, { css } from 'styled-components';
import { Itodo } from './types';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Itodo[];
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
  changeTodo: (id: number) => void;
  setTodoState: React.Dispatch<React.SetStateAction<Itodo[]>>;
}

const TodoList: FC<TodoListProps> = ({ toggleTodo, removeTodo, todos, changeTodo, setTodoState }) => {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const dragOverIndex = useRef<number | null>(null);

  const onDragStart = (index: number) => {
    setDraggingIndex(index);
  };

  const onDragEnd = () => {
    setDraggingIndex(null);
  };

  const onDragOver = (index: number) => {
    dragOverIndex.current = index;

    if (draggingIndex !== null && dragOverIndex !== null && draggingIndex !== dragOverIndex.current) {
      changeOrder(draggingIndex, dragOverIndex.current);
    }
  };

  const changeOrder = (source: number, destination: number): void => {
    const sourceItem = todos[source];
    const targetFiltedTodos = todos.filter((todo, index) => index !== source);
    const prevTodos = targetFiltedTodos.slice(0, destination);
    const afterTodos = targetFiltedTodos.slice(destination);

    setDraggingIndex(dragOverIndex.current);
    dragOverIndex.current = null;

    setTodoState([...prevTodos, sourceItem, ...afterTodos]);
  };

  const handleRemove = (id: number, todo: Itodo) => {
    if (window.confirm('삭제하시겠습니까?')) {
      removeTodo(id);
    } else {
      return null;
    }
  };

  return (
    <ListWrap>
      <div>
        {todos.map((todo, idx) => (
          <TodoItem
            key={todo.id}
            onDragStart={() => onDragStart(idx)}
            onDragEnd={onDragEnd}
            onDragOver={() => onDragOver(idx)}
            isDragging={idx === draggingIndex}
            handleRemove={handleRemove}
            toggleTodo={toggleTodo}
            changeTodo={changeTodo}
            todo={todo}
          >
            {todo.taskName}
          </TodoItem>
        ))}
      </div>
    </ListWrap>
  );
};

const ListWrap = styled.div`
  flex: 1;
  padding: 0px;
  padding-bottom: 48px;
  overflow-y: auto;
  overflow-x: hidden;
`;

export default TodoList;
