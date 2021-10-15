import { FunctionComponent } from "react";
import LogIn from "../src/components/LogIn"

const Patients: FunctionComponent = () => {
  return (
    <div className="w-full flex align-center justify-center">
      <div className="w-100 max-h-[480px] m-8">
        <LogIn />
      </div>
    </div>
  )

}

export default Patients;
