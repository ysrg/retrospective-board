import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Modal, Typography, Dropdown, Menu, Badge } from 'antd';
import { TaskboardItem, TaskboardItemStatus } from './TaskboardTypes';
import { updateClickCount, updateUser } from '../shared/SharedHooks';
import {
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  LikeFilled,
  LikeTwoTone,
} from '@ant-design/icons';
import { red } from '@ant-design/colors';
import styled from 'styled-components';
import BaseTooltip from '../shared/BaseTooltip';

const StyledCard = styled(Card)`
  margin: 0.5rem;
  padding: 0.5rem;
  background-color: '#fff';
`;

const TaskboardItemCardTitle = styled(Typography.Title)`
  white-space: pre-wrap;
  // To make ellipsis of the title visible.
  // Without this margin, it can be go behind the "extra" component.
  // So, we give it a little space.
  margin-right: 0.25rem;
`;

const DeleteMenuItem = styled(Menu.Item)`
  color: ${red.primary};
`;

export interface TaskboardItemCardProps {
  item: TaskboardItem;
  status: TaskboardItemStatus;
  likedNotes: string[];
  uid: string | null;
  onEdit: (itemToEdit: TaskboardItem, status: TaskboardItemStatus) => void;
  onDelete: (args: {
    status: TaskboardItemStatus;
    itemToDelete: TaskboardItem;
  }) => void;
}

function TaskboardItemCard({
  item,
  status,
  onEdit,
  uid,
  onDelete,
  likedNotes,
}: TaskboardItemCardProps) {
  const [clicks, setClicks] = useState(item.likedBy?.length || 0);
  const [wasLikedNote, setWasLikedNote] = useState(false);
  const [createdBy, setCreatedBy] = useState('');
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      if (item.likedBy?.includes(uid || '')) {
        setWasLikedNote(true);
      }
      isFirstRun.current = false;
      return;
    }
    if (item.createdBy) {
      setCreatedBy(item.createdBy);
    }
    if (item.id) {
      updateUser({
        likedNotes: [item.id],
      });
    }
    const updateCount = async () => {
      await updateClickCount({
        createdBy: '',
        parent: status,
        title: item.title,
        likes: likedNotes?.length,
        description: item.description,
        likedBy: { uid: uid || '', pos: wasLikedNote ? 1 : 0 },
      });
    };
    updateCount();
  }, [wasLikedNote]);

  const onIconClick = () => {
    if (item.id && item.createdBy !== uid) {
      setWasLikedNote(!wasLikedNote);
      setClicks(wasLikedNote ? clicks - 1 : clicks + 1);
    }
  };
  return (
    <StyledCard
      size="small"
      title={
        <BaseTooltip overlay={item.title}>
          <span>
            <TaskboardItemCardTitle level={5} ellipsis={{ rows: 7 }}>
              {item.title}
            </TaskboardItemCardTitle>
          </span>
        </BaseTooltip>
      }
      extra={
        <>
          <Button
            style={{
              marginLeft: '.4em',
              border: 'none',
            }}
            size="small"
            onClick={onIconClick}
            // icon={<LikeTwoTone style={{fill: 'red'}} theme="outlined" twoToneColor="#eb2f96"/>}
            icon={
              wasLikedNote ? (
                <LikeFilled style={{ color: '#1690ff' }} />
              ) : (
                <LikeTwoTone />
              )
            }
          />
          <Badge
            count={clicks}
            showZero={true}
            offset={[-5, -21]}
            style={{
              opacity: clicks ? 1 : 0,
              border: '1px solid rgb(230 230 230)',
              backgroundColor: 'rgb(230, 247, 255)',
              color: 'rgb(24, 144, 255)',
            }}
          />
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  icon={<EditOutlined />}
                  onClick={() => onEdit(item, status)}
                  disabled={item.createdBy !== uid}
                >
                  Edit
                </Menu.Item>
                <DeleteMenuItem
                  icon={<DeleteOutlined />}
                  disabled={item.createdBy !== uid}
                  onClick={() =>
                    Modal.confirm({
                      title: 'Delete?',
                      content: `Are you sure to delete "${item.title}"?`,
                      onOk: () =>
                        onDelete({
                          status,
                          itemToDelete: item,
                        }),
                    })
                  }
                >
                  Delete
                </DeleteMenuItem>
              </Menu>
            }
            trigger={['click']}
          >
            <Button
              style={{ marginLeft: '.4em' }}
              size="small"
              icon={<MoreOutlined />}
            />
          </Dropdown>
        </>
      }
    >
      <BaseTooltip overlay={item.description}>
        <Typography.Paragraph type="secondary" ellipsis={{ rows: 50 }}>
          {item.description}
        </Typography.Paragraph>
      </BaseTooltip>
    </StyledCard>
  );
}

export default TaskboardItemCard;
