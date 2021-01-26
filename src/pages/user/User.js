import { Col, Input, Row, Select as AntSelect, Table, Tag, Typography } from 'antd';
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from '../../components/Modal';
import Select from '../../components/Select';
import { userActiveState, userState } from '../../consts';
import UpdateForm from '../../pages/user/UpdateForm';
import { fetchRoles, fetchUsers, switchActiveStatus, switchLockStatus, updateUser } from '../../store/user_reducer';
import { checkAccessByRole } from '../../store/auth_reducer';

const { Title, Text } = Typography;
const { Column, ColumnGroup } = Table;

class User extends Component {
  formRef = React.createRef();

  state = {
    modalVisibility: false,
    selectedUser: null,
    searchTerm: null,
    selectedRole: null,
    selectedDepartment: null,
    selectedState: null,
    selectedActiveState: null,
    filters: {},
  };

  componentDidMount = () => {
    if (!checkAccessByRole('admin')) {
      return this.props.history.replace('/');
    }
    document.title = 'Users';
    this.loadData();
  };

  loadData = () => {
    this.props.fetchUsers();
    this.props.fetchRoles();
  };

  closeModal = () => {
    this.setState({ modalVisibility: false });
  };

  onUserUpdate = values => {
    values.userId = this.state.selectedUser._id;
    this.props.updateUser(values);
    this.closeModal();
  };

  render = () => (
    <div>
      {this.renderHeaderAndTabs()}
      {this.renderTable()}
      {this.renderModal()}
    </div>
  );

  renderHeaderAndTabs = () => (
    <Row align="middle" justify="space-between" gutter={[8, 8]}>
      <Col xxl={2}>
        <Title level={4} className="blueColor">
          Users
        </Title>
      </Col>
      <Col xxl={2}>sync button</Col>
      <Col xxl={4} xl={4} lg={4}>
        <Input.Search
          placeholder="search"
          style={{ width: '100%' }}
          loading={this.props.searchLoading || this.props.tableLoading}
          onSearch={value => this.onChangeFilter('commonSearch', value)}
          enterButton
          allowClear
          disabled={this.props.tableLoading}
        />
      </Col>
      <Col xxl={4} xl={4} lg={4}>
        <Select
          allowClear
          itemList={this.props.roles}
          placeholder={'By Role'}
          disabled={this.props.tableLoading}
          loading={this.props.tableLoading}
          onChange={value => this.onChangeFilter('role', value && value.code ? value.code : null)}
        />
      </Col>
      <Col xxl={4} xl={4} lg={4}>
        <Select
          allowClear
          itemList={this.props.departments}
          placeholder={'By Department'}
          disabled={this.props.tableLoading}
          loading={this.props.tableLoading}
          onChange={value => this.onChangeFilter('department', value && value.code ? value.code : null)}
        />
      </Col>
      <Col xxl={4} xl={4} lg={4}>
        <AntSelect
          allowClear={true}
          defaultValue={userActiveState.ACTIVE}
          style={{ width: '100%' }}
          placeholder={'By Active Status'}
          disabled={this.props.tableLoading}
          loading={this.props.tableLoading}
          onChange={value => this.onChangeFilter('active', value)}
        >
          <AntSelect.Option value={userActiveState.ACTIVE}>Active</AntSelect.Option>
          <AntSelect.Option value={userActiveState.INACTIVE}>Inactive</AntSelect.Option>
        </AntSelect>
      </Col>
      <Col xxl={4} xl={4} lg={4}>
        <AntSelect
          allowClear={true}
          defaultValue={userState.INITIALIZED}
          style={{ width: '100%' }}
          placeholder={'By Status'}
          disabled={this.props.tableLoading}
          loading={this.props.tableLoading}
          onChange={value => this.onChangeFilter('initialized', value)}
        >
          <AntSelect.Option value={userState.INITIALIZED}>Initialized</AntSelect.Option>
          <AntSelect.Option value={userState.UNINITIALIZED}>Uninitialized</AntSelect.Option>
        </AntSelect>
      </Col>
    </Row>
  );

  renderTable = () => {
    const renderActive = ({ _id, active, roles }) => {
      return (
        <Tag
          visible={!roles.some(r => r.code === 'admin')}
          style={{ cursor: 'pointer' }}
          onClick={() => this.props.switchActiveStatus(_id)}
          color={active ? 'green' : 'orange'}
        >
          {active ? 'Active' : 'Inactive'}
        </Tag>
      );
    };

    const renderLocked = ({ _id, locked, roles }) => {
      return (
        <Tag
          visible={!roles.some(r => r.code === 'admin')}
          style={{ cursor: 'pointer' }}
          onClick={() => this.props.switchLockStatus(_id)}
          color={locked ? 'red' : 'green'}
        >
          {locked ? 'Locked' : 'Unlocked'}
        </Tag>
      );
    };

    const renderRoles = roles => {
      return _.map(roles, 'name').join(',');
    };

    return (
      <Row>
        <Col span="24">
          <Table
            pagination={{
              onChange: (page, recordsPerPage) => this.props.fetchUsers(this.state.filters, page, recordsPerPage),
              total: this.props.totalUsers,
              defaultPageSize: 20,
            }}
            size="small"
            dataSource={this.props.users}
            loading={this.props.tableLoading}
            rowKey={record => record._id}
            scroll={{ x: 2200 }}
            bordered
          >
            <Column title="ID" dataIndex="code" />
            <Column title="Azure ID" dataIndex="oid" />
            <Column title="Name" dataIndex="name" />
            <Column title="Email" dataIndex="email" />
            <Column title="Mobile" dataIndex="mobile" />
            <Column title="OTP Attempts" dataIndex="otpAttempts" />
            <Column title="Job Title(Azure)" dataIndex="jobTitle" />
            {this.props.selectedState === userState.UNINITIALIZED && (
              <Column title="Department(Azure)" dataIndex="division" />
            )}
            {this.props.selectedState === userState.INITIALIZED && (
              <>
                <Column title="Roles" dataIndex="roles" render={roles => renderRoles(roles)} />
                <Column title="Department" dataIndex="department" render={department => _.get(department, 'name')} />
              </>
            )}
            <ColumnGroup title="Status">
              <Column width={30} render={renderActive} />
              <Column width={30} render={renderLocked} />
            </ColumnGroup>
          </Table>
        </Col>
      </Row>
    );
  };

  renderModal = () => {
    const title = (
      <Title style={{ textAlign: 'center' }} level={4}>
        <Text level={2} className="blueColor">
          Update
        </Text>
      </Title>
    );
    return (
      <Modal title={title} width={'50%'} onClose={this.closeModal} visible={this.state.modalVisibility} footer={null}>
        <UpdateForm
          reference={this.formRef}
          loginMethods={this.props.loginMethods}
          departments={this.props.departments}
          roles={this.props.roles}
          selectedUser={this.state.selectedUser}
          onFormSubmit={this.onUserUpdate}
          onCancel={this.closeModal}
          buttonLoading={this.props.buttonLoading}
          supervisors={this.props.supervisors}
          supervisorLoading={this.props.supervisorLoading}
          entities={this.props.entities}
          fetchSupervisors={this.props.fetchSupervisors}
        />
      </Modal>
    );
  };

  onChangeFilter(key, value) {
    let { filters } = this.state;
    if (value !== null) {
      filters[key] = value;
    } else {
      delete filters[key];
    }
    this.setState({ filters });
    this.props.fetchUsers(filters);
  }
}

const mapStateToProps = state => ({
  users: state.user.users,
  supervisors: state.shared.supervisors,
  supervisorLoading: state.shared.supervisorLoading,
  entities: state.shared.entities,
  totalUsers: state.user.totalUsers,
  roles: state.user.roles,
  departments: state.user.departments,
  tableLoading: state.user.tableLoading,
  buttonLoading: state.user.buttonLoading,
  searchLoading: state.user.searchLoading,
  syncButtonLoading: state.user.syncButtonLoading,
  selectedState: state.user.selectedState,
  selectedActiveState: state.user.selectedActiveState,
  loginMethods: state.user.loginMethods,
});

export default connect(mapStateToProps, {
  fetchUsers,
  fetchRoles,
  updateUser,
  switchActiveStatus,
  switchLockStatus,
})(User);
