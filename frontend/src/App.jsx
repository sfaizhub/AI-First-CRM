import { Routes, Route } from "react-router-dom";


import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";

import CreateHCP from "./pages/CreateHCP";

import LogInteraction from "./pages/LogInteraction";

import InteractionHistory from "./pages/InteractionHistory";

import AIChat from "./pages/AIChat";


import MainLayout from "./layout/MainLayout";


import ProtectedRoute from "./components/ProtectedRoute";




function App(){


return(

<Routes>



<Route

path="/"

element={<Login />}

/>






<Route

element={

<ProtectedRoute>

<MainLayout />

</ProtectedRoute>

}

>



<Route

path="/dashboard"

element={<Dashboard />}

/>



<Route

path="/create-hcp"

element={<CreateHCP />}

/>



<Route

path="/log-interaction"

element={<LogInteraction />}

/>



<Route

path="/history"

element={<InteractionHistory />}

/>



<Route

path="/ai-chat"

element={<AIChat />}

/>



</Route>



</Routes>


);


}



export default App;