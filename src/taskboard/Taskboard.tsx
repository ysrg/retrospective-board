import { useMemo, useState, useEffect } from 'react';
import produce from 'immer';
import styled from 'styled-components';
import { TaskboardItem, TaskboardItemStatus } from './TaskboardTypes';
import TaskboardItemFormModal, {
  TaskboardItemFormValues,
} from './TaskboardItemFormModal';
import LogInModal from './TaskboardLoginModal';
import TaskboardCol, { TaskboardColProps } from './TaskboardCol';
import {
  useSyncedState,
  createNote,
  updateNote,
  deleteNote,
  useDidMountEffect,
  getUser,
} from '../shared/SharedHooks';

const TaskboardRoot = styled.div`
  min-height: 0;
  height: 100%;
  min-width: 800px;
  max-width: 2400px;
  margin: auto;
`;

const TaskboardContent = styled.div`
  height: 100%;
  padding: 0.5rem;
  display: flex;
  justify-content: space-around;
`;

const defaultItems = {
  [TaskboardItemStatus.WENT_WELL]: [],
  [TaskboardItemStatus.NEEDS_IMPROVEMENT]: [],
  [TaskboardItemStatus.ACTION_ITEMS]: [],
  [TaskboardItemStatus.APPRECIATIONS]: [],
};

type TaskboardData = Record<TaskboardItemStatus, TaskboardItem[]>;

function Taskboard() {
  const [itemsByStatus, setItemsByStatus] = useSyncedState<TaskboardData>(
    'itemsByStatus',
    defaultItems
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [auth, setAuth] = useState(false);
  const [uid, setUid] = useState<string | null>('');
  const [likedNotes, setLikedNotes] = useState<string[]>([]); //item.likedNotes

  const firstRender = useDidMountEffect();

  useEffect(() => {
    async function getUsr() {
      let res = await getUser();
      setLikedNotes(res?.likedNotes);
    }
    if (firstRender) {
      getUsr();
    }
  }, [firstRender]);

  useEffect(() => {
    try {
      const authRes = localStorage.getItem('secret');
      const uid = localStorage.getItem('uid');
      setUid(uid);
      setAuth(!!authRes);
    } catch (error) {
      throw new Error('Failed getting the key');
    }
  }, [auth, setAuth]);

  const [statusToEdit, setStatusToEdit] = useState<TaskboardItemStatus | null>(
    null
  );

  const [itemToEdit, setItemToEdit] = useState<TaskboardItem | null>(null);

  const openTaskItemModal = (
    itemToEdit: TaskboardItem | null,
    status: TaskboardItemStatus
  ) => {
    setStatusToEdit(status);
    setItemToEdit(itemToEdit);
    setIsModalVisible(true);
  };

  const closeTaskItemModal = () => {
    setItemToEdit(null);
    setIsModalVisible(false);
  };

  const handleDelete: TaskboardColProps['onDelete'] = ({
    status,
    itemToDelete,
  }) => {
    deleteNote(itemToDelete);
    setItemsByStatus((current) =>
      produce(current, (draft) => {
        draft[status] = draft[status].filter(
          (item) => item.id !== itemToDelete.id
        );
      })
    );
  };

  const initialValues = useMemo<TaskboardItemFormValues>(
    () => ({
      title: itemToEdit?.title ?? '',
      createdBy: itemToEdit?.createdBy ?? '',
      id: itemToEdit?.id ?? '',
      description: itemToEdit?.description ?? '',
      likes: itemToEdit?.likes ?? 0,
      likedBy: itemToEdit?.likedBy ?? [],
    }),
    [itemToEdit]
  );
  return auth ? (
    <>
      <TaskboardRoot>
        <TaskboardContent>
          {Object.values(TaskboardItemStatus).map((status) => (
            <TaskboardCol
              uid={uid}
              likedNotes={likedNotes}
              key={status}
              status={status}
              items={itemsByStatus[status]}
              onClickAdd={() => openTaskItemModal(null, status)}
              onEdit={openTaskItemModal}
              onDelete={handleDelete}
            />
          ))}
        </TaskboardContent>
      </TaskboardRoot>
      <TaskboardItemFormModal
        visible={isModalVisible}
        onCancel={closeTaskItemModal}
        onOk={(values) => {
          setItemsByStatus((current) => {
            return produce(current, (draft) => {
              if (itemToEdit) {
                // Editing existing item
                const draftItem = Object.values(draft)
                  .flatMap((items) => items)
                  .find((item) => item.id === itemToEdit.id);
                if (draftItem) {
                  updateNote(draftItem.title, {
                    parent: statusToEdit || '',
                    title: values.title,
                    description: values.description,
                    createdBy: '',
                    likes: itemToEdit?.likes ?? 0,
                    likedBy: { uid: uid ?? '', pos: 3 },
                  });
                  draftItem.title = values.title;
                  draftItem.description = values.description;
                  draftItem.id = values.id;
                }
              } else {
                for (let item in TaskboardItemStatus) {
                  if (
                    TaskboardItemStatus[
                      item as keyof typeof TaskboardItemStatus
                    ] === statusToEdit
                  ) {
                    createNote({
                      likedBy: { uid: uid || '', pos: 0 },
                      createdBy: uid || '',
                      parent:
                        TaskboardItemStatus[
                          item as keyof typeof TaskboardItemStatus
                        ],
                      title: values.title,
                      likes: 0,
                      description: values.description,
                    });
                    draft[
                      TaskboardItemStatus[
                        item as keyof typeof TaskboardItemStatus
                      ]
                    ].push({
                      ...values,
                    });
                  }
                }
              }
            });
          });
        }}
        initialValues={initialValues}
      />
    </>
  ) : (
    <LogInModal
      onCancel={closeTaskItemModal}
      visible={true}
      onOk={(values) => {}}
      initialValues={initialValues}
      setAuth={setAuth}
    />
  );
}

export default Taskboard;
