import Link from 'next/link';
import { FunctionComponent } from "react";
import Signup from "../src/components/Signup"
import { AuthProvider } from '../src/context/authContext';

const Patients: FunctionComponent = () => {
  return (
    <AuthProvider>
      <div className="w-full flex flex-wrap align-center justify-center p-8">
        <Signup />
      </div>
    </AuthProvider>
  )

}

export default Patients;
