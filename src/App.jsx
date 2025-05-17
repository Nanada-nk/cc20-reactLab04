/** @format */

import Userform from "./components/Userform.jsx";

function App() {
  return (
    <div className="app border bg-amber-400 grid grid-cols-2">
      <Userform is_update_form={true} />
      <Userform is_update_form={false} />
    </div>
  );
}

export default App;
