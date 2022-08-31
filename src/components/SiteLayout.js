import { Layout, Typography } from 'antd'
import { Component } from 'react'

const { Header, Content } = Layout

export class SiteLayout extends Component {

  render() {
    return (
      <Layout>
        <Header
          style={{
            position: 'fixed',
            zIndex: 1,
            width: '100%',
            textAlign: 'center',
            backgroundColor: 'white'
          }}
        >
          <Typography.Title className="logo" style={{ color: '#008cff' }}>User Manager</Typography.Title>
        </Header>
        <Content
          style={{
            padding: '96px 32px 32px',
            minHeight: '100vh',
            backgroundColor: 'rgba(0,0,0,0.02)',
          }}
        >
          {this.props.children}
        </Content>
      </Layout>
    )
  }
}

export default SiteLayout