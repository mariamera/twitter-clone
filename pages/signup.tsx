import Link from 'next/link';
import { FunctionComponent } from "react";
import Signup from "../src/components/Signup"

const Patients: FunctionComponent = () => {
  return (
    <div className="w-full flex flex-wrap align-center justify-center p-8">
      <Signup />
    </div>
  )

}

export default Patients;
