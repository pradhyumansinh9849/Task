import {  StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
  },
  departmentContainer: {
    marginVertical: 10,
  },
  departmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  departmentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color:"#151515",
  },

  button: {
    alignSelf: "flex-end",
    marginVertical: 20
  },
  btntext: {
    fontSize: 24,
    color: "#151515",
 
  },
  picker: {
    height: 100,
    width: '100%',
  },
  addButton: {
    backgroundColor: '#ccc',
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 30,
    fontWeight: 'bold',
    
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
    flex: 1,
  },
  error: {
    color: 'red',
  },
  employeeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  removeButton: {
    color: 'blue',
    marginHorizontal: 10,
  },
  selectDepartmentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  selectButton: {
    padding: 10,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  separator: {
    height: 2,
    backgroundColor: '#151515',
   marginTop:10 , 
   marginBottom:10
    
  },
});
