import moment from 'moment';
import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import 'react-dates/initialize';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import { Itodo, Status } from './types';

interface TodoCreateProps {
  nextId: number;
  createTodo: (todo: Itodo) => void;
  incrementNextId: () => void;
  todoState: Itodo[];
  chekedCategory: string | null;
  setTodoState: React.Dispatch<React.SetStateAction<Itodo[]>>;
  setChekedCategory: React.Dispatch<React.SetStateAction<string | null>>;
}

const TodoHeader: FC<TodoCreateProps> = ({ nextId, createTodo, incrementNextId, todoState, setTodoState, chekedCategory, setChekedCategory }) => {
  const [value, setValue] = useState('');
  const [dueDate, setDueDate] = useState<moment.Moment | null>(moment());
  const [focused, setFocused] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);
  const [notImportantTodo, setNotImportantTodo] = useState<Itodo[]>([]);
  const [notSortedTodo, setNotSortedTodo] = useState<Itodo[]>([]);

  const handleSelectBox = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.currentTarget;
    const copyTodo = [...todoState];

    if (value === 'newest') {
      copyTodo.sort((a: any, b: any) => b.dueDate.localeCompare(a.dueDate));
      setTodoState(copyTodo);
    }
    if (value === 'oldest') {
      copyTodo.sort((a: any, b: any) => a.dueDate.localeCompare(b.dueDate));
      setTodoState(copyTodo);
    }
  };

  const handleCheckBox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.currentTarget;
    if (checked) {
      setChecked(true);
      const filteredImportantTodos = todoState.filter((todo: Itodo) => todo.isImportant);
      const filterednotImportantTodos = todoState.filter((todo: Itodo) => !todo.isImportant);
      setNotImportantTodo(filterednotImportantTodos);
      setTodoState(filteredImportantTodos);
    } else {
      setChecked(false);
      setTodoState((prev) => prev.concat(notImportantTodo).map((todo: Itodo, index: number) => ({ ...todo, id: index })));
    }
  };

  const showRelatedTodo = (category: string | null) => {
    switch (category) {
      case 'All':
        setTodoState(todoState.concat(notSortedTodo).map((todo: Itodo, index: number) => ({ ...todo, id: index })));
        setNotSortedTodo([]);
        break;
      case 'ToDo': {
        const todoInTodoState = todoState.filter((todo: Itodo) => todo.status === Status.ToDo);
        const todoOutTodoState = todoState.filter((todo: Itodo) => todo.status !== Status.ToDo);
        const todoInNotSortedTodo = notSortedTodo.filter((todo: Itodo) => todo.status === Status.ToDo);
        const todoInOutSortedTodo = notSortedTodo.filter((todo: Itodo) => todo.status !== Status.ToDo);
        setTodoState(todoInTodoState.concat(todoInNotSortedTodo).map((todo: Itodo, index: number) => ({ ...todo, id: index })));
        setNotSortedTodo(todoOutTodoState.concat(todoInOutSortedTodo).map((todo: Itodo, index: number) => ({ ...todo, id: index })));
        break;
      }
      case 'Doing': {
        const DoingInTodoState = todoState.filter((todo: Itodo) => todo.status === Status.Doing);
        const DoingOutTodoState = todoState.filter((todo: Itodo) => todo.status !== Status.Doing);
        const DoingInNotSortedTodo = notSortedTodo.filter((todo: Itodo) => todo.status === Status.Doing);
        const DoingInOutSortedTodo = notSortedTodo.filter((todo: Itodo) => todo.status !== Status.Doing);
        setTodoState(DoingInTodoState.concat(DoingInNotSortedTodo).map((todo: Itodo, index: number) => ({ ...todo, id: index })));
        setNotSortedTodo(DoingOutTodoState.concat(DoingInOutSortedTodo).map((todo: Itodo, index: number) => ({ ...todo, id: index })));
        break;
      }
      case 'Done': {
        const DoneInTodoState = todoState.filter((todo: Itodo) => todo.status === Status.Done);
        const DoneOutTodoState = todoState.filter((todo: Itodo) => todo.status !== Status.Done);
        const DoneInNotSortedTodo = notSortedTodo.filter((todo: Itodo) => todo.status === Status.Done);
        const DoneInOutSortedTodo = notSortedTodo.filter((todo: Itodo) => todo.status !== Status.Done);
        setTodoState(DoneInTodoState.concat(DoneInNotSortedTodo).map((todo: Itodo, index: number) => ({ ...todo, id: index })));
        setNotSortedTodo(DoneOutTodoState.concat(DoneInOutSortedTodo).map((todo: Itodo, index: number) => ({ ...todo, id: index })));
        break;
      }
      default:
        setTodoState(todoState);
        break;
    }
  };

  const handleMenuCategory = (e: React.MouseEvent<HTMLLIElement>) => {
    const { textContent } = e.currentTarget;
    if (textContent === chekedCategory) return;
    setChecked(false);
    setChekedCategory(textContent);
    showRelatedTodo(textContent);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!value) {
      alert('할 일을 작성해주세요.');
      return null;
    }
    createTodo({
      id: nextId,
      taskName: value,
      status: Status.ToDo,
      dueDate: dueDate?.format('YYYY-MM-DD'),
      createdAt: moment().format('YYYY-MM-DD'),
      updatedAt: moment().format('YYYY-MM-DD'),
      isImportant: false,
    });
    incrementNextId();
    setValue('');
  };

  return (
    <HeaderWrap>
      <Title>Todo-List</Title>
      <HeaderForm onSubmit={handleSubmit}>
        <Input autoFocus placeholder="What's need to be done?" type="text" value={value} onChange={handleChange} />
        <StyledWrapper>
          <SingleDatePicker
            date={dueDate}
            onDateChange={(date) => setDueDate(date)}
            focused={focused}
            onFocusChange={({ focused }) => setFocused(focused)}
            id="datepicker"
            numberOfMonths={1}
            displayFormat={'YYYY.MM.DD'}
            hideKeyboardShortcutsPanel
          />
        </StyledWrapper>
        <CircleButton>
          <i className="fas fa-plus-circle"></i>
        </CircleButton>
      </HeaderForm>
      <TabWrap>
        {menuCategories.map((category, idx) => (
          <li key={idx} onClick={handleMenuCategory}>
            {category}
          </li>
        ))}
      </TabWrap>
      <ControlBox>
        <ImporatantCheck>
          <input type="checkbox" id="important" checked={checked} onChange={handleCheckBox} />
          <label htmlFor="important">중요 항목만 보기</label>
        </ImporatantCheck>
        <div>
          <select onChange={handleSelectBox}>
            <option value="newest">최신순</option>
            <option value="oldest">오래된순</option>
          </select>
        </div>
      </ControlBox>
    </HeaderWrap>
  );
};

const Title = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1em;
  color: #119955;
  font-size: 4rem;
  :hover {
    transform: translateY(-10px);
    transition: 1s;
  }
`;

const HeaderWrap = styled.div`
  width: 100%;
  border-bottom: 1px solid #eeeeee;
`;

const HeaderForm = styled.form`
  display: flex;
  padding: 40px 50px 40px 30px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #dddddd;
  width: 80%;
  line-height: 20px;
  outline: none;
  font-size: 14px;
  color: #119955;
  &::placeholder {
    color: #dddddd;
    font-size: 16px;
  }
`;

const CircleButton = styled.button`
  @media (min-width: 768px) {
    background: #ffffff;
    width: 50px;
    height: 50px;
    align-items: center;
    justify-content: center;
    font-size: 60px;
    left: 50%;
    transform: translate(50%, 0%);
    color: white;
    border-radius: 50%;
    border: none;
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;
    .fa-plus-circle {
      color: #33bb77;
    }
  }
  @media (max-width: 768px) {
    background: #ffffff;
    align-items: center;
    justify-content: center;
    font-size: 60px;
    left: 30%;
    transform: translate(50%, 0%);
    color: white;
    border-radius: 50%;
    border: none;
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;
    .fa-plus-circle {
      color: #33bb77;
    }
  }
`;

const TabWrap = styled.ul`
  display: flex;
  justify-content: space-around;
  li {
    flex: 1;
    padding: 15px;
    background-color: #33bb77;
    text-align: center;
    border-right: 1px solid white;
    cursor: pointer;
    color: #ffffff;
  }
`;

const ControlBox = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px;
  label {
    padding-left: 8px;
  }
`;

const StyledWrapper = styled.div`
  @media (min-width: 768px) {
    .SingleDatePickerInput__withBorder {
      height: 52px;
    }
    .DateInput {
      height: 50px;
    }
    .DateInput_input {
      font-size: 16px;
      line-height: 28px;
    }
    .DateInput_input__focused {
      border-bottom: 2px solid #33bb77;
    }
    .CalendarDay__selected,
    .CalendarDay__selected:active,
    .CalendarDay__selected:hover {
      background-color: #33bb77;
    }
    .CalendarDay {
      vertical-align: middle;
    }
  }
  @media (max-width: 768px) {
    display: none;
  }
`;

const ImporatantCheck = styled.div`
  display: flex;
  align-items: center;
`;

const menuCategories = ['All', 'ToDo', 'Doing', 'Done'];

export default TodoHeader;
