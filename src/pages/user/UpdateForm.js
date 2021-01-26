import { Col, Collapse, Divider, Form, Input, InputNumber, Row, Select } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import Button from '../../components/Button';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import './user.css';

const UpdateForm = ({
  reference,
  loginMethods,
  selectedUser,
  roles = [],
  departments = [],
  buttonLoading,
  onCancel,
  onFormSubmit,
  supervisors = [],
  supervisorLoading,
  entities = [],
  fetchSupervisors,
}) => {
  let selectedLoginMethodIndex;
  const [form] = Form.useForm();
  const [pettyCashUser, setPettyCashUser] = useState(false);

  const selectedRoles =
    selectedUser &&
    selectedUser.roles &&
    _.map(selectedUser.roles || [], sr => _.findIndex(roles, r => r.code === sr.code));
  let selectedDepartment = _.findIndex(departments, dep => dep.code === _.get(selectedUser, 'department.code'));
  selectedDepartment = selectedDepartment === -1 ? undefined : selectedDepartment;
  const selectedPettyCashes = _.map(selectedUser.pettyCashes, pettyCash => {
    supervisors.push(pettyCash.supervisor);

    return {
      _id: pettyCash._id,
      supervisor: pettyCash.supervisor._id,
      department: pettyCash.department.map(d => d._id),
      entity: _.get(pettyCash, 'entity._id'),
      floatAmount: pettyCash.floatAmount ? pettyCash.floatAmount : null,
      glCode: pettyCash.glCode ? pettyCash.glCode : null,
      journal: pettyCash.journal ? pettyCash.journal : null,
    };
  });
  const selectedSupervisors = _.map(selectedUser.pettyCashes, i => i.supervisor);

  useEffect(() => {
    const id = roles.findIndex(role => role.code === 'petty_cashier');
    const exists = selectedRoles.find(value => value === id);
    if (exists) {
      setPettyCashUser(true);
      fetchSupervisors(null, selectedSupervisors);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filter = (input, option) => {
    if (input && option.children) {
      return _.includes(_.join(option.children, '').toLowerCase(), input.toLowerCase());
    }
    return false;
  };

  const selectedLoginMethod = _.get(selectedUser, 'loginMethod');
  selectedLoginMethodIndex = extractIndexFromCode(loginMethods, selectedLoginMethod, 'code');
  const [loginMethod, setLoginMethod] = useState(selectedLoginMethod);
  const onFinish = values => {
    const selectedRoles = values.roles.map(i => roles[i]);
    const outValue = {
      roles: selectedRoles,
      department: departments[values.department],
      loginMethod,
    };
    if (pettyCashUser) outValue.pettyCashes = values.pettyCashes;

    onFormSubmit(outValue);
  };

  const onRoleChange = values => {
    const id = roles.findIndex(role => role.code === 'petty_cashier');
    const exists = values.find(value => value === id);
    if (exists) setPettyCashUser(true);
    else {
      setPettyCashUser(false);
    }
  };

  const onSupervisorSearch = _.debounce(value => {
    fetchSupervisors(value);
  }, 500);

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 },
    },
    colon: false,
  };

  const removeDynamicFormItem = (remove, fieldName) => (
    <MinusCircleOutlined style={{ fontSize: '24px' }} onClick={() => remove(fieldName)} />
  );

  const renderInsertPettyCashes = () => {
    return (
      <Form.List name="pettyCashes">
        {(fields, { add, remove }) => {
          return (
            <div style={{ margin: '5% 0 5% 0' }}>
              <Divider>Petty Cashier Details</Divider>
              <Button
                type="secondary"
                onClick={() => {
                  add();
                }}
                block
              >
                <PlusOutlined /> Add petty cashier
              </Button>
              <div style={{ marginTop: '5%' }}>
                {fields.map((field, i) => (
                  <Collapse key={i} className="site-collapse-custom-collapse">
                    <Collapse.Panel
                      header={`Petty Cashier ${i + 1}`}
                      key={i}
                      className="site-collapse-custom-panel"
                      extra={removeDynamicFormItem(remove, field.name)}
                    >
                      <Form.Item
                        label="Supervisor"
                        name={[field.key, 'supervisor']}
                        rules={[{ required: true, message: 'Supervisor is required' }]}
                      >
                        <Select
                          allowClear
                          className={'fullWidth'}
                          placeholder={'Select Supervisor'}
                          showSearch
                          filterOption={filter}
                          onSearch={onSupervisorSearch}
                          loading={supervisorLoading}
                        >
                          {supervisors.map((obj, i) => (
                            <Select.Option key={i} value={obj._id}>
                              {obj.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        label="Department(s)"
                        name={[field.key, 'department']}
                        rules={[{ required: true, message: 'Petty cash department is required' }]}
                      >
                        <Select
                          allowClear
                          className={'fullWidth'}
                          placeholder={'Select Department(s)'}
                          showSearch
                          filterOption={filter}
                          mode="multiple"
                        >
                          {departments.map((obj, i) => (
                            <Select.Option key={i} value={obj._id}>
                              {obj.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        label="Entity"
                        name={[field.key, 'entity']}
                        rules={[{ required: true, message: 'Entity is required' }]}
                      >
                        <Select
                          allowClear
                          className={'fullWidth'}
                          placeholder={'Select Entity'}
                          showSearch
                          filterOption={filter}
                        >
                          {entities.map((obj, i) => (
                            <Select.Option key={i} value={obj._id}>
                              {obj.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        label="Journal"
                        name={[field.key, 'journal']}
                        rules={[{ required: true, message: 'Journal is required' }]}
                      >
                        <Input placeholder="Enter Journal" />
                      </Form.Item>
                      <Form.Item
                        label="Float amount"
                        name={[field.key, 'floatAmount']}
                        rules={[
                          { required: true, message: 'Float amount is required' },
                          { type: 'number', message: 'Float amount should be a number' },
                        ]}
                      >
                        <InputNumber style={{ width: '100%' }} placeholder="Enter Float amount" />
                      </Form.Item>
                      <Form.Item
                        label="GL Code"
                        name={[field.key, 'glCode']}
                        rules={[{ required: true, message: 'GL Code is required' }]}
                      >
                        <Input placeholder="Enter GL Code" />
                      </Form.Item>
                    </Collapse.Panel>
                  </Collapse>
                ))}
              </div>
            </div>
          );
        }}
      </Form.List>
    );
  };

  return (
    <div>
      <Form
        {...formItemLayout}
        ref={reference}
        form={form}
        initialValues={{
          roles: selectedRoles,
          department: selectedDepartment,
          pettyCashes: selectedPettyCashes,
          loginMethod: selectedLoginMethodIndex,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Login Method"
          name="loginMethod"
          rules={[{ required: true, message: 'Login Method is required' }]}
        >
          <Select
            allowClear
            className={'fullWidth'}
            placeholder={'Select Login Method'}
            showSearch
            filterOption={filter}
            onChange={value => setLoginMethod(loginMethods[value])}
          >
            {loginMethods.map((obj, i) => (
              <Select.Option key={i} value={i}>
                {obj.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Roles" name="roles" rules={[{ required: true, message: 'Role is required' }]}>
          <Select
            allowClear
            className={'fullWidth'}
            placeholder={'Select Role'}
            showSearch
            filterOption={filter}
            mode="multiple"
            onChange={onRoleChange}
          >
            {roles.map((obj, i) => (
              <Select.Option key={i} value={i}>
                {obj.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Department" name="department" rules={[{ required: true, message: 'Department is required' }]}>
          <Select allowClear className={'fullWidth'} placeholder={'Select Department'} showSearch filterOption={filter}>
            {departments.map((obj, i) => (
              <Select.Option key={i} value={i}>
                {obj.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {pettyCashUser && renderInsertPettyCashes()}
        <Form.Item>
          <Row gutter={16}>
            <Col flex={1}>
              <Button block htmlType="submit" loading={buttonLoading}>
                Update
              </Button>
            </Col>
            <Col flex={1}>
              <Button
                block
                loading={buttonLoading}
                type="dashed"
                onClick={() => {
                  onCancel();
                }}
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </div>
  );
};

export const extractIndexFromCode = (items, item, itemPath) => {
  const index = _.findIndex(items, i => i[itemPath] === _.get(item, itemPath));
  return index === -1 ? undefined : index;
};
export default UpdateForm;
