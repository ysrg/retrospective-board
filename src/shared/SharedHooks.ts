import { goTry } from 'go-try';
import React, { useEffect, useState, useRef } from 'react';
import { NoteItem } from '../taskboard/TaskboardTypes';

export const useDidMountEffect = () => {
  const firstRender = useRef(true);

  useEffect(() => {
    firstRender.current = false;
  }, []);

  return firstRender.current;
};

export async function getUser() {
  let pkey: string;
  let uid: string;
  try {
    uid = localStorage.getItem('uid') ?? '';
  } catch (error) {
    throw new Error('Failed to read the uid');
  }
  try {
    pkey = localStorage.getItem('secret') ?? '';
  } catch (error) {
    throw new Error('Failed to read key');
  }
  const result = await goTry(() =>
    fetch(`https://pearson-retro.herokuapp.com/v1/users/${uid}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: pkey,
      },
    }).then((res) => res.json())
  );
  if (result.error) {
    console.error('Error getting the user', result.error);
    return;
  }
  return result.data;
}

export async function updateUser(body: any) {
  let pkey: string;
  let uid: string;
  try {
    uid = localStorage.getItem('uid') ?? '';
  } catch (error) {
    throw new Error('Failed to read the uid');
  }
  try {
    pkey = localStorage.getItem('secret') ?? '';
  } catch (error) {
    throw new Error('Failed to read key');
  }
  const result = await goTry(() =>
    fetch(`https://pearson-retro.herokuapp.com/v1/users/${uid}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: pkey,
      },
    }).then((res) => res.json())
  );
  if (result.error) {
    console.error('Error updating user', result.error);
    return;
  }
}
export async function createNote(note: NoteItem) {
  let pkey: string;
  try {
    pkey = localStorage.getItem('secret') ?? '';
  } catch (error) {
    throw new Error('Failed to read key');
  }
  const result = await goTry(() =>
    fetch('https://pearson-retro.herokuapp.com/v1/users/notes', {
      method: 'POST',
      body: JSON.stringify(note),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: pkey,
      },
    }).then((res) => res.json())
  );
  if (result.error) {
    console.error('Error creating note', result.error);
    return;
  }
}

export async function updateClickCount(note: NoteItem) {
  let pkey: string;
  try {
    pkey = localStorage.getItem('secret') ?? '';
  } catch (error) {
    throw new Error('Failed to read key');
  }
  const result = await goTry(() =>
    fetch(`https://pearson-retro.herokuapp.com/v1/users/notes/${note.title}`, {
      method: 'PATCH',
      body: JSON.stringify(note),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: pkey,
      },
    }).then((res) => res.json())
  );
  if (result.error) {
    console.error('Error creating note', result.error);
    return;
  }
  return result.data;
}

export async function updateNote(oldTitle: string, note: NoteItem) {
  let pkey: string;
  try {
    pkey = localStorage.getItem('secret') ?? '';
  } catch (error) {
    throw new Error('Failed to read key');
  }
  const result = await goTry(() =>
    fetch(`https://pearson-retro.herokuapp.com/v1/users/notes/${oldTitle}`, {
      method: 'PATCH',
      body: JSON.stringify(note),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: pkey,
      },
    }).then((res) => res.json())
  );
  if (result.error) {
    console.error('Error updating note', result.error);
    return;
  }
}

export async function deleteNote(note: any) {
  let pkey: string;
  try {
    pkey = localStorage.getItem('secret') ?? '';
  } catch (error) {
    throw new Error('Failed to read key');
  }
  const result = await goTry(() =>
    fetch(`https://pearson-retro.herokuapp.com/v1/users/notes/${note.title}`, {
      method: 'DELETE',
      headers: {
        Authorization: pkey,
      },
    })
  );
  if (result.error) {
    console.error('Error deleting note', result.error);
    return;
  }
}

export function useSyncedState<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<any>();
  let pkey: string;
  try {
    pkey = localStorage.getItem('secret') ?? '';
  } catch (error) {
    throw new Error('Failed to read key');
  }
  useEffect(() => {
    const fetchData = async () => {
      const result = await goTry(() =>
        fetch('https://pearson-retro.herokuapp.com/v1/users/notes', {
          headers: {
            Authorization: pkey,
          },
        }).then((res) => res.json())
      );
      if (result.error) {
        console.error('Error fetching notes', result.error);
        return;
      }
      let obj: { [index: string]: any[] } = {};
      result.data.results &&
        result.data.results.map((item: NoteItem) => {
          if (obj[item.parent]) obj[item.parent].push(item);
          else obj[item.parent] = [item];
        });
      setState({ ...initialValue, ...obj });
    };
    fetchData();
  }, [initialValue, pkey]);

  return [state || initialValue, setState];
}
