import styled from 'styled-components';
import { Button, Card } from 'antd';
import { TaskboardItem, TaskboardItemStatus } from './TaskboardTypes';
import TaskboardItemCard, { TaskboardItemCardProps } from './TaskboardItemCard';

const TaskboardColRoot = styled(Card)`
  user-select: none;
  flex: 1;
  margin: 0.5rem;
  display: flex;
  flex-direction: column;
  // To force each flex item to have equal width
  // even if they have long texts with no spaces etc.
  min-width: 0;
  > .ant-card-body {
    overflow: hidden;
    height: 100%;
    padding: 0;
  }
`;

export type TaskboardColProps = Pick<
  TaskboardItemCardProps,
  'onEdit' | 'onDelete'
> & {
  items: TaskboardItem[];
  likedNotes: string[];
  uid: string | null;
  status: TaskboardItemStatus;
  onClickAdd?: VoidFunction;
};

function TaskboardCol({
  items,
  status,
  onClickAdd,
  onEdit,
  onDelete,
  likedNotes,
  uid,
}: TaskboardColProps) {
  return (
    <TaskboardColRoot
      title={`${status} (${items.length})`}
      extra={
        onClickAdd && (
          <Button
            type="primary"
            style={{ background: '#017fa3', borderColor: '#017fa3' }}
            onClick={onClickAdd}
          >
            Add
          </Button>
        )
      }
    >
      {items.map((item, index) => {
        return (
          <div key={item.id}>
            <TaskboardItemCard
              uid={uid}
              likedNotes={likedNotes}
              item={item}
              status={status}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        );
      })}
    </TaskboardColRoot>
  );
}

export default TaskboardCol;
