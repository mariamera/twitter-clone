import Link from 'next/link';
import { FunctionComponent } from "react";
import LogIn from "../src/components/LogIn"
import { AuthProvider } from '../src/context/authContext';

const Patients: FunctionComponent = () => {
  return (
    <AuthProvider>
      <div className="w-full flex align-center justify-center">
        <div className="w-100 max-h-[480px] m-8">
          <LogIn/>
        </div>
      </div>
    </AuthProvider>
  )

}

export default Patients;
