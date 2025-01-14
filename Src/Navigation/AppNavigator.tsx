

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../Screen/Login/Login';
import SignUp from '../Screen/SignUp/SignUp';
import Dashbord from '../Screen/Dashbord/Dashbord';
import DrawerNavigator from './DrawerNavigator';
import AddInvoice from '../Screen/Invoice/AddInvoice';
import EditInvoice from '../Screen/Invoice/EditInvoice';
import Task from '../Screen/Task/Task';
import Profile from '../Screen/Profile/Profile';
import ViewSupplier from '../Screen/Supplier/ViewSupplier';
import AddCloser from '../Screen/Closer/AddCloser';
import Authuser from '../Screen/Authuser/Authuser';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Authuser' component={Authuser}/>
      <Stack.Screen name='Login' component={Login}/>
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Home" component={DrawerNavigator}  />
      <Stack.Screen name="AddInvoice" component={AddInvoice}  />
      <Stack.Screen name="EditInvoice" component={EditInvoice}  />
      <Stack.Screen name="Task" component={Task}  />
      <Stack.Screen name="Profile" component={Profile}  />
      <Stack.Screen name="ViewSupplier" component={ViewSupplier}  />
      <Stack.Screen name="AddCloser" component={AddCloser}  />
     
      </Stack.Navigator>
    </NavigationContainer>
  );
}