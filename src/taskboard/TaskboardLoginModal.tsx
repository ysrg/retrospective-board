import { useEffect, useRef, useState } from 'react';
import { Modal, Form, ModalProps, Input } from 'antd';
import { TaskboardItem, KeyMatch } from './TaskboardTypes';

export type TaskboardItemFormValues = Pick<
  TaskboardItem,
  'title' | 'description' | 'likes' | 'id' | 'likedBy' | 'createdBy'
>;

type TaskboardLoginModalProps = Pick<ModalProps, 'visible'> & {
  initialValues: TaskboardItemFormValues;
  onCancel: VoidFunction;
  onOk: (values: TaskboardItemFormValues) => void;
  setAuth: (val: boolean) => void;
};

function TaskboardItemFormModal({
  visible,
  initialValues,
  onCancel,
  onOk,
  setAuth,
}: TaskboardLoginModalProps) {
  const [form] = Form.useForm<TaskboardItemFormValues>();
  const inputRef = useRef<Input>(null);

  useEffect(() => {
    if (visible) {
      // Focus on the first input when the modal is opened
      inputRef.current?.focus();
      form.resetFields();
    }
  }, [form, visible]);

  const fetchCreds = async (key_: any) => {
    let result = await fetch(
      // 'http://localhost:8080/v1/auth/register',
      'https://pearson-retro.herokuapp.com/v1/auth/register',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: key_.key,
        },
      }
    );
    const res = await result.json();
    if (res.success === 'true') {
      try {
        localStorage.setItem('secret', res.user.pkey);
        localStorage.setItem('uid', res.user.id);
      } catch (error) {
        throw new Error('Failed setting the key');
      }
      setTimeout(() => {
        setAuth(true);
      }, 500);
    }
  };

  return (
    <Modal
      title="Log In"
      visible={visible}
      destroyOnClose
      // To make dynamically changing initialValues work with Form
      forceRender
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form
        autoComplete="off"
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={(values) => {
          fetchCreds(values);
          onOk(values);
          form.resetFields();
          onCancel();
        }}
      >
        <Form.Item
          name="key"
          label="Key"
          rules={[
            { required: true, message: "'Key' is required" },
            {
              max: 100,
              message: "'Key' can not be longer than 100 characters",
            },
          ]}
        >
          <Input ref={inputRef} autoFocus />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default TaskboardItemFormModal;
