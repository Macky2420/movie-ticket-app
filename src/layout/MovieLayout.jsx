import { 
  QuestionCircleOutlined, 
  FormOutlined, 
  DesktopOutlined, 
  MenuFoldOutlined, 
  MenuUnfoldOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Breadcrumb } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useOutlet, useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import MovieLogo from '../assets/logo.png';

const { Header, Sider, Content } = Layout;

const GET_USER_INFO = gql`
  query GetUser($user_id: uuid!) {
    users_by_pk(id: $user_id) {
      username
    }
  }
`;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const outlet = useOutlet();
  const { user_id } = useParams();

  const { loading, error, data } = useQuery(GET_USER_INFO, {
    variables: { user_id },
    skip: !user_id,
  });

  useEffect(() => {
    if (!loading && !error && data) {
      setUsername(data.users_by_pk.username);
    }
  }, [data, loading, error]);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const menuHandleClick = ({ key }) => {
    if (key === 'logout') {
      handleLogout();
    } else {
      navigate(key);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUsername('');
    navigate('/');
  };

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          onClick={menuHandleClick}
          defaultSelectedKeys={location.pathname}
          style={{ alignItems: 'center' }}
          items={[
            {
              key: `/movielist/${user_id}`,
              icon: <DesktopOutlined style={{ fontSize: '20px' }} />,
              label: 'Movie List',
            },
            {
              key: `/addticket/${user_id}`,
              icon: <FormOutlined style={{ fontSize: '20px' }} />,
              label: 'Add Ticket',
            },
            {
              key: `/help/${user_id}`,
              icon: <QuestionCircleOutlined style={{ fontSize: '20px' }} />,
              label: 'Help',
            },
            {
              key: 'logout',
              icon: <LogoutOutlined style={{ fontSize: '20px' }} />,
              label: 'Logout',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 500,
            background: colorBgContainer,
          }}
        >
          <Breadcrumb style={{ margin: '16px 0' }} className="font-bold" separator=">">
            {location.pathname.split('/').map((path, index, array) => (
              <Breadcrumb.Item key={index}>
                {index === 1 && <span>{username}</span>}
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>

          <div className="flex justify-center">
            <div className="inline-flex">
              <img className="object-contain h-15 w-15" src={MovieLogo} alt="Movie Logo" />
              <p className="font-bold text-blue-950 text-3xl pl-3 pt-3 duration-200 hover:underline decoration-sky-500 hover:font-semibold">
                FilmFare
              </p>
            </div>
          </div>
          <Paragraph>{outlet}</Paragraph>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;