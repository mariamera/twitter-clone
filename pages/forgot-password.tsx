import Link from 'next/link';
import { AuthProvider } from '../src/context/authContext';
import ForgotPassword from '../src/components/ForgotPassword';

const ForgotPasswordPage: FunctionComponent = () => {

  return (
    <div className="w-full flex align-center justify-center">
      <ForgotPassword/>
    </div>
  )

}

export default ForgotPasswordPage;
