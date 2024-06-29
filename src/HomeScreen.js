import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Switch,
  Keyboard,
} from 'react-native';
import styles from "./style/HomeScreenStyle"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const departments = ['Android', 'iOS', 'Web'];

const App = () => {
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [employees, setEmployees] = useState({});
  const [error, setError] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const savedDepartments = await AsyncStorage.getItem('departments');
      const savedEmployees = await AsyncStorage.getItem('employees');
      if (savedDepartments) setSelectedDepartments(JSON.parse(savedDepartments));
      if (savedEmployees) setEmployees(JSON.parse(savedEmployees));
    };
    loadData();
  }, []);

  const saveData = async () => {
    let hasErrors = false;
    const newError = {};
    const cleanedEmployees = {};

    Object.keys(employees).forEach(department => {
      cleanedEmployees[department] = employees[department].filter((employee, index) => {
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employee.email);
        if (!isValidEmail) {
          newError[`${department}-${index}`] = 'Enter valid email';
          hasErrors = true;
          return false;
        }
        const departmentEmployees = employees[department] || [];
        const isDuplicate = departmentEmployees.some((emp, i) => emp.email === employee.email && i !== index);
        if (isDuplicate) {
          newError[`${department}-${index}`] = 'Employee already exists in this department';
          hasErrors = true;
          return false;
        }
        return true;
      });
    });

    if (hasErrors) {
      setError(newError);
    } else {
      await AsyncStorage.setItem('departments', JSON.stringify(selectedDepartments));
      await AsyncStorage.setItem('employees', JSON.stringify(cleanedEmployees));
      setEmployees(cleanedEmployees);
      setSaved(true);
      Keyboard.dismiss();
    }
  };

  const addDepartment = (department) => {
    if (!selectedDepartments.includes(department)) {
      setSelectedDepartments([...selectedDepartments, department]);
    }
  };

  const addEmployeeField = (department) => {
    if (!employees[department]) {
      employees[department] = [];
    }

    const departmentEmployees = employees[department];
    if (departmentEmployees.length > 0 && departmentEmployees[departmentEmployees.length - 1].email === '') {
      setError({ ...error, [`${department}-${departmentEmployees.length - 1}`]: 'Enter valid email before adding new employee' });
      return;
    }

    setEmployees({
      ...employees,
      [department]: [...employees[department], { email: '', active: false }],
    });

    // Clear error for new empty email field
    const updatedErrors = { ...error };
    delete updatedErrors[`${department}-${departmentEmployees.length}`];
    setError(updatedErrors);
  };

  const updateEmployee = (department, index, key, value) => {
    const updatedEmployees = { ...employees };
    updatedEmployees[department][index][key] = value;
    setEmployees(updatedEmployees);
  };

  const removeEmployee = (department, index) => {
    const updatedEmployees = { ...employees };
    const removedEmployee = updatedEmployees[department][index];
    const removedEmployeeEmail = removedEmployee.email;
    updatedEmployees[department].splice(index, 1);

    if (updatedEmployees[department].length === 0) {
      delete updatedEmployees[department];
      setSelectedDepartments(selectedDepartments.filter(dep => dep !== department));
    }

    setEmployees(updatedEmployees);

    // Remove the corresponding error
    const updatedErrors = { ...error };
    delete updatedErrors[`${department}-${index}`];

    // Check duplicates of the  email
    let hasDuplicate = false;
    Object.keys(updatedErrors).forEach(key => {
      const [depKey, idxKey] = key.split('-');
      if (depKey === department && updatedEmployees[department][idxKey]?.email === removedEmployeeEmail) {
        hasDuplicate = true;
        delete updatedErrors[key];
      }
    });

    setError(updatedErrors);
  };

  const validateEmail = (department, index, email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      setError({ ...error, [`${department}-${index}`]: 'Enter valid email' });
    } else {
      const departmentEmployees = employees[department] || [];
      const isDuplicate = departmentEmployees.some((emp, i) => emp.email === email && i !== index);
      if (isDuplicate) {
        setError({ ...error, [`${department}-${index}`]: 'Employee already exists in this department' });
      } else {
        const updatedErrors = { ...error };
        delete updatedErrors[`${department}-${index}`];
        setError(updatedErrors);
      }
    }
  };

  const renderDepartment = ({ item: department }) => (
    <View style={styles.departmentContainer}>
      <View style={styles.departmentHeader}>
        <Text style={styles.departmentTitle}>{department}</Text>
        <TouchableOpacity onPress={() => addEmployeeField(department)} style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />
      <FlatList
        data={employees[department]}
        keyExtractor={(_, index) => `${department}-${index}`}

        renderItem={({ item, index }) => (
          <View style={{ flex: 1 }}>
            <View style={styles.employeeContainer}>
              <View style={{ flex: 1 }}>
                <TextInput
                  style={[styles.input, saved && { color: 'green' }]}
                  placeholder="Employee email"
                  value={item.email}
                  onChangeText={(text) => updateEmployee(department, index, 'email', text)}
                  onBlur={() => validateEmail(department, index, item.email)}
                />
                {error[`${department}-${index}`] && (
                  <Text style={styles.error}>{error[`${department}-${index}`]}</Text>
                )}
              </View>
              <TouchableOpacity onPress={() => removeEmployee(department, index)}>
                <Text style={styles.removeButton}>Remove</Text>
              </TouchableOpacity>
              <Switch
                value={item.active}
                onValueChange={(value) => updateEmployee(department, index, 'active', value)}
              />
            </View>
          </View>
        )}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={saveData} style={styles.button}>
        <Text style={styles.btntext}>Save</Text>
      </TouchableOpacity>

      <FlatList
        data={selectedDepartments}
        keyExtractor={(item) => item}
        renderItem={renderDepartment}
      />
      {/* {console.log("select department", selectedDepartments)} */}
      <Picker
        selectedValue={selectedDepartments}
        mode="dropdown"
        onValueChange={(itemValue) => {
          setSelectedDepartments(itemValue);
          if (itemValue) addDepartment(itemValue);
        }}
        style={styles.picker}

      >
        <Picker.Item label={selectedDepartments.length == 0 ? 'Select Department' : selectedDepartments} value="" />
        {departments.map((department) => (
          <Picker.Item
            key={department}
            label={department}
            value={department}
            enabled={!selectedDepartments.includes(department)}
            style={{ color: "#151515" }}
          />
        ))}
      </Picker>
    </SafeAreaView>
  );
};


export default App;
