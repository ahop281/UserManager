import { Routes, Route } from 'react-router-dom'
import './App.css'
import { SiteLayout } from './components/SiteLayout';
import { Home } from './containers'

function App() {
  return (
    <SiteLayout>
      <Routes>
        <Route index element={<Home />} />
        {/* <Route path='/user-form' element={<UserForm />} />
        <Route path='/:userId' element={<UserDetail />} /> */}
      </Routes>
    </SiteLayout>
  );
}

export default App;
